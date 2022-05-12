import {Engine} from "../engines/engine";
import {Vec3} from "../maths/math.vec3";
import {Http, http} from "../misc/http";
import {Loader} from "./loader";

export interface iOBJLoadOption {
    url: string;
    rootPath?: string;
}

// o object_name | g group_name
const _object_pattern = /^[og]\s*(.+)?/;

const _vA = new Vec3();
const _vB = new Vec3();
const _vC = new Vec3();

const _ab = new Vec3();
const _cb = new Vec3();

class ParserState {
    state: any;
    vertices: any[];
    normals: any[];
    colors: any[];
    uvs: any[];
    object: any;
    objects: any[] = [];

    constructor() {
        this.vertices = [];
        this.normals = [];
        this.colors = [];
        this.uvs = [];
    }

    startObject(name: string, fromDeclaration?: boolean) {
        // If the current object (initial from reset) is not from a g/o declaration in the parsed
        // file. We need to use it for the first parsed g/o to keep things in sync.
        if (this.object && this.object.fromDeclaration === false) {
            this.object.name = name;
            this.object.fromDeclaration = fromDeclaration !== false;
            return;
        }

        const previousMaterial = this.object && typeof this.object.currentMaterial === "function" ? this.object.currentMaterial() : undefined;

        if (this.object && typeof this.object._finalize === "function") {
            this.object._finalize(true);
        }

        this.object = {
            name: name || "",
            fromDeclaration: fromDeclaration !== false,

            geometry: {
                vertices: [],
                normals: [],
                colors: [],
                uvs: [],
                hasUVIndices: false
            },
            materials: [],
            smooth: true
        };

        // Inherit previous objects material.
        // Spec tells us that a declared material must be set to all objects until a new material is declared.
        // If a usemtl declaration is encountered while this new object is being parsed, it will
        // overwrite the inherited material. Exception being that there was already face declarations
        // to the inherited material, then it will be preserved for proper MultiMaterial continuation.

        if (previousMaterial && previousMaterial.name && typeof previousMaterial.clone === "function") {
            const declared = previousMaterial.clone(0);
            declared.inherited = true;
            this.object.materials.push(declared);
        }

        this.objects.push(this.object);
    }

    parseVertexIndex(value: string, len: number) {
        const index = parseInt(value, 10);
        return (index >= 0 ? index - 1 : index + len / 3) * 3;
    }

    parseNormalIndex(value: string, len: number) {
        const index = parseInt(value, 10);
        return (index >= 0 ? index - 1 : index + len / 3) * 3;
    }

    parseUVIndex(value: string, len: number) {
        const index = parseInt(value, 10);
        return (index >= 0 ? index - 1 : index + len / 2) * 2;
    }

    addVertex(a: number, b: number, c: number) {
        const src = this.vertices;
        const dst = this.object.geometry.vertices;

        dst.push(src[a + 0], src[a + 1], src[a + 2]);
        dst.push(src[b + 0], src[b + 1], src[b + 2]);
        dst.push(src[c + 0], src[c + 1], src[c + 2]);
    }

    addVertexPoint(a: number) {
        const src = this.vertices;
        const dst = this.object.geometry.vertices;

        dst.push(src[a + 0], src[a + 1], src[a + 2]);
    }

    addVertexLine(a: number) {
        const src = this.vertices;
        const dst = this.object.geometry.vertices;

        dst.push(src[a + 0], src[a + 1], src[a + 2]);
    }

    addNormal(a: number, b: number, c: number) {
        const src = this.normals;
        const dst = this.object.geometry.normals;

        dst.push(src[a + 0], src[a + 1], src[a + 2]);
        dst.push(src[b + 0], src[b + 1], src[b + 2]);
        dst.push(src[c + 0], src[c + 1], src[c + 2]);
    }

    addFaceNormal(a: number, b: number, c: number) {
        const src = this.vertices;
        const dst = this.object.geometry.normals;

        _vA.fromArray(src, a);
        _vB.fromArray(src, b);
        _vC.fromArray(src, c);

        _cb.sub2(_vC, _vB);
        _ab.sub2(_vA, _vB);
        _cb.cross(_cb, _ab);

        _cb.normalize();

        dst.push(_cb.x, _cb.y, _cb.z);
        dst.push(_cb.x, _cb.y, _cb.z);
        dst.push(_cb.x, _cb.y, _cb.z);
    }

    addUV(a: number, b: number, c: number) {
        const src = this.uvs;
        const dst = this.object.geometry.uvs;

        dst.push(src[a + 0], src[a + 1]);
        dst.push(src[b + 0], src[b + 1]);
        dst.push(src[c + 0], src[c + 1]);
    }

    addDefaultUV() {
        const dst = this.object.geometry.uvs;

        dst.push(0, 0);
        dst.push(0, 0);
        dst.push(0, 0);
    }

    addFace(a: any, b: any, c: any, ua: string | undefined, ub: any, uc: any, na: string | undefined, nb: any, nc: any) {
        const vLen = this.vertices.length;

        let ia = this.parseVertexIndex(a, vLen);
        let ib = this.parseVertexIndex(b, vLen);
        let ic = this.parseVertexIndex(c, vLen);

        this.addVertex(ia, ib, ic);
        // this.addColor(ia, ib, ic);

        // normals

        if (na !== undefined && na !== "") {
            const nLen = this.normals.length;

            ia = this.parseNormalIndex(na, nLen);
            ib = this.parseNormalIndex(nb, nLen);
            ic = this.parseNormalIndex(nc, nLen);

            this.addNormal(ia, ib, ic);
        } else {
            this.addFaceNormal(ia, ib, ic);
        }

        // uvs

        if (ua !== undefined && ua !== "") {
            const uvLen = this.uvs.length;

            ia = this.parseUVIndex(ua, uvLen);
            ib = this.parseUVIndex(ub, uvLen);
            ic = this.parseUVIndex(uc, uvLen);

            this.addUV(ia, ib, ic);

            this.object.geometry.hasUVIndices = true;
        } else {
            // add placeholder values (for inconsistent face definitions)

            this.addDefaultUV();
        }
    }
}

