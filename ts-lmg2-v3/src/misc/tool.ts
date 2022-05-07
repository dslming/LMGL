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



// Create look up table for types.
const _typeLookup = function () {
    const result:any = { };
    const names = ["Array", "Object", "Function", "Date", "RegExp", "Float32Array"];

    for (let i = 0; i < names.length; i++)
        result["[object " + names[i] + "]"] = names[i].toLowerCase();

    return result;
}();

/**
 * Extended typeof() function, returns the type of the object.
 *
 * @param {object} obj - The object to get the type of.
 * @returns {string} The type string: "null", "undefined", "number", "string", "boolean", "array", "object", "function", "date", "regexp" or "float32array".
 * @ignore
 */
export function type(obj:any) {
    if (obj === null) {
        return "null";
    }

    const type = typeof obj;

    if (type === "undefined" || type === "number" || type === "string" || type === "boolean") {
        return type;
    }

    return _typeLookup[Object.prototype.toString.call(obj)];
}

/**
 * Merge the contents of two objects into a single object.
 *
 * @param {object} target - The target object of the merge.
 * @param {object} ex - The object that is merged with target.
 * @returns {object} The target object.
 * @example
 * var A = {
 *     a: function () {
 *         console.log(this.a);
 *     }
 * };
 * var B = {
 *     b: function () {
 *         console.log(this.b);
 *     }
 * };
 *
 * pc.extend(A, B);
 * A.a();
 * // logs "a"
 * A.b();
 * // logs "b"
 * @ignore
 */
export function extend(target:any, ex:any) {
    for (const prop in ex) {
        const copy = ex[prop];

        if (type(copy) === "object") {
            target[prop] = extend({}, copy);
        } else if (type(copy) === "array") {
            target[prop] = extend([], copy);
        } else {
            target[prop] = copy;
        }
    }

    return target;
}

/**
 * Return true if the Object is not undefined.
 *
 * @param {object} o - The Object to test.
 * @returns {boolean} True if the Object is not undefined.
 * @ignore
 */
export function isDefined(o:any) {
    let a;
    return (o !== a);
}
