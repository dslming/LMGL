
    preInfo.NdotV = NdotV;
    preInfo.attenuation = 1.0;
    preInfo.roughness = roughness;
    info.diffuse = computeHemisphericDiffuseLighting(preInfo, light0.vLightDiffuse.rgb, light0.vLightGround);
    info.specular = computeSpecularLighting(preInfo, normalW, clearcoatOut.specularEnvironmentR0, specularEnvironmentR90, AARoughnessFactors.x, light0.vLightDiffuse.rgb);
    shadow = 1.;
    diffuseBase += info.diffuse*shadow;
    specularBase += info.specular*shadow;
    vec3 energyConservationFactor = getEnergyConservationFactor(clearcoatOut.specularEnvironmentR0, environmentBrdf);
    vec3 finalSpecular = specularBase;
    finalSpecular = max(finalSpecular, 0.0);
    vec3 finalSpecularScaled = finalSpecular*vLightingIntensity.x*vLightingIntensity.w;
    finalSpecularScaled *= energyConservationFactor;
    vec3 finalDiffuse = diffuseBase;
    finalDiffuse *= surfaceAlbedo.rgb;
    finalDiffuse = max(finalDiffuse, 0.0);
    finalDiffuse *= vLightingIntensity.x;
    vec3 finalAmbient = vAmbientColor;
    finalAmbient *= surfaceAlbedo.rgb;
    vec3 finalEmissive = vEmissiveColor;
    finalEmissive *= vLightingIntensity.y;
    vec3 ambientOcclusionForDirectDiffuse = aoOut.ambientOcclusionColor;
    finalAmbient *= aoOut.ambientOcclusionColor;
    finalDiffuse *= ambientOcclusionForDirectDiffuse;
    vec4 finalColor = vec4(
    finalAmbient +
    finalDiffuse +
    finalSpecularScaled +
    finalEmissive, alpha);
    #define CUSTOM_FRAGMENT_BEFORE_FOG
    finalColor = max(finalColor, 0.0);
    finalColor = applyImageProcessing(finalColor);
    finalColor.a *= visibility;
    #define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
    glFragColor = finalColor;
