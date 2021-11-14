export default `
float remap01(float a, float b, float t) {
	return (t-a)/(b-a);
}
float remap(float t, float a, float b, float c, float d) {
	return (t-a)/(b-a) * (d-c) + c;
}`
