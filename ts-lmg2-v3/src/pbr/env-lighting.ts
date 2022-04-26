import {Engine} from "../engines/engine";
import {TextureAddress, TextureFilter, TextureFormat, TextureProjection, TextureType, UniformsType} from "../engines/engine.enum";
import {Vec4} from "../maths/math.vec4";
import {Texture} from "../texture/texture";
import reprojectFrag from "../shaders/reproject.frag";
import reprojectVert from "../shaders/reproject.vert";
// import reprojectFrag from "../../public/case/shaders/test.frag";
// import reprojectVert from "../../public/case/shaders/test.vert";

import {Postprocessing} from "../postprocessing/postprocessing";
import {Application} from "../application";
import {RenderTarget, RenderTargetBufferType} from "../renderer/render.target";

// calculate the number of mipmap levels given texture dimensions
const calcLevels = (width: number, height: number) => {
    return 1 + Math.floor(Math.log2(Math.max(width, height)));
};

// get a coding string for texture based on its type and pixel format.
const getCoding = (texture: Texture) => {
    switch (texture.type) {
        case TextureType.TEXTURETYPE_RGBM:
            return "RGBM";
        case TextureType.TEXTURETYPE_RGBE:
            return "RGBE";
        default:
            switch (texture.format) {
                case TextureFormat.PIXELFORMAT_RGB16F:
                case TextureFormat.PIXELFORMAT_RGB32F:
                case TextureFormat.PIXELFORMAT_RGBA16F:
                case TextureFormat.PIXELFORMAT_RGBA32F:
                    return "Linear";
                default:
                    return "Gamma";
            }
    }
};

const getProjectionName = (projection: TextureProjection): string => {
    // default to equirect if not specified
    if (projection === TextureProjection.TEXTUREPROJECTION_NONE) {
        projection = TextureProjection.TEXTUREPROJECTION_EQUIRECT;
    }
    switch (projection) {
        case TextureProjection.TEXTUREPROJECTION_CUBE:
            return "Cubemap";
        case TextureProjection.TEXTUREPROJECTION_EQUIRECT:
            return "Equirect";
        case TextureProjection.TEXTUREPROJECTION_OCTAHEDRAL:
            return "Octahedral";
    }
};

export class EnvLighting {
    private _app: Application;
    private _engine: Engine;
    public isReady: boolean;
    result: Texture;
    cubeMapTexture: Texture;

    constructor(app: Application) {
        this._app = app;
        this._engine = app.engine;
        this._engine = app.engine;
        this.isReady = false;
    }

    getCubeTexture(urls: string[]) {
        return new Promise((resolve, reject) => {
            const lightingTexture = new Texture(this._engine, {
                urls: urls,
                minFilter: TextureFilter.FILTER_LINEAR,
                magFilter: TextureFilter.FILTER_LINEAR,
                addressU: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
                addressV: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
                onLoad: () => {
                    resolve(lightingTexture);
                },
                projection: TextureProjection.TEXTUREPROJECTION_CUBE
            });
        });
    }