export class OBJLoader extends Loader {
    vertices: any;
    textureCoords: any;
    normals: any;
    faces: any;

    constructor(engine: Engine) {
        super(engine);
        this.faces = [];
        this.vertices = [];
        this.normals = [];
        this.textureCoords = [];
    }

    load(options: iOBJLoadOption) {
        return new Promise((resolve, reject) => {
            http.get(
                options.url,
                {
                    responseType: Http.ResponseType.TEXT
                },
                (err: any, data: any) => {
                    if (err !== null) {
                        reject(err);
                    } else {
                        const objects = this._parse(data);
                        resolve(objects);
                    }
                }
            );
        });
    }

    _parse(text: any) {
        const state = new ParserState();
        if (text.indexOf("\r\n") !== -1) {
            // This is faster than String.split with regex that splits on both
            text = text.replace(/\r\n/g, "\n");
        }

        if (text.indexOf("\\\n") !== -1) {
            // join lines separated by a line continuation character (\)
            text = text.replace(/\\\n/g, "");
        }

        const lines = text.split("\n");
        let line = "",
            lineFirstChar = "";
        let lineLength = 0;
        let result: any = [];

        // Faster to just trim left side of the line. Use if available.
        const trimLeft = typeof "".trimLeft === "function";

        for (let i = 0, l = lines.length; i < l; i++) {
            line = lines[i];

            line = trimLeft ? line.trimLeft() : line.trim();

            lineLength = line.length;

            if (lineLength === 0) continue;

            lineFirstChar = line.charAt(0);

            // @todo invoke passed in handler if any
            if (lineFirstChar === "#") continue;

            if (lineFirstChar === "v") {
                const data: any = line.split(/\s+/);

                switch (data[0]) {
                    case "v":
                        state.vertices.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
                        if (data.length >= 7) {
                            // _color.setRGB(parseFloat(data[4]), parseFloat(data[5]), parseFloat(data[6])).convertSRGBToLinear();
                            // state.colors.push(_color.r, _color.g, _color.b);
                        } else {
                            // if no colors are defined, add placeholders so color and vertex indices match

                            state.colors.push(undefined, undefined, undefined);
                        }

                        break;
                    case "vn":
                        state.normals.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
                        break;
                    case "vt":
                        state.uvs.push(parseFloat(data[1]), parseFloat(data[2]));
                        break;
                }
            } else if (lineFirstChar === "f") {
                const lineData = line.slice(1).trim();
                const vertexData = lineData.split(/\s+/);
                const faceVertices = [];

                // Parse the face vertex data into an easy to work with format

                for (let j = 0, jl = vertexData.length; j < jl; j++) {
                    const vertex = vertexData[j];

                    if (vertex.length > 0) {
                        const vertexParts = vertex.split("/");
                        faceVertices.push(vertexParts);
                    }
                }

                // Draw an edge between the first vertex and all subsequent vertices to form an n-gon

                const v1 = faceVertices[0];

                for (let j = 1, jl = faceVertices.length - 1; j < jl; j++) {
                    const v2 = faceVertices[j];
                    const v3 = faceVertices[j + 1];

                    state.addFace(v1[0], v2[0], v3[0], v1[1], v2[1], v3[1], v1[2], v2[2], v3[2]);
                }
            } else if (lineFirstChar === "l") {
                console.error("not surport l");
            } else if (lineFirstChar === "p") {
                console.error("not surport p");
            } else if ((result = _object_pattern.exec(line)) !== null) {
                // o object_name
                // or
                // g group_name

                // WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
                // let name = result[ 0 ].slice( 1 ).trim();
                const name = (" " + result[0].slice(1).trim()).slice(1);
                state.startObject(name);
            } else if (lineFirstChar === "s") {
                result = line.split(" ");

                // smooth shading

                // @todo Handle files that have varying smooth values for a set of faces inside one geometry,
                // but does not define a usemtl for each face set.
                // This should be detected and a dummy material created (later MultiMaterial and geometry groups).
                // This requires some care to not create extra material on each smooth value for "normal" obj files.
                // where explicit usemtl defines geometry groups.
                // Example asset: examples/models/obj/cerberus/Cerberus.obj

                /*
                 * http://paulbourke.net/dataformats/obj/
                 *
                 * From chapter "Grouping" Syntax explanation "s group_number":
                 * "group_number is the smoothing group number. To turn off smoothing groups, use a value of 0 or off.
                 * Polygonal elements use group numbers to put elements in different smoothing groups. For free-form
                 * surfaces, smoothing groups are either turned on or off; there is no difference between values greater
                 * than 0."
                 */
                if (result.length > 1) {
                    const value = result[1].trim().toLowerCase();
                    state.object.smooth = value !== "0" && value !== "off";
                } else {
                    // ZBrush can produce "s" lines #11707
                    state.object.smooth = true;
                }

                // const material = state.object.currentMaterial();
                // if (material) material.smooth = state.object.smooth;
            } else {
                // Handle null terminated files without exception
                if (line === "\0") continue;

                // console.warn('THREE.OBJLoader: Unexpected line: "' + line + '"');
            }
        }
        // console.error(lines);
        return state.objects;
    }
}
