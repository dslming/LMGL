/**
 * 物理材质
 * @returns
 */
export function getMaterial() {
  const vertexShader = `#version 300 es
      precision mediump float;
      in vec3 aPosition;
      in vec3 aNormal;

      uniform mat4 world;
      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform vec3 lightDirction;

      void main() {
        mat3 normalWorld = mat3(world);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        vNormalW = normalize(normalWorld * aNormal);
        vec4 worldPos = world * vec4(aPosition, 1.0);
        vPositionW = vec3(worldPos)
      }
    `

  const fragmentShader = `#version 300 es
      precision mediump float;
      uniform vec4 vEyePosition;
      uniform vec3 vAmbientColor;
      uniform vec4 vCameraInfos;

      in vec3 vPositionW;
      in vec3 vNormalW;

      out vec4 FragColor;

      #define PI 3.141592653589793
      #define PI2 6.283185307179586
      #define PI_HALF 1.5707963267948966
      #define RECIPROCAL_PI 0.3183098861837907
      #define RECIPROCAL_PI2 0.15915494309189535
      #define EPSILON 1e-6

      #define RE_Direct				RE_Direct_Physical
      #define RE_Direct_RectArea		RE_Direct_RectArea_Physical
      #define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
      #define RE_IndirectSpecular		RE_IndirectSpecular_Physical
      #define saturate( a ) clamp( a, 0.0, 1.0 )


      struct ReflectedLight {
        vec3 directDiffuse;
        vec3 directSpecular;
        vec3 indirectDiffuse;
        vec3 indirectSpecular;
      };

      struct IncidentLight {
        vec3 color;
        vec3 direction;
        bool visible;
      };

      struct PhysicalMaterial {
        vec3 diffuseColor;
        float roughness;
        vec3 specularColor;
        float specularF90;
      };

      struct GeometricContext {
        vec3 position;
        vec3 normal;
        vec3 viewDir;
      };


      // Analytical approximation of the DFG LUT, one half of the
      // split-sum approximation used in indirect specular lighting.
      // via 'environmentBRDF' from "Physically Based Shading on Mobile"
      // https://www.unrealengine.com/blog/physically-based-shading-on-mobile
      vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
        float dotNV = saturate( dot( normal, viewDir ) );
        const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
        const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
        vec4 r = roughness * c0 + c1;
        float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
        vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
        return fab;
      }

      // Fdez-Agüera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
      // Approximates multiscattering in order to preserve energy.
      // http://www.jcgt.org/published/0008/01/03/
      void computeMultiscattering(
        const in vec3 normal,
        const in vec3 viewDir,
        const in vec3 specularColor,
        const in float specularF90,
        const in float roughness,
        inout vec3 singleScatter,
        inout vec3 multiScatter ) {
        vec2 fab = DFGApprox( normal, viewDir, roughness );
        vec3 FssEss = specularColor * fab.x + specularF90 * fab.y;

        float Ess = fab.x + fab.y;
        float Ems = 1.0 - Ess;

        vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619; // 1/21
        vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );

        singleScatter += FssEss;
        multiScatter += Fms * Ems;
      }

      vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
        vec3 irradiance = ambientLightColor;
        return irradiance;
      }

      vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
        return RECIPROCAL_PI * diffuseColor;
      }

      void RE_IndirectDiffuse_Physical(
        const in vec3 irradiance,
        const in GeometricContext geometry,
        const in PhysicalMaterial material,
        inout ReflectedLight reflectedLight ) {
        reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
      }

      void RE_IndirectSpecular_Physical(
        const in vec3 radiance,
        const in vec3 irradiance,
        const in vec3 clearcoatRadiance,
        const in GeometricContext geometry,
        const in PhysicalMaterial material,
        inout ReflectedLight reflectedLight) {

        vec3 singleScattering = vec3( 0.0 );
        vec3 multiScattering = vec3( 0.0 );
        vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
        computeMultiscattering(
          geometry.normal,
          geometry.viewDir,
          material.specularColor,
          material.specularF90,
          material.roughness,
          singleScattering,
          multiScattering );
        vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );
        reflectedLight.indirectSpecular += radiance * singleScattering;
        reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
        reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
      }

      void main() {
        // vec3 normal = normalize( vNormal );
        // normal = normalize( normalMatrix * normal );
        // vec4 diffuseColor = vec4(diffuse, opacity);
        // ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
        // vec3 totalEmissiveRadiance = emissive;

        // float roughnessFactor = roughness;
        // float metalnessFactor = metalness;
        // float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
        // vec3 geometryNormal = normal;

        // PhysicalMaterial material;
        // material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
        // vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
        // float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
        // material.roughness = max( roughnessFactor, 0.0525 );
        // material.roughness += geometryRoughness;
        // material.roughness = min( material.roughness, 1.0 );


        // material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	      // material.specularF90 = 1.0;

        // GeometricContext geometry;
        // geometry.position = - vViewPosition;
        // geometry.normal = normal;
        // geometry.viewDir = normalize( vViewPosition );

        // IncidentLight directLight;
        // vec3 iblIrradiance = vec3( 0.0 );
        // vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

        // vec3 radiance = vec3( 0.0 );
	      // vec3 clearcoatRadiance = vec3( 0.0 );

        // RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
	      // RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );

        // vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	      // vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
        // vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

        // FragColor = vec4( outgoingLight, diffuseColor.a );

        vec3 viewDirectionW = normalize(vEyePosition.xyz-vPositionW);
        vec3 normalW = normalize(vNormalW);
        vec3 geometricNormalW = normalW;
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