    reprojectTexture(
        source: Texture,
        target: Texture,
        options: {
            // 可选镜面反射功率。当镜面反射功率指定时，源由提升到指定幂的phong加权内核进行卷积。否则，该函数将执行标准重采样。
            specularPower?: number;
            numSamples?: number;
            // 指定卷积分布: 'null', 'lambert', 'phong', 'ggx'。默认值取决于specularPower。
            distribution?: string;
            // 视口矩形
            rect: Vec4;
            face?: any;
            // 要渲染的接缝像素
            seamPixels?: number;
        }
    ) {
        // table of distribution -> function name
        const funcNames: {[key: string]: string} = {
            none: "reproject",
            lambert: "prefilterSamplesUnweighted",
            phong: "prefilterSamplesUnweighted",
            ggx: "prefilterSamples"
        };

        const specularPower = options.hasOwnProperty("specularPower") ? options.specularPower : 1;
        const face = options.hasOwnProperty("face") ? options.face : null;
        const distribution: any = options.hasOwnProperty("distribution") ? options.distribution : specularPower === 1 ? "none" : "phong";

        const processFunc = funcNames[distribution];
        const decodeFunc = `decode${getCoding(source)}`;
        const encodeFunc = `encode${getCoding(target)}`;
        const sourceFunc = `sample${getProjectionName(source.projection)}`;
        const targetFunc = `getDirection${getProjectionName(target.projection)}`;
        const numSamples = options.hasOwnProperty("numSamples") ? options.numSamples : 1024;

        const defines =
            `#define PROCESS_FUNC ${processFunc}\n` +
            `#define DECODE_FUNC ${decodeFunc}\n` +
            `#define ENCODE_FUNC ${encodeFunc}\n` +
            `#define SOURCE_FUNC ${sourceFunc}\n` +
            `#define TARGET_FUNC ${targetFunc}\n` +
            `#define NUM_SAMPLES ${numSamples}\n` +
            `#define SUPPORTS_TEXLOD\n`;

        const post = new Postprocessing(this._app);
        post.createProgram({
            programName: "envPre",
            vertexShader: reprojectVert,
            fragmentShader: `${defines}\n${reprojectFrag}`,
            uniforms: {
                uvMod: {
                    type: UniformsType.Vec4,
                    value: null
                },
                params: {
                    type: UniformsType.Vec4,
                    value: null
                },
                params2: {
                    type: UniformsType.Vec2,
                    value: null
                },
                sourceCube: {
                    type: UniformsType.Texture,
                    value: this.cubeMapTexture
                }
            }
        });
        post.useProgram("envPre");

        if (options?.seamPixels) {
            const p = options.seamPixels;
            const w = options.rect ? options.rect.z : target.width;
            const h = options.rect ? options.rect.w : target.height;

            const innerWidth = w - p * 2;
            const innerHeight = h - p * 2;

            post.setUniform("uvMod", {
                x: (innerWidth + p * 2) / innerWidth,
                y: (innerHeight + p * 2) / innerHeight,
                z: -p / innerWidth,
                w: -p / innerHeight
            });
        } else {
            post.setUniform("uvMod", {x: 1, y: 1, z: 0, w: 0});
        }

        const params = [
            0,
            specularPower,
            source.fixCubemapSeams ? 1.0 / source.width : 0.0, // source seam scale
            target.fixCubemapSeams ? 1.0 / target.width : 0.0 // target seam scale
        ];

        const params2 = [target.width * target.height * (target.cubemap ? 6 : 1), source.width * source.height * (source.cubemap ? 6 : 1)];

        const viewport = options?.rect;
        // for (let f = 0; f < (target.cubemap ? 6 : 1); f++) {
        for (let f = 0; f < 2; f++) {
            if (face === null || f === face) {
                console.error(456);

                const renderTarget = new RenderTarget(this._engine, {
                    bufferType: RenderTargetBufferType.colorBuffer,
                    width: 512,
                    height: 512,
                    name: "renderTarget",
                    depth: false,
                    colorBuffer: target
                });
                params[0] = f;
                post.setRenderTarget(renderTarget)
                    .setUniform("params", {x: params[0], y: params[1], z: params[2], w: params[3]})
                    .setUniform("params2", {x: params2[0], y: params2[1]})
                    .viewport()
                    .clear()
                    .viewport({x: viewport.x, y: viewport.y, width: viewport.z, height: viewport.w})
                    .render();
                renderTarget.destroy();
            }
        }
    }

    async gen(options: {urls: string[]}) {
        const result = new Texture(this._engine, {
            name: "result",
            width: 512,
            height: 512,
            format: TextureFormat.PIXELFORMAT_R8_G8_B8_A8,
            type: TextureType.TEXTURETYPE_RGBM,
            projection: TextureProjection.TEXTUREPROJECTION_EQUIRECT,
            addressU: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
            addressV: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
            minFilter: TextureFilter.FILTER_LINEAR,
            magFilter: TextureFilter.FILTER_LINEAR
        });
        this.result = result;

        const rect = new Vec4(0, 0, 512, 256);
        const levels = 1; //calcLevels(result.width, result.height);

        const lightingTexture: Texture = (await this.getCubeTexture(options.urls)) as any;
        this.cubeMapTexture = lightingTexture;
        for (let i = 0; i < levels; ++i) {
            this.reprojectTexture(lightingTexture, result, {
                numSamples: 1,
                rect: rect,
                seamPixels: 1
            });

            rect.x += rect.w;
            rect.y += rect.w;
            rect.z = Math.max(1, Math.floor(rect.z * 0.5));
            rect.w = Math.max(1, Math.floor(rect.w * 0.5));
        }
        this.isReady = true;
    }
}
