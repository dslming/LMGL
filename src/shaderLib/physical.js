import tool from "./tool.glsl.js"
import reflection from '../modules/pbr/reflection.glsl.js'

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
    environmentBrdfSampler: _param.environmentBrdfSampler,
    reflectionSampler: _param.reflectionSampler,
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
      out vec3 vEnvironmentIrradiance;

      uniform mat4 world;
      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform vec3 lightDirction;

      uniform mat4 reflectionMatrix;
      uniform vec3 vSphericalL00;
      uniform vec3 vSphericalL1_1;
      uniform vec3 vSphericalL10;
      uniform vec3 vSphericalL11;
      uniform vec3 vSphericalL2_2;
      uniform vec3 vSphericalL2_1;
      uniform vec3 vSphericalL20;
      uniform vec3 vSphericalL21;
      uniform vec3 vSphericalL22;

      // Please note the the coefficient have been prescaled.
      //
      // This uses the theory from both Sloan and Ramamoothi:
      //   https://www.ppsloan.org/publications/SHJCGT.pdf
      //   http://www-graphics.stanford.edu/papers/envmap/
      // The only difference is the integration of the reconstruction coefficients direcly
      // into the vectors as well as the 1 / pi multiplication to simulate a lambertian diffuse.
      vec3 computeEnvironmentIrradiance(vec3 normal) {
        return vSphericalL00
        +vSphericalL1_1*(normal.y)
        +vSphericalL10*(normal.z)
        +vSphericalL11*(normal.x)
        +vSphericalL2_2*(normal.y*normal.x)
        +vSphericalL2_1*(normal.y*normal.z)
        +vSphericalL20*((3.0*normal.z*normal.z)-1.0)
        +vSphericalL21*(normal.z*normal.x)
        +vSphericalL22*(normal.x*normal.x-(normal.y*normal.y));
      }

      void main() {
        mat3 normalWorld = mat3(world);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        vNormalW = normalize(normalWorld * aNormal);
        vec4 worldPos = world * vec4(aPosition, 1.0);
        vPositionW = vec3(worldPos);

        vec3 reflectionVector = vec3(reflectionMatrix * vec4(vNormalW, 0)).xyz;
        vEnvironmentIrradiance = computeEnvironmentIrradiance(reflectionVector);
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
      uniform vec4 vLightingIntensity;

      uniform Light0 {
        vec4 vLightData;
        vec4 vLightDiffuse;
        vec4 vLightSpecular;
        vec3 vLightGround;
      } light0;

      in vec3 vPositionW;
      in vec3 vNormalW;
      in vec3 vEnvironmentIrradiance;
      out vec4 FragColor;

      #define RECIPROCAL_PI2 0.15915494
      #define RECIPROCAL_PI 0.31830988618
      #define MINIMUMVARIANCE 0.0005
      ${tool}


      // 将粗糙度转换为平均斜率
      float convertRoughnessToAverageSlope(float roughness) {
          return square(roughness) + MINIMUMVARIANCE;
      }

      // Crytek: Moving to the Next Generation - The Rendering Technology of Ryse [GDC14]
      float roughness_remap(float roughness)
      {
        return pow(1.0 - (1.0 - roughness) * 0.7, 6.0);
      }

      struct lightingInfo {
          vec3 diffuse;
          vec3 specular;
      };

      struct reflectivityOutParams {
        float roughness;
        // specular
        vec3 surfaceReflectivityColor;
        // diffuse
        vec3 surfaceAlbedo;
      };

      /**
        * 计算反射后的漫反射和高光反射
        * @param vReflectivityColor,  r: 金属度, g:粗糙度
        */
      void reflectivityBlock(
        const in vec4 vReflectivityColor,
        const in vec3 baseColor,
        const in vec4 metallicReflectanceFactors,
        out reflectivityOutParams outParams
      ) {
          float metallic = vReflectivityColor.r;
          float roughness = vReflectivityColor.g;
          outParams.roughness = roughness;

          // specular 反射系数
          vec3 metallicF0 = metallicReflectanceFactors.rgb;
          outParams.surfaceReflectivityColor = mix(metallicF0, baseColor, metallic);

          // Following Frostbite Remapping,
          // https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf page 115
          // vec3 f0 = 0.16 * reflectance * reflectance * (1.0 - metallic) + baseColor * metallic;
          // where 0.16 * reflectance * reflectance remaps the reflectance to allow storage in 8 bit texture
          outParams.surfaceAlbedo = baseColor.rgb * (1.0 - metallic);
          // outParams.surfaceAlbedo = mix(baseColor.rgb * (1.0 - metallicF0), vec3(0., 0., 0.), metallic);
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
      // Beckmann: The scattering of electromagnetic waves from rough surfaces [Beckmann63]
      float normalDistributionFunction_TrowbridgeReitzGGX(float NdotH, float alphaG) {
          float a2 = square(alphaG);
          float d = NdotH*NdotH*(a2-1.0)+1.0;
          return a2/(PI*d*d);
      }

      // Schlick Approximation: An Inexpensive BRDF Model for Physically-based Rendering [Schlick94]
      vec3 fresnelSchlickGGX(float VdotH, vec3 reflectance0, vec3 reflectance90) {
          return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);
      }
      float fresnelSchlickGGX(float VdotH, float reflectance0, float reflectance90) {
        return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);
      }

      // 半球光的 diffuse
      vec3 computeHemisphericDiffuseLighting(preLightingInfo info, vec3 lightColor, vec3 groundColor) {
        return mix(groundColor, lightColor, info.NdotL);
      }

      // Specular
      vec3 computeSpecularLighting(preLightingInfo info, vec3 N, vec3 reflectance0, vec3 reflectance90, vec3 lightColor) {
        float NdotH = saturateEps(dot(N, info.H));
        float roughness = info.roughness;
        float alphaG = convertRoughnessToAverageSlope(roughness);
        // float alphaG = roughness_remap(roughness);
        vec3 fresnel = fresnelSchlickGGX(info.VdotH, reflectance0, reflectance90);
        float distribution = normalDistributionFunction_TrowbridgeReitzGGX(NdotH, alphaG);
        float smithVisibility = smithVisibility_GGXCorrelated(info.NdotL, info.NdotV, alphaG);
        vec3 specTerm = fresnel * distribution * smithVisibility;
        vec3 irradiance = info.NdotL * lightColor * info.attenuation;
        return irradiance * specTerm;
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
      ${reflection(param.reflectionSampler)}

      void main() {
        vec3 viewDirectionW = normalize(vEyePosition.xyz-vPositionW);
        vec3 normalW = normalize(vNormalW);

        float alpha = vAlbedoColor.w;
        vec3 baseColor = vAlbedoColor.rgb;
        reflectivityOutParams reflectivityOut;

        reflectivityBlock(
          vReflectivityColor,
          baseColor,
          vMetallicReflectanceFactors,
          reflectivityOut
        );

        float roughness = reflectivityOut.roughness;
        vec3 surfaceAlbedo = reflectivityOut.surfaceAlbedo;
        vec3 specularEnvironmentR0 = reflectivityOut.surfaceReflectivityColor.rgb;
        vec3 specularEnvironmentR90 = vec3(vMetallicReflectanceFactors.a);

        float NdotVUnclamped = dot(normalW, viewDirectionW);
        float NdotV = absEps(NdotVUnclamped);


        vec3 diffuseBase = vec3(0., 0., 0.);
        vec3 specularBase = vec3(0., 0., 0.);

        vec4 metallicReflectanceFactors = vMetallicReflectanceFactors;
        #ifdef USE_ENV_MAP
        vec3 a = aaa(
          roughness,
          NdotV,
          NdotVUnclamped,
          vPositionW,
          normalW,
          vEnvironmentIrradiance,
          reflectivityOut,
          surfaceAlbedo,
          metallicReflectanceFactors
        );
        #endif

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
          light0.vLightDiffuse.rgb
        );
        diffuseBase += info.diffuse;
        specularBase += info.specular;

        vec3 finalSpecular = specularBase;
        finalSpecular = max(finalSpecular, 0.0);
        vec3 finalSpecularScaled = finalSpecular*vLightingIntensity.x * vLightingIntensity.w;

        vec3 finalDiffuse = diffuseBase;
        finalDiffuse *= surfaceAlbedo.rgb;
        finalDiffuse = max(finalDiffuse, 0.0);
        finalDiffuse *= vLightingIntensity.x;

        vec3 finalAmbient = vAmbientColor;
        finalAmbient *= surfaceAlbedo.rgb;

        vec4 finalColor = vec4(
          finalAmbient+
          finalDiffuse +
          finalSpecularScaled
          ,
          alpha
        );

        #ifdef USE_ENV_MAP
        finalColor.rgb+=a;
        #endif
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
      vReflectionColor: { type: "v3", value: { x: 1, y: 1,z:1 } },
      vReflectionInfos: { type: "v2", value: { x: 1, y: 0 } },
      vLightingIntensity: { type: "v4", value: { x: 1, y: 1, z: 1, w: 1 } },
      // 漫反射颜色
      vAlbedoColor: { type: "v4", value: { x: 1, y: 1, z: 1, w: 1 } },
      // 复合属性,x:metallic, y:roughness
      vReflectivityColor: { type: "v4", value: { x: 0, y: 0.0, z: 0.04, w: 1 } },
      // 自动计算,(f0,f0,f0,f90)
      vMetallicReflectanceFactors: { type: "v4", value: { x: 0.04, y: 0.04, z: 0.04, w: 1 } },
      // 环境颜色
      vAmbientColor: { type: "v3", value: { x: 0, y: 0, z: 0 } },
      vReflectionMicrosurfaceInfos: { type: "v3", value: { x: 128, y: 0.8, z: 0 } },
      Light0: {
        type: "block",
        value: {
          // 灯光的位置
          vLightData: { type: "v4", value: { x: 0, y: 1, z: 0, w: 1 } },
          vLightDiffuse: { type: "v4", value: { x: 1, y: 1, z: 1, w: 0 } },
          vLightSpecular: { type: "v4", value: { x: 1, y: 1, z: 1, w: 0 } },
          vLightGround: { type: "v3", value: { x: 0, y: 0, z: 0 } },
        }
      },
      environmentBrdfSampler: {
        value: param.environmentBrdfSampler,
        type: "t"
      },
      reflectionSampler: {
        value: param.reflectionSampler,
        type: "tcube"
      },
      reflectionMatrix: {
        value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        type: "m4",
      },
      vSphericalL00: {type: "v3", value: { x: 0.5444, y:  0.4836, z: 0.6262 }},
      vSphericalL1_1: {type: "v3", value: { x: 0.3098, y: 0.3471, z: 0.6107 }},
      vSphericalL10: {type: "v3", value: {x: 0.0979, y: 0.0495,  z: 0.0295 }},
      vSphericalL11: {type: "v3", value: {x: 0.0868, y: 0.1087,  z: 0.1687 }},
      vSphericalL2_2: {type: "v3", value: {x: 0.0154, y: 0.0403,  z: 0.1151 }},
      vSphericalL2_1: {type: "v3", value: {x: 0.0442, y: 0.0330,  z: 0.0402 }},
      vSphericalL20: {type: "v3", value:  {x: 0.0062, y: -0.0018, z:  -0.0101 }},
      vSphericalL21: {type: "v3", value: {x: 0.0408, y: 0.0495,  z: 0.0934 }},
      vSphericalL22: {type: "v3", value: {x: 0.0093, y: -0.0337, z:  -0.1483 }},
    }
  }
}
