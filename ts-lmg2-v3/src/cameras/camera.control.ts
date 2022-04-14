import { Euler } from "../maths/math.euler";
import { Quat } from "../maths/math.quat";
import { MathTool } from "../maths/math.tool";
import { Vec2 } from "../maths/math.vec2";
import { Vec3 } from "../maths/math.vec3";
import { Object3D } from "../object3D";
import { PerspectiveCamera } from "./PerspectiveCamera";

export interface iCameraControlOptions {
    distance?: number;
    distRange?: {
        max?: number;
        min?: number;
    };
    rotRange?: {
        xMax?: number;
        yMax?: number;
        xMin?: number;
        yMin?: number;
    };
}
// 相机控制器
export class CameraControl {
    focusTarget: Vec3;
    rotTarget: Vec3;
    forceUpdate: boolean;
    vpW: number;
    vpH: number;
    quatX: Quat;
    quatY: Quat;
    camHolder: any;
    camera: PerspectiveCamera;
    gyro: { orient: number; alpha: number; beta: number; gamma: number };
    defaultEuler: any;
    rotActual: any;
    focusActual: any;
    distActual: any;
    distTarget: any;
    options: { distance: any; focusPos: any; rotation: any; rotRange: { xMax: any; xMin: any; yMax: any; yMin: any }; distRange: { max: any; min: any }; smartUpdates: boolean };
    static RADIANS: any;

    /**
     * @param {object} options
     * @param { object } options.distRange
     * @param { number } options.distRange.max
     * @param { number } options.distRange.min
     *
     * @param { object } options.rotRange
     * @param { number } options.rotRange.xMax
     * @param { number } options.rotRange.xMin
     * @param { number } options.rotRange.yMax
     * @param { number } options.rotRange.yMin
     *
     * @param { number } options.distance
     */
    constructor(options: iCameraControlOptions, camera: PerspectiveCamera, container: Element) {
        this.forceUpdate = true;
        this.readOptions(options);

        this.vpW = container.clientWidth;
        this.vpH = container.clientHeight;

        this.quatX = new Quat();
        this.quatY = new Quat();

        this.camHolder = new Object3D();
        this.camera = camera;
        this.gyro = {
            orient: 0,
            alpha: 0,
            beta: 0,
            gamma: 0,
        };
        this.defaultEuler = new Euler(0, 0, 0);
        this.initEvent(container);
    }

    initEvent(container: Element) {
        const mouseVec2 = new Vec2();
        let disableHammer = true;

        container.addEventListener(
            "mousedown",
            (event: any) => {
                mouseVec2.set(event.clientX, event.clientY);
                disableHammer = false;
            },
            false
        );

        container.addEventListener(
            "mousemove",
            (event: any) => {
                if (disableHammer) return;

                const t = 300;
                let angleX = ((event.clientX - mouseVec2.x) / this.vpW) * t;
                let angleY = ((event.clientY - mouseVec2.y) / this.vpH) * t;
                this.orbitBy(angleX, angleY);
                mouseVec2.set(event.clientX, event.clientY);
            },
            false
        );

        container.addEventListener(
            "mouseup",
            event => {
                disableHammer = true;
            },
            false
        );

        container.addEventListener(
            "wheel",
            (event: any) => {
                const t = 0.006;
                this.dolly(event.deltaY * t);
            },
            false
        );
    }

    update() {
        if (!this.forceUpdate && !this.changesOccurred()) {
            return false;
        }

        // 控制相机的旋转
        this.rotActual.lerp(this.rotTarget, 0.2);
        this.quatX.setFromAxisAngle(Vec3.AXIS_X, -MathTool.degToRad(this.rotActual.y));
        this.quatY.setFromAxisAngle(Vec3.AXIS_Y, -MathTool.degToRad(this.rotActual.x));
        this.quatY.mul(this.quatX);
        this.camera.quaternion.copy(this.quatY);

        // 控制相机的位置
        this.focusActual.lerp(this.focusTarget, 0.1);
        this.camera.position.copy(this.focusActual);
        if (this.distActual !== this.distTarget) {
            this.distActual = MathTool.zTween(this.distActual, this.distTarget, 0.3);
        }
        this.camera.translateZ(this.distActual);
        this.forceUpdate = false;
        return true;
    }

