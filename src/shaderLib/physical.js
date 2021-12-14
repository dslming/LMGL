import tool from "./tool.glsl.js"
/**
 * 物理材质
 * @returns
 */
export function getMaterial() {
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
      float convertRoughnessToAverageSlope(float roughness) {
          return square(roughness)+MINIMUMVARIANCE;
      }
      vec2 getAARoughnessFactors(vec3 normalVector) {
          return vec2(0.);
      }
      vec3 getBRDFLookup(float NdotV, float perceptualRoughness) {
          vec2 UV = vec2(NdotV, perceptualRoughness);
          vec4 brdfLookup = texture(environmentBrdfSampler, UV);
          return brdfLookup.rgb;
      }

      struct ambientOcclusionOutParams {
        vec3 ambientOcclusionColor;
      };
      void ambientOcclusionBlock(
        out ambientOcclusionOutParams outParams
      ) {
        vec3 ambientOcclusionColor = vec3(1., 1., 1.);
        outParams.ambientOcclusionColor = ambientOcclusionColor;
      }

      struct albedoOpacityOutParams {
        vec3 surfaceAlbedo;
        float alpha;
      };

      void albedoOpacityBlock(
       const in vec4 vAlbedoColor,
       out albedoOpacityOutParams outParams
      ) {
        vec3 surfaceAlbedo = vAlbedoColor.rgb;
        float alpha = vAlbedoColor.a;
        outParams.surfaceAlbedo = surfaceAlbedo;
        outParams.alpha = alpha;
      }

      struct reflectivityOutParams {
        float microSurface;
        float roughness;
        vec3 surfaceReflectivityColor;
        vec3 surfaceAlbedo;
      };
      void reflectivityBlock(
        const in vec4 vReflectivityColor,
        const in vec3 surfaceAlbedo,
        const in vec4 metallicReflectanceFactors,
        out reflectivityOutParams outParams
      ) {
          float microSurface = vReflectivityColor.a;
          vec3 surfaceReflectivityColor = vReflectivityColor.rgb;
          vec2 metallicRoughness = surfaceReflectivityColor.rg;
          microSurface = 1.0-metallicRoughness.g;
          vec3 baseColor = surfaceAlbedo;
          vec3 metallicF0 = metallicReflectanceFactors.rgb;
          outParams.surfaceAlbedo = mix(baseColor.rgb*(1.0-metallicF0), vec3(0., 0., 0.), metallicRoughness.r);
          surfaceReflectivityColor = mix(metallicF0, baseColor, metallicRoughness.r);
          microSurface = saturate(microSurface);
          float roughness = 1.-microSurface;
          outParams.microSurface = microSurface;
          outParams.roughness = roughness;
          outParams.surfaceReflectivityColor = surfaceReflectivityColor;
      }

      float environmentRadianceOcclusion(float ambientOcclusion, float NdotVUnclamped) {
        float temp = NdotVUnclamped+ambientOcclusion;
        return saturate(square(temp)-1.0+ambientOcclusion);
      }

      vec3 getReflectanceFromBRDFLookup(
        const vec3 specularEnvironmentR0,
        const vec3 specularEnvironmentR90,
        const vec3 environmentBrdf) {
          vec3 reflectance = (specularEnvironmentR90-specularEnvironmentR0)*environmentBrdf.x+specularEnvironmentR0*environmentBrdf.y;
          return reflectance;
      }

      struct clearcoatOutParams {
          vec3 specularEnvironmentR0;
          float conservationFactor;
          vec3 clearCoatNormalW;
          vec2 clearCoatAARoughnessFactors;
          float clearCoatIntensity;
          float clearCoatRoughness;
          vec3 energyConservationFactorClearCoat;
      };
      struct subSurfaceOutParams {
        vec3 specularEnvironmentReflectance;
      };

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

      void main() {
        vec3 viewDirectionW = normalize(vEyePosition.xyz-vPositionW);
        vec3 normalW = normalize(vNormalW);
        vec3 geometricNormalW = normalW;
        albedoOpacityOutParams albedoOpacityOut;
        albedoOpacityBlock(vAlbedoColor, albedoOpacityOut);

        vec3 surfaceAlbedo = albedoOpacityOut.surfaceAlbedo;
        float alpha = albedoOpacityOut.alpha;
        ambientOcclusionOutParams aoOut;
        ambientOcclusionBlock(aoOut);

        vec3 baseColor = surfaceAlbedo;
        reflectivityOutParams reflectivityOut;
        vec4 metallicReflectanceFactors = vMetallicReflectanceFactors;
        reflectivityBlock(
          vReflectivityColor,
          surfaceAlbedo,
          metallicReflectanceFactors,
          reflectivityOut
        );

        float microSurface = reflectivityOut.microSurface;
        float roughness = reflectivityOut.roughness;
        surfaceAlbedo = reflectivityOut.surfaceAlbedo;
        float NdotVUnclamped = dot(normalW, viewDirectionW);
        float NdotV = absEps(NdotVUnclamped);
        float alphaG = convertRoughnessToAverageSlope(roughness);

        vec2 AARoughnessFactors = getAARoughnessFactors(normalW.xyz);
        vec3 environmentBrdf = getBRDFLookup(NdotV, roughness);
        float ambientMonochrome = getLuminance(aoOut.ambientOcclusionColor);
        float seo = environmentRadianceOcclusion(ambientMonochrome, NdotVUnclamped);
        float reflectance = max(max(reflectivityOut.surfaceReflectivityColor.r, reflectivityOut.surfaceReflectivityColor.g), reflectivityOut.surfaceReflectivityColor.b);
        vec3 specularEnvironmentR0 = reflectivityOut.surfaceReflectivityColor.rgb;
        vec3 specularEnvironmentR90 = vec3(metallicReflectanceFactors.a);

        clearcoatOutParams clearcoatOut;
        clearcoatOut.specularEnvironmentR0 = specularEnvironmentR0;
        vec3 specularEnvironmentReflectance = getReflectanceFromBRDFLookup(clearcoatOut.specularEnvironmentR0, specularEnvironmentR90, environmentBrdf);
        specularEnvironmentReflectance *= seo;
        subSurfaceOutParams subSurfaceOut;
        subSurfaceOut.specularEnvironmentReflectance = specularEnvironmentReflectance;


        vec3 diffuseBase = vec3(0., 0., 0.);
        vec3 specularBase = vec3(0., 0., 0.);
        // preLightingInfo preInfo;
        // lightingInfo info;
        // float shadow = 1.;
        // preInfo = computeHemisphericPreLightingInfo(light0.vLightData, viewDirectionW, normalW);
        FragColor = light0.vLightData;
      }
      `
  return {
    vertexShader,
    fragmentShader,
    uniforms: {
      diffuse:{type:"v3",value:{x:1,y:0,z:0}},
      emissive:{type:"v3",value:{x:0,y:0,z:0}},
      emissive:{type:"v3",value:{x:0,y:0,z:0}},
      ambientLightColor:{type:"v3",value:{x:1,y:0,z:0}},
      roughness:{type:"f",value: 1},
      opacity:{type:"f",value: 1},
    }
  }
}
