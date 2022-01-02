// Mixins
interface Window {
    mozIndexedDB: IDBFactory;
    webkitIndexedDB: IDBFactory;
    msIndexedDB: IDBFactory;
    webkitURL: typeof URL;
    mozRequestAnimationFrame(callback: FrameRequestCallback): number;
    oRequestAnimationFrame(callback: FrameRequestCallback): number;
    WebGLRenderingContext: WebGLRenderingContext;
    MSGesture: MSGesture;
    CANNON: any;
    AudioContext: AudioContext;
    webkitAudioContext: AudioContext;
    PointerEvent: any;
    Math: Math;
    Uint8Array: Uint8ArrayConstructor;
    Float32Array: Float32ArrayConstructor;
    mozURL: typeof URL;
    msURL: typeof URL;
    VRFrameData: any; // WebVR, from specs 1.1
    DracoDecoderModule: any;
    setImmediate(handler: (...args: any[]) => void): number;
}

interface MouseWheelEvent {
    deltaMode: any;
    deltaY: any;
    preventDefault: any;
    deltaX: any;
    deltaZ: any;
    detail: any;
    event: any;
    offsetX: any;
    offsetY: any;
    button: any;
    x: any;
    y: any;
}

interface GamepadPose { }
interface MediaStream { }
interface MediaStreamError { }
interface OffscreenCanvasRenderingContext2D { }

interface VRFrameData {
    pose: any;
    orientation: any;
}

class VRFrameData { }

interface OffscreenCanvas {
    width: any;
    height: any;
    data: any;
    getContext: any;
 }
class OffscreenCanvas {
    constructor(a: any, b: any)
}

interface HTMLCanvasElement {
    requestPointerLock(): void;
    msRequestPointerLock?(): void;
    mozRequestPointerLock?(): void;
    webkitRequestPointerLock?(): void;

    /** Track wether a record is in progress */
    isRecording: boolean;
    /** Capture Stream method defined by some browsers */
    captureStream(fps?: number): MediaStream;
}

interface CanvasRenderingContext2D {
    msImageSmoothingEnabled: boolean;
}

interface MouseEvent {
    mozMovementX: number;
    mozMovementY: number;
    webkitMovementX: number;
    webkitMovementY: number;
    msMovementX: number;
    msMovementY: number;
}

interface Navigator {
    mozGetVRDevices: (any: any) => any;
    webkitGetUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void;
    mozGetUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void;
    msGetUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void;

    webkitGetGamepads(): Gamepad[];
    msGetGamepads(): Gamepad[];
    webkitGamepads(): Gamepad[];
    getUserMedia: any;
    pointerEnabled: any;
}

interface HTMLVideoElement {
    mozSrcObject: any;
}

interface Math {
    fround(x: number): number;
    imul(a: number, b: number): number;
}
