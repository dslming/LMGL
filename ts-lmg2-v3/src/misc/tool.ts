export function addProxy(proxyObj: any, setCb: any, getCb?: any) {
    const handler = {
        get(target: any, key: any) {
            let result = target[key];
            getCb && getCb(result);
            return result;
        },
        set(target: any, key: any, value: any) {
            target[key] = value;
            setCb && setCb(this);
            return this;
        },
    };
    return new Proxy(proxyObj, handler as any);
}

export function cloneUniforms(src: any) {
    const dst: any = {};

    for (const u in src) {
        dst[u] = {};

        for (const p in src[u]) {
            const property = src[u][p];

            if (
                property &&
                (property.isColor || property.isMatrix3 || property.isMatrix4 || property.isVector2 || property.isVector3 || property.isVector4 || property.isTexture || property.isQuaternion)
            ) {
                dst[u][p] = property.clone();
            } else if (Array.isArray(property)) {
                dst[u][p] = property.slice();
            } else {
                dst[u][p] = property;
            }
        }
    }

    return dst;
}
