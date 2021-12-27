export default `
// Disney diffuse term
// https://blog.selfshadow.com/publications/s2012-shading-course/burley/s2012_pbs_disney_brdf_notes_v3.pdf
// Page 14
float diffuseBRDF_Burley(float NdotL, float NdotV, float VdotH, float roughness) {
  // Diffuse fresnel falloff as per Disney principled BRDF, and in the spirit of
  // of general coupled diffuse/specular models e.g. Ashikhmin Shirley.
  float diffuseFresnelNV = pow5(saturateEps(1.0 - NdotL));
  float diffuseFresnelNL = pow5(saturateEps(1.0 - NdotV));
  float diffuseFresnel90 = 0.5 + 2.0 * VdotH * VdotH * roughness;
  float fresnel =
    (1.0 + (diffuseFresnel90 - 1.0) * diffuseFresnelNL) *
    (1.0 + (diffuseFresnel90 - 1.0) * diffuseFresnelNV);

  return fresnel / PI;
}

// Lambert
vec3 diffuseBRDF_Lambert(float NdL, float NdV, float VdH, float roughness)
{
	return 1. / PI;
}

// 方向光的diffuse
vec3 computeDiffuseLighting(preLightingInfo info, vec3 lightColor) {
  float diffuseTerm = diffuseBRDF_Burley(info.NdotL, info.NdotV, info.VdotH, info.roughness);
  return diffuseTerm * info.attenuation * info.NdotL * lightColor;
}
`
