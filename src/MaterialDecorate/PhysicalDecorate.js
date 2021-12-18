// pbr
export default class PhysicalDecorate {
  constructor(uniforms, mat, _param = {}) {
    this.uniforms = uniforms;
    _param.baseColor = this.proxy(_param.baseColor);

    mat.param = this.proxy(_param);
    this.mat = mat;

    this.updataUniform();
  }

  proxy(obj) {
    return new Proxy(obj, {
       set: (obj, prop, value)=> {
        obj[prop] = value;
        this.updataUniform();
       }
    });
  }

  updataUniform() {
    const param = this.mat.param;

    const ior = param.ior;
    const metallic = param.metallic;
    const roughness = param.roughness;

    const f0 = Math.pow((ior - 1) / (ior + 1), 2);
    const metallicF90 = 1;

    this.uniforms.vReflectivityColor.value.x = metallic;
    this.uniforms.vReflectivityColor.value.y = roughness;
    this.uniforms.vReflectivityColor.value.z = 1;
    this.uniforms.vReflectivityColor.value.w = 1;


    this.uniforms.vMetallicReflectanceFactors.value.x = f0;
    this.uniforms.vMetallicReflectanceFactors.value.y = f0;
    this.uniforms.vMetallicReflectanceFactors.value.z = f0;
    this.uniforms.vMetallicReflectanceFactors.value.w = metallicF90;

    this.uniforms.vAlbedoColor.value.x = param.baseColor.x;
    this.uniforms.vAlbedoColor.value.y = param.baseColor.y;
    this.uniforms.vAlbedoColor.value.z = param.baseColor.z;
  }
}
