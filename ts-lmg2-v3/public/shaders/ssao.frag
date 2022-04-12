// SSAO Shader
in vec2 vUv;

uniform sampler2D textureSampler;
uniform sampler2D randomSampler;

uniform float randTextureTiles;
uniform float samplesFactor;
uniform vec3 sampleSphere[SAMPLES];

uniform float totalStrength;
uniform float radius;
uniform float area;
uniform float fallOff;
uniform float base;

out vec4 FragColor;

vec3 normalFromDepth(float depth, vec2 coords) {
	vec2 offset1 = vec2(0.0, radius);
	vec2 offset2 = vec2(radius, 0.0);

	float depth1 = texture(textureSampler, coords + offset1).r;
	float depth2 = texture(textureSampler, coords + offset2).r;

	vec3 p1 = vec3(offset1, depth1 - depth);
	vec3 p2 = vec3(offset2, depth2 - depth);

	vec3 normal = cross(p1, p2);
	normal.z = -normal.z;

	return normalize(normal);
}

void main() {
	vec3 random = normalize(texture(randomSampler, vUv * randTextureTiles).rgb);
	float depth = texture(textureSampler, vUv).r;
	vec3 position = vec3(vUv, depth);
	vec3 normal = normalFromDepth(depth, vUv);
	float radiusDepth = radius / depth;
	float occlusion = 0.0;

	vec3 ray;
	vec3 hemiRay;
	float occlusionDepth;
	float difference;

	for (int i = 0; i < SAMPLES; i++) {
		ray = radiusDepth * reflect(sampleSphere[i], random);
		hemiRay = position + sign(dot(ray, normal)) * ray;

		occlusionDepth = texture(textureSampler, clamp(hemiRay.xy, vec2(0.001, 0.001), vec2(0.999, 0.999))).r;
		difference = depth - occlusionDepth;

		occlusion += step(fallOff, difference) * (1.0 - smoothstep(fallOff, area, difference));
		FragColor = vec4(vec3(0.5), 1.0);
	}

  // FragColor = vec4(vec3(normal), 1.0);
	float ao = 1.0 - totalStrength * occlusion * samplesFactor;
	float result = clamp(ao + base, 0.0, 1.0);

	FragColor.r = result;
	FragColor.g = result;
	FragColor.b = result;
	FragColor.a = 1.0;
	// FragColor = vec4(vec3(normal), 1.0);
	// FragColor = texture(textureSampler, vUv);
	// FragColor = vec4(vec3(depth), 1.0);
}
