import { Camera } from "../Cameras/camera";
import { Scene } from "../Scene/scene";
import { Engine } from "../Engine/engine";
import { SceneComponentConstants, ISceneComponent } from "../Scene/sceneComponent";
import { Layer } from "./layer";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { AbstractScene } from '../Scene/abstractScene';

declare module "../Scene/abstractScene" {
    export interface AbstractScene {
        /**
         * The list of layers (background and foreground) of the scene
         */
        layers: Array<Layer>;
    }
}

/**
 * Defines the layer scene component responsible to manage any layers
 * in a given scene.
 */
export class LayerSceneComponent implements ISceneComponent {
    /**
     * The component name helpfull to identify the component in the list of scene components.
     */
    public readonly name = SceneComponentConstants.NAME_LAYER;

    /**
     * The scene the component belongs to.
     */
    public scene: Scene;

    private _engine: Engine;

    /**
     * Creates a new instance of the component for the given scene
     * @param scene Defines the scene to register the component in
     */
    constructor(scene: Scene) {
        this.scene = scene;
        this._engine = scene.getEngine();
        scene.layers = new Array<Layer>();
    }

    /**
     * Registers the component in a given scene
     */
    public register(): void {
        // this.scene._beforeCameraDrawStage.registerStep(SceneComponentConstants.STEP_BEFORECAMERADRAW_LAYER, this, this._drawCameraBackground);
        // this.scene._afterCameraDrawStage.registerStep(SceneComponentConstants.STEP_AFTERCAMERADRAW_LAYER, this, this._drawCameraForeground);

        // this.scene._beforeRenderTargetDrawStage.registerStep(SceneComponentConstants.STEP_BEFORERENDERTARGETDRAW_LAYER, this, this._drawRenderTargetBackground);
        // this.scene._afterRenderTargetDrawStage.registerStep(SceneComponentConstants.STEP_AFTERRENDERTARGETDRAW_LAYER, this, this._drawRenderTargetForeground);
    }

    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    public rebuild(): void {
        let layers = this.scene.layers;

        for (let layer of layers) {
            layer._rebuild();
        }
    }

    /**
     * Disposes the component and the associated ressources.
     */
    public dispose(): void {
        let layers = this.scene.layers;

        while (layers.length) {
            layers[0].dispose();
        }
    }

    private _draw(predicate: (layer: Layer) => boolean): void {
        let layers = this.scene.layers;

        if (layers.length) {
            this._engine.engineState.setDepthBuffer(false);
            for (let layer of layers) {
                if (predicate(layer)) {
                    layer.render();
                }
            }
            this._engine.engineState.setDepthBuffer(true);
        }
    }

    private _drawCameraPredicate(layer: Layer, isBackground: boolean, cameraLayerMask: number): boolean {
        return !layer.renderOnlyInRenderTargetTextures &&
            layer.isBackground === isBackground &&
            ((layer.layerMask & cameraLayerMask) !== 0);
    }

    private _drawCameraBackground(camera: Camera): void {
        this._draw((layer: Layer) => {
            return this._drawCameraPredicate(layer, true, camera.layerMask);
        });
    }

    private _drawCameraForeground(camera: Camera): void {
        this._draw((layer: Layer) => {
            return this._drawCameraPredicate(layer, false, camera.layerMask);
        });
    }

    private _drawRenderTargetPredicate(layer: Layer, isBackground: boolean, cameraLayerMask: number, renderTargetTexture: RenderTargetTexture): boolean {
        return (layer.renderTargetTextures.length > 0) &&
            layer.isBackground === isBackground &&
            (layer.renderTargetTextures.indexOf(renderTargetTexture) > -1) &&
            ((layer.layerMask & cameraLayerMask) !== 0);
    }

    private _drawRenderTargetBackground(renderTarget: RenderTargetTexture): void {
        this._draw((layer: Layer) => {
            return this._drawRenderTargetPredicate(layer, true, this.scene.sceneRender.activeCamera!.layerMask, renderTarget);
        });
    }

    private _drawRenderTargetForeground(renderTarget: RenderTargetTexture): void {
        this._draw((layer: Layer) => {
            return this._drawRenderTargetPredicate(layer, false, this.scene.sceneRender.activeCamera!.layerMask, renderTarget);
        });
    }

    /**
     * Adds all the elements from the container to the scene
     * @param container the container holding the elements
     */
    public addFromContainer(container: AbstractScene): void {
        if (!container.layers) {
            return;
        }
        container.layers.forEach((layer:any) => {
            this.scene.layers.push(layer);
        });
    }

    /**
     * Removes all the elements in the container from the scene
     * @param container contains the elements to remove
     * @param dispose if the removed element should be disposed (default: false)
     */
    public removeFromContainer(container: AbstractScene, dispose = false): void {
        if (!container.layers) {
            return;
        }
        container.layers.forEach((layer:any) => {
            var index = this.scene.layers.indexOf(layer);
            if (index !== -1) {
                this.scene.layers.splice(index, 1);
            }
            if (dispose) {
                layer.dispose();
            }
        });
    }
}
