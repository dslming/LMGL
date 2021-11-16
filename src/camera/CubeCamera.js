import { Vector3 } from '../math/Vector3.js';
import { PerspectiveCamera } from './PerspectiveCamera.js';
import dao from '../core/Dao.js'

const fov = 90, aspect = 1;

// 使用6个相机朝向立方体的6个面,渲染6张图
class CubeCamera {
	constructor(near, far, renderTarget,renderer) {
		this.type = 'CubeCamera';
		this.children = {
			cameraPX:null,
			cameraPY: null,
			cameraPZ: null,
			cameraNX: null,
			cameraNY: null,
			cameraNZ: null,
		}
		this.renderTarget = renderTarget;
		this.renderer = renderer;

		const cameraPX = new PerspectiveCamera( fov, aspect, near, far );
		cameraPX.up.set( 0, - 1, 0 );
		cameraPX.lookAt( new Vector3( 1, 0, 0 ) );
		this.children.cameraPX = cameraPX

		const cameraPY = new PerspectiveCamera(fov, aspect, near, far);
		cameraPY.up.set(0, 0, 1);
		cameraPY.lookAt(new Vector3(0, 1, 0));
		this.children.cameraPY = cameraPY;

		const cameraPZ = new PerspectiveCamera(fov, aspect, near, far);
		cameraPZ.up.set(0, -1, 0);
		cameraPZ.lookAt(new Vector3(0, 0, 1));
		this.children.cameraPZ = cameraPZ;

		const cameraNX = new PerspectiveCamera( fov, aspect, near, far );
		cameraNX.up.set( 0, - 1, 0 );
		cameraNX.lookAt( new Vector3( - 1, 0, 0 ) );
		this.children.cameraNX = cameraNX

		const cameraNY = new PerspectiveCamera( fov, aspect, near, far );
		cameraNY.up.set( 0, 0, - 1 );
		cameraNY.lookAt( new Vector3( 0, - 1, 0 ) );
		this.children.cameraNY = cameraNY;

		const cameraNZ = new PerspectiveCamera( fov, aspect, near, far );
		cameraNZ.up.set( 0, - 1, 0 );
		cameraNZ.lookAt( new Vector3( 0, 0, - 1 ) );
		this.children.cameraNZ = cameraNZ;
	}

	_render(renderer, meshes, camera) {
		for (let i = 0; i < meshes.length; i++) {
			const mesh = meshes[i];
			renderer.renderMesh(mesh, camera)
		}
	}
	render(renderer, meshes) {
		 const gl = dao.getData("gl")
		const {cameraPX, cameraNX, cameraPY, cameraNY, cameraPZ, cameraNZ } = this.children;

		const dynamicCubemap = this.renderTarget.getTexture()
		const framebuffer = this.renderTarget.getFrameBuffer()
		const { width, height } = this.renderTarget;

		renderer.setRenderTarget(framebuffer);
		renderer.clear();
		gl.viewport(0, 0, width, height);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, dynamicCubemap, 0);
		this._render(renderer, meshes, cameraPX)

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, dynamicCubemap, 0);
		this._render(renderer, meshes, cameraPY)

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, dynamicCubemap, 0);
		this._render(renderer, meshes, cameraPZ)

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, dynamicCubemap, 0);
		this._render(renderer, meshes, cameraNX)

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, dynamicCubemap, 0);
		this._render(renderer, meshes, cameraNZ)

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, dynamicCubemap, 0);
		this._render(renderer, meshes, cameraNY)

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubemap);
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
	}

}

export { CubeCamera };
