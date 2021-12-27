import tool from "./tool.glsl.js"
/**
 * 物理材质,METALLIC WORKFLOW
 * @returns
 */
export function getMaterial(_param) {
  const param = {
     ior: 1.5,
     metallic: 1,
     roughness: 1,
     baseColor: { x: 1, y: 1, z: 1 },
     texture: _param.texture
   };
   _param.ior !== undefined && (param.ior = _param.ior);
   _param.metallic !== undefined && (param.metallic = _param.metallic);
   _param.roughness !== undefined && (param.roughness = _param.roughness);

  if (_param.baseColor !== undefined) {
     param.baseColor.x = _param.baseColor.x;
     param.baseColor.y = _param.baseColor.y;
     param.baseColor.z = _param.baseColor.z;
   }

  const vertexShader = `#version 300 es
      precision mediump float;
      in vec3 aPosition;
      in vec3 aNormal;
      out vec3 vNormalW;
      out vec3 vPositionW;

      uniform mat4 world;
      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform vec3 lightDirction;

      void main() {
        mat3 normalWorld = mat3(world);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        vNormalW = normalize(normalWorld * aNormal);
        vec4 worldPos = world * vec4(aPosition, 1.0);
        vPositionW = vec3(worldPos);
      }
    `

  const fragmentShader = `#version 300 es
      precision mediump float;
      layout(std140, column_major) uniform;
      const float PI = 3.1415926535897932384626433832795;
      const float HALF_MIN = 5.96046448e-08;
      const float LinearEncodePowerApprox = 2.2;
      const float GammaEncodePowerApprox = 1.0/LinearEncodePowerApprox;
      const vec3 LuminanceEncodeApprox = vec3(0.2126, 0.7152, 0.0722);
      const float Epsilon = 0.0000001;
      #define saturate(x) clamp(x, 0.0, 1.0)
      #define absEps(x) abs(x)+Epsilon
      #define maxEps(x) max(x, Epsilon)
      #define saturateEps(x) clamp(x, Epsilon, 1.0)

      uniform vec3 vEyePosition;
      uniform vec3 vAmbientColor;
      uniform vec4 vCameraInfos;

      // material
      uniform vec4 vAlbedoColor;
      uniform vec4 vMetallicReflectanceFactors;
      uniform vec4 vReflectivityColor;
      uniform sampler2D environmentBrdfSampler;
      uniform vec4 vLightingIntensity;

      uniform Light0 {
        vec4 vLightData;
        vec4 vLightDiffuse;
        vec4 vLightSpecular;
        vec3 vLightGround;
        vec4 shadowsInfo;
        vec2 depthValues;
      } light0;

      in vec3 vPositionW;
      in vec3 vNormalW;
      out vec4 FragColor;

      #define RECIPROCAL_PI2 0.15915494
      #define RECIPROCAL_PI 0.31830988618
      #define MINIMUMVARIANCE 0.0005
      ${tool}

      // 将粗糙度转换为平均斜率
      float convertRoughnessToAverageSlope(float roughness) {
          return square(roughness) + MINIMUMVARIANCE;
      }

      // 环境BRDF
      vec3 getBRDFLookup(float NdotV, float perceptualRoughness) {
          vec2 UV = vec2(NdotV, perceptualRoughness);
          vec4 brdfLookup = texture(environmentBrdfSampler, UV);
          // vec4 brdfLookup = vec4(0.);
          return brdfLookup.rgb;
      }

      struct lightingInfo {
          vec3 diffuse;
          vec3 specular;
      };

      struct reflectivityOutParams {
        float roughness;
        vec3 surfaceReflectivityColor;
      };

      /**
        * @param vReflectivityColor,  r: 金属度, g:粗糙度
        */
      void reflectivityBlock(
        const in vec4 vReflectivityColor,
        const in vec3 baseColor,
        const in vec4 metallicReflectanceFactors,
        out reflectivityOutParams outParams
      ) {
          vec3 surfaceReflectivityColor = vReflectivityColor.rgb;
          // r: 金属度, g:粗糙度
          vec2 metallicRoughness = surfaceReflectivityColor.rg;

          // 金属反射系数
          vec3 metallicF0 = metallicReflectanceFactors.rgb;

          // 计算法向入射的反射率； 如果介电（如塑料）使用 F0 = 0.04，如果它是金属，使用反照率颜色作为 F0（金属工作流程）
          surfaceReflectivityColor = mix(metallicF0, baseColor, metallicRoughness.r);

          outParams.roughness = metallicRoughness.g;
          outParams.surfaceReflectivityColor = surfaceReflectivityColor;
      }

      struct preLightingInfo {
        vec3 lightOffset;
        float lightDistanceSquared;
        float lightDistance;
        float attenuation;
        vec3 L;
        vec3 H;
        float NdotV;
        float NdotLUnclamped;
        float NdotL;
        float VdotH;
        float roughness;
    };

      preLightingInfo computeHemisphericPreLightingInfo(
        vec4 lightData,
        vec3 V,
        vec3 N) {
          preLightingInfo result;
          result.NdotL = dot(N, lightData.xyz)*0.5+0.5;
          result.NdotL = saturateEps(result.NdotL);
          result.NdotLUnclamped = result.NdotL;
          result.L = normalize(lightData.xyz);
          result.H = normalize(V+result.L);
          result.VdotH = saturate(dot(V, result.H));
          return result;
      }

      // GGX Mask/Shadowing Isotropic
      // Heitz http://jcgt.org/published/0003/02/03/paper.pdf
      // https://twvideo01.ubm-us.net/o1/vault/gdc2017/Presentations/Hammon_Earl_PBR_Diffuse_Lighting.pdf
      float smithVisibility_GGXCorrelated(float NdotL, float NdotV, float alphaG) {
          float a2 = alphaG*alphaG;
          float GGXV = NdotL*sqrt(NdotV*(NdotV-a2*NdotV)+a2);
          float GGXL = NdotV*sqrt(NdotL*(NdotL-a2*NdotL)+a2);
          return 0.5/(GGXV+GGXL);
      }

      // Trowbridge-Reitz (GGX)
      // Generalised Trowbridge-Reitz with gamma power=2.0
      float normalDistributionFunction_TrowbridgeReitzGGX(float NdotH, float alphaG) {
          float a2 = square(alphaG);
          float d = NdotH*NdotH*(a2-1.0)+1.0;
          return a2/(PI*d*d);
      }

      vec3 fresnelSchlickGGX(float VdotH, vec3 reflectance0, vec3 reflectance90) {
          return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);
      }
      float fresnelSchlickGGX(float VdotH, float reflectance0, float reflectance90) {
          return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);
      }

      vec3 computeHemisphericDiffuseLighting(preLightingInfo info, vec3 lightColor, vec3 groundColor) {
        return mix(groundColor, lightColor, info.NdotL);
      }

      vec3 computeSpecularLighting(preLightingInfo info, vec3 N, vec3 reflectance0, vec3 reflectance90, float geometricRoughnessFactor, vec3 lightColor) {
        float NdotH = saturateEps(dot(N, info.H));
        float roughness = max(info.roughness, geometricRoughnessFactor);
        float alphaG = convertRoughnessToAverageSlope(roughness);
        vec3 fresnel = fresnelSchlickGGX(info.VdotH, reflectance0, reflectance90);
        float distribution = normalDistributionFunction_TrowbridgeReitzGGX(NdotH, alphaG);
        float smithVisibility = smithVisibility_GGXCorrelated(info.NdotL, info.NdotV, alphaG);
        vec3 specTerm = fresnel*distribution*smithVisibility;
        return specTerm*info.attenuation*info.NdotL*lightColor;
      }

      // http://www.jcgt.org/published/0008/01/03/
      // http://advances.realtimerendering.com/s2018/Siggraph%202018%20HDRP%20talk_with%20notes.pdf
      #define FRESNEL_MAXIMUM_ON_ROUGH 0.25
      vec3 getEnergyConservationFactor(const vec3 specularEnvironmentR0, const vec3 environmentBrdf) {
          return 1.0+specularEnvironmentR0*(1.0/environmentBrdf.y-1.0);
      }

      vec4 applyImageProcessing(vec4 result) {
          result.rgb = toGammaSpace(result.rgb);
          result.rgb = saturate(result.rgb);
          return result;
      }

      void main() {
        vec3 viewDirectionW = normalize(vEyePosition.xyz-vPositionW);
        vec3 normalW = normalize(vNormalW);
        vec3 geometricNormalW = normalW;

        float alpha = vAlbedoColor.w;
        vec3 baseColor = vAlbedoColor.rgb;
        reflectivityOutParams reflectivityOut;

        // 反射率块
        reflectivityBlock(
          vReflectivityColor,
          baseColor,
          vMetallicReflectanceFactors,
          reflectivityOut
        );

        // FragColor = vec4(vec3(reflectivityOut.surfaceAlbedo), 1.0);
        // return;

        float roughness = reflectivityOut.roughness;

        float NdotVUnclamped = dot(normalW, viewDirectionW);
        float NdotV = absEps(NdotVUnclamped);
        float alphaG = convertRoughnessToAverageSlope(roughness);

        vec2 AARoughnessFactors = vec2(0.);
        vec3 environmentBrdf = getBRDFLookup(NdotV, roughness);

        vec3 specularEnvironmentR0 = reflectivityOut.surfaceReflectivityColor.rgb;
        vec3 specularEnvironmentR90 = vec3(vMetallicReflectanceFactors.a);

        preLightingInfo preInfo;
        preInfo = computeHemisphericPreLightingInfo(light0.vLightData, viewDirectionW, normalW);
        preInfo.NdotV = NdotV;
        preInfo.attenuation = 1.0;
        preInfo.roughness = roughness;

        lightingInfo info;
        info.diffuse = computeHemisphericDiffuseLighting(preInfo, light0.vLightDiffuse.rgb, light0.vLightGround);
        info.specular = computeSpecularLighting(
          preInfo,
          normalW,
          specularEnvironmentR0,
          specularEnvironmentR90,
          AARoughnessFactors.x,
          light0.vLightDiffuse.rgb);

        vec3 diffuseBase = vec3(0., 0., 0.);
        vec3 specularBase = vec3(0., 0., 0.);
        diffuseBase += info.diffuse;
        specularBase += info.specular;

        vec3 energyConservationFactor = getEnergyConservationFactor(specularEnvironmentR0, environmentBrdf);
        vec3 finalSpecular = specularBase;
        finalSpecular = max(finalSpecular, 0.0);
        vec3 finalSpecularScaled = finalSpecular*vLightingIntensity.x * vLightingIntensity.w;
        finalSpecularScaled *= energyConservationFactor;

        vec3 finalDiffuse = diffuseBase;
        finalDiffuse *= baseColor.rgb;
        finalDiffuse = max(finalDiffuse, 0.0);
        finalDiffuse *= vLightingIntensity.x;

        vec3 finalAmbient = vAmbientColor;
        finalAmbient *= baseColor.rgb;

        vec4 finalColor = vec4(
          finalAmbient+
          finalDiffuse +
          finalSpecularScaled,
          alpha
        );

        finalColor = max(finalColor, 0.0);
        finalColor = applyImageProcessing(finalColor);
        FragColor = finalColor;
      }
      `
  return {
    param,
    vertexShader,
    fragmentShader,
    type: "physical",
    uniforms: {
      vLightingIntensity: { type: "v4", value: { x: 1, y: 1, z: 1, w: 1 } },
      // 漫反射颜色
      vAlbedoColor: { type: "v4", value: { x: 1, y: 1, z: 1, w: 1 } },
      // 复合属性,x:metallic, y:roughness
      vReflectivityColor: { type: "v4", value: { x: 1, y: 0.555, z: 1, w: 1 } },
      // 自动计算,f0
      vMetallicReflectanceFactors: { type: "v4", value: { x: 0.04, y: 0.04, z: 0.04, w: 1 } },
      // 环境颜色
      vAmbientColor: { type: "v3", value: { x: 0, y: 0, z: 0 } },
      Light0: {
        type: "block",
        value: {
          vLightData: { type: "v4", value: { x: 0, y: 1, z: 0, w: 1 } },
          vLightDiffuse: { type: "v4", value: { x: 1, y: 1, z: 1, w: 0 } },
          vLightSpecular: { type: "v4", value: { x: 1, y: 1, z: 1, w: 0 } },
          vLightGround: { type: "v3", value: { x: 0, y: 0, z: 0 } },
          shadowsInfo: { type: "v4", value: { x: 0, y: 0, z: 0, w: 0 } },
          depthValues: { type: "v2", value: { x: 0, y: 0 } },
        }
      },
      environmentBrdfSampler: {
        value: param.texture,
        type: "t"
      }
    }
  }
}
