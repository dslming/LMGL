import { Vector3 } from "../math/Vector3.js"
import { Rotation, RotateLeftType } from './Rotation.js'
import Pan from './Pan.js'
import { Dolly } from './Dolly.js'
import { MOUSE, TOUCH, STATE } from './constants.js'

export default class MyOrbitControls {
  constructor(camera, domElement) {
    // 全局参数
    this.camera = camera
    this.domElement = domElement
    this.target = new Vector3(0, 0, 0)

    // 事件对应的处理动作
    this.mouseButtons = {
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN
    };
    this.touches = {
      ONE: TOUCH.ROTATE, // 一个手指只能 PAN 或者 ROTATE
      TWO: TOUCH.DOLLY_ROTATE // 两个手指多了缩放
    };
    this.pan = new Pan({
      camera: this.camera,
      target: this.target,
      domWidth: this.domElement.width,
      domHeight: this.domElement.height,
    })

    this.dolly = new Dolly({
      camera: this.camera,
      target: this.target,
      domWidth: this.domElement.width,
      domHeight: this.domElement.height,
    })

    this.rotation = new Rotation({
      camera: this.camera,
      enableDamping: false,
      dampingFactor: 0.05,
      target: this.target,
      domWidth: this.domElement.width,
      domHeight: this.domElement.height,
    })

    // 鼠标参数
    this.state = STATE.NONE;

    this.onPointerDown = this.onPointerDown.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerUp = this.onPointerUp.bind(this)
    this.onWheel = this.onWheel.bind(this)

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.initEvent()
  }


  initEvent() {
    // pc
    this.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.domElement.ownerDocument.addEventListener('pointerup', this.onPointerUp);
    this.domElement.ownerDocument.addEventListener('pointermove', this.onPointerMove);
    this.domElement.addEventListener('contextmenu', this.onContextMenu);
    this.domElement.addEventListener('wheel', this.onWheel);

    // mobile
    this.domElement.addEventListener('touchstart', this.onTouchStart);
    this.domElement.addEventListener('touchend', this.onTouchEnd);
    this.domElement.addEventListener('touchmove', this.onTouchMove);
  }

  dispose() {
    this.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.domElement.ownerDocument.removeEventListener('pointerup', this.onPointerUp);
    this.domElement.ownerDocument.removeEventListener('pointermove', this.onPointerMove);
    this.domElement.removeEventListener('contextmenu', this.onContextMenu);
    this.domElement.removeEventListener('wheel', this.onWheel);

     this.domElement.removeEventListener('touchstart', this.onTouchStart);
     this.domElement.removeEventListener('touchend', this.onTouchEnd);
     this.domElement.removeEventListener('touchmove', this.onTouchMove);
  }

  onWheel(event) {
    const { deltaY } = event
    this.dolly.handlePC(deltaY)
  }

  onContextMenu(event) {
    event.preventDefault();
  }

  onPointerMove(event) {
    if (this.state == STATE.NONE) return
    const mouse = { x: event.clientX, y: event.clientY }

    switch (this.state) {
      case MOUSE.ROTATE:
        this.rotation.setRotateUpEnd(mouse.x, mouse.y)
        this.rotation.setRotateLeftEnd(mouse.x, mouse.y)
        break;

      case MOUSE.PAN:
        this.pan.setPanEnd(mouse.x, mouse.y)
        break
    }
  }

  onPointerUp() {
    this.state = STATE.NONE
  }

  onPointerDown(event) {
    // 这里不处理touch事件
    const allowEvent = ["mouse", "pen"]
    if (!allowEvent.includes(event.pointerType)) {
      return
    }

    event.preventDefault();
    let mouseAction = STATE.NONE
    switch (event.button) {
      case 0:
        mouseAction = this.mouseButtons.LEFT
        break;

      case 1:
        mouseAction = this.mouseButtons.MIDDLE;
      break;

      case 2:
        mouseAction = this.mouseButtons.RIGHT
        break;

      default:
        mouseAction = STATE.NONE;
    }

    const mouse = { x: event.clientX, y: event.clientY }
    switch (mouseAction) {
      case MOUSE.ROTATE:
        this.rotation.setRotateLeftType(RotateLeftType.OFFSET)
        this.rotation.setRotateUpStart(mouse.x, mouse.y)
        this.rotation.setRotateLeftStart(mouse.x, mouse.y)
        this.state = STATE.ROTATE
        break;

      case MOUSE.PAN:
        this.pan.setPanStart(mouse.x, mouse.y)
        this.state = STATE.PAN
        break;

      default:
        this.state = STATE.NONE
        break;
    }
  }

