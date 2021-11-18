
import depth from '../depth/depth.glsl.js'

export default `
${ depth }
float useShadowMap(sampler2D shadowMap, vec4 shadowCoord) {
 float z = unpack(texture2D(shadowMap, shadowCoord.xy));
 return shadowCoord.z > z + 0.015 ? 0.0 : 1.0;
}
`
