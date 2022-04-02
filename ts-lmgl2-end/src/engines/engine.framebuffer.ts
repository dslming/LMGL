import { Nullable } from "../types";
import { Engine } from "./engine";

export class EngineFramebuffer {
    private _currentRenderTarget: any;
    private _activeFramebuffer: Nullable<WebGLFramebuffer> = null;

    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;
    }

    private setFramebuffer(framebuffer: Nullable<WebGLFramebuffer>) {
        if (this._activeFramebuffer !== framebuffer) {
            this._engine.gl.bindFramebuffer(this._engine.gl.FRAMEBUFFER, framebuffer);
            this._activeFramebuffer = framebuffer;
        }
    }

    /**
     * Unbind the current render target and bind the default framebuffer
     */
    public restoreDefaultFramebuffer(): void {
        if (this._currentRenderTarget) {
            // this.unBindFramebuffer(this._currentRenderTarget);
        } else {
            this.setFramebuffer(null);
        }
        if (this._engine.engineViewPort.viewportCached) {
            this._engine.engineViewPort.setViewport(this._engine.engineViewPort.viewportCached);
        }

        // this.engine.wipeCaches();
    }
}