    readOptions(options: iCameraControlOptions) {
        if (options == undefined) options = {};
        if (options.distRange == undefined) options.distRange = {};
        if (options.rotRange == undefined) options.rotRange = {};

        this.options = {
            distance: options.distance || 90,
            focusPos: new Vec3(),
            rotation: new Vec3(),
            rotRange: {
                xMax: options.rotRange.xMax || Number.POSITIVE_INFINITY,
                xMin: options.rotRange.xMin || Number.NEGATIVE_INFINITY,
                yMax: options.rotRange.yMax || 90,
                yMin: options.rotRange.yMin || -90,
            },
            distRange: {
                max: options.distRange.max || Number.POSITIVE_INFINITY,
                min: options.distRange.min || Number.NEGATIVE_INFINITY,
            },
            smartUpdates: true,
        };

        const opt = this.options;
        this.distActual = opt.distance;
        this.distTarget = opt.distance;

        // 实际焦点
        this.focusActual = new Vec3(opt.focusPos.x, opt.focusPos.y, opt.focusPos.z);
        // 目标焦点
        this.focusTarget = this.focusActual.clone();
        this.rotActual = new Vec3(opt.rotation.x, opt.rotation.y, opt.rotation.z);
        this.rotTarget = this.rotActual.clone();
    }

    setDistance(dist: number) {
        this.distTarget = dist;
        this.distTarget = MathTool.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
        this.forceUpdate = true;
    }

    setDistRange(max: number, min: number) {
        this.options.distRange.max = max;
        this.options.distRange.min = min;
    }

    setRotation(_rotX: number, _rotY: number, _rotZ: number) {
        if (_rotX === undefined) _rotX = 0;
        if (_rotY === undefined) _rotY = 0;
        if (_rotZ === undefined) _rotZ = 0;

        this.rotActual.set(_rotX, _rotY, _rotZ);
        this.rotTarget.set(_rotX, _rotY, _rotZ);
        this.forceUpdate = true;
    }

    setRotRange(xMax: number, xMin: number, yMax: number, yMin: number) {
        this.options.rotRange.xMax = xMax !== undefined ? xMax : this.options.rotRange.xMax;
        this.options.rotRange.xMin = xMin !== undefined ? xMin : this.options.rotRange.xMin;
        this.options.rotRange.yMax = yMax !== undefined ? yMax : this.options.rotRange.yMax;
        this.options.rotRange.yMin = yMin !== undefined ? yMin : this.options.rotRange.yMin;
    }

    clearRotRange() {
        this.options.rotRange.xMax = Number.POSITIVE_INFINITY;
        this.options.rotRange.xMin = Number.NEGATIVE_INFINITY;
        this.options.rotRange.yMax = Number.POSITIVE_INFINITY;
        this.options.rotRange.yMin = Number.NEGATIVE_INFINITY;
    }

    dolly(distance: number) {
        this.distTarget += distance;
        this.distTarget = MathTool.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
    }

    orbitBy(angleX: number, angleY: number) {
        this.rotTarget.x += angleX;
        this.rotTarget.y += angleY;
        this.rotTarget.x = MathTool.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
        this.rotTarget.y = MathTool.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
    }

    orbitTo(angleX: number, angleY: number) {
        this.rotTarget.x = angleX;
        this.rotTarget.y = angleY;
        this.rotTarget.x = MathTool.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
        this.rotTarget.y = MathTool.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
    }

    pan(distX: number, distY: number) {
        this.focusTarget.x -= distX;
        this.focusTarget.y += distY;
    }

    onWindowResize(vpW: number, vpH: number) {
        this.vpW = vpW;
        this.vpH = vpH;
    }

    changesOccurred() {
        if (
            this.options.smartUpdates &&
            this.rotActual.manhattanDistanceTo(this.rotTarget) < 0.01 &&
            Math.abs(this.distActual - this.distTarget) < 0.01 &&
            this.focusActual.manhattanDistanceTo(this.focusTarget) < 0.01
        ) {
            return false;
        }
        return true;
    }
}