  handleTouchStartRotate(event) {
    if (event.touches.length == 1) {
      const x = event.touches[0].pageX
      const y = event.touches[0].pageY
      this.rotation.setRotateUpStart(x, y);
      this.rotation.setRotateLeftStart(x, y);
    } else {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
      this.rotation.setRotateUpStart(x, y);

      var dlx = event.touches[0].pageX - event.touches[1].pageX;
      var dly = event.touches[0].pageY - event.touches[1].pageY;
      this.rotation.setRotateLeftStart(dlx, dly);
    }
  }

  handleTouchStartPan(event) {
    if (event.touches.length == 1) {
     this.pan.setPanStart(event.touches[0].pageX, event.touches[0].pageY);
    } else {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
     this.pan.setPanStart(x, y);
    }
  }

  handleTouchStartDolly(event) {
    	var dx = event.touches[0].pageX - event.touches[1].pageX;
    	var dy = event.touches[0].pageY - event.touches[1].pageY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    	this.dolly.setDollyStartForMobile(0, distance);
  }

  handleTouchMoveDolly(event) {
    var dx = event.touches[0].pageX - event.touches[1].pageX;
    var dy = event.touches[0].pageY - event.touches[1].pageY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    this.dolly.setDollyEndForMobile(0, distance);
  }

  handleTouchMoveDollyPan(event) {
    this.handleTouchMoveDolly(event);
    this.handleTouchMovePan(event);
  }

  handleTouchStartDollyPan(event) {
    this.handleTouchStartDolly(event);
    this.handleTouchStartPan(event)
  }

  handleTouchStartDollyRotate(event) {
    this.handleTouchStartDolly(event)
    this.handleTouchStartRotate(event)
  }
  handleTouchMoveDollyRotate(event) {
    this.handleTouchMoveDolly(event)
    this.handleTouchMoveRotate(event)
  }

  onTouchStart(event) {

    event.preventDefault(); // prevent scrolling
    switch (event.touches.length) {
      case 1:
        switch (this.touches.ONE) {
          case TOUCH.ROTATE:
            this.rotation.setRotateLeftType(RotateLeftType.OFFSET)
            this.handleTouchStartRotate(event);
            this.state = STATE.TOUCH_ROTATE;
            break;
          case TOUCH.PAN:
            if (this.enablePan === false) return;
            this.handleTouchStartPan(event);
            this.state = STATE.TOUCH_PAN;
            break;

          default:
            this.state = STATE.NONE;
        }
        break;

      case 2:
        switch (this.touches.TWO) {
          case TOUCH.DOLLY_PAN:
            this.handleTouchStartDollyPan(event);
            this.state = STATE.TOUCH_DOLLY_PAN;
            break;

          case TOUCH.DOLLY_ROTATE:
            this.rotation.setRotateLeftType(RotateLeftType.ANGLE)
            this.handleTouchStartDollyRotate(event);
            this.state = STATE.TOUCH_DOLLY_ROTATE;
            break;

          default:
        }
        break;

      default:
        this.state = STATE.NONE
        break
    }
  }

  onTouchEnd() {
    // no-op
  }

  handleTouchMoveRotate(event) {
    if (event.touches.length == 1) {
      const x = event.touches[0].pageX
      const y = event.touches[0].pageY
      this.rotation.setRotateUpEnd(x, y);
      this.rotation.setRotateLeftEnd(x, y);
    } else {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
      this.rotation.setRotateUpEnd(x, y);

      var dlx = event.touches[0].pageX - event.touches[1].pageX;
      var dly = event.touches[0].pageY - event.touches[1].pageY;

      this.rotation.setRotateLeftEnd(dlx, dly);
    }
  }

  handleTouchMovePan(event) {
		if (event.touches.length == 1) {
		  this.pan.setPanEnd(event.touches[0].pageX, event.touches[0].pageY);
		} else {
		  var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
		  var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
		  this.pan.setPanEnd(x, y);
		}
  }

  onTouchMove(event) {
    event.preventDefault(); // prevent scrolling
    event.stopPropagation();

    	switch (this.state) {
    	  case STATE.TOUCH_ROTATE:
    	    if (this.enableRotate === false) return;
    	    this.handleTouchMoveRotate(event);
    	    this.update();
    	    break;

    	  case STATE.TOUCH_PAN:
    	    this.handleTouchMovePan(event);
    	    this.update();
    	    break;

    	  case STATE.TOUCH_DOLLY_PAN:
    	    this.handleTouchMoveDollyPan(event);
    	    this.update();
    	    break;

    	  case STATE.TOUCH_DOLLY_ROTATE:
    	    this.handleTouchMoveDollyRotate(event);
    	    this.update();
    	    break;

    	  default:
    	    this.state = STATE.NONE;
    	}
  }

  update() {
    this.pan.update()
    this.dolly.update()
    this.rotation.update()
  }
}
