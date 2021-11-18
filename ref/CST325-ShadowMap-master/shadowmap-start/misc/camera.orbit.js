function OrbitCamera(input) {
    this.cameraWorldMatrix = new Matrix4();
    this.cameraTarget = new Vector3();
    this.yawDegrees = 0;
    this.pitchDegrees = -45;
    this.minDistance = 1;
    this.maxDistance = 30;
    this.zoomScale = 1;

    var lastMouseX = 0;
    var lastMouseY = 0;
    var isDragging = false;
    var position = new Vector3();

    // -------------------------------------------------------------------------
    this.getPosition = function() {
        return position;
    }

    // -------------------------------------------------------------------------
    this.getViewMatrix = function() {
        return this.cameraWorldMatrix.clone().inverse();
    }

    // -------------------------------------------------------------------------
    this.getRight = function() {
        return new Vector3(
            this.cameraWorldMatrix.elements[0],
            this.cameraWorldMatrix.elements[4],
            this.cameraWorldMatrix.elements[8]
        ).normalize();
    }

    // -------------------------------------------------------------------------
    this.getUp = function() {
        return new Vector3(
            this.cameraWorldMatrix.elements[1],
            this.cameraWorldMatrix.elements[5],
            this.cameraWorldMatrix.elements[9]
        ).normalize();
    }

    // -------------------------------------------------------------------------
    this.update = function(dt, secondsElapsedSinceStart) {
        // Extract the basis vector corresponding to forward
        var currentForward = new Vector3(
            this.cameraWorldMatrix.elements[2],
            this.cameraWorldMatrix.elements[6],
            this.cameraWorldMatrix.elements[10]
        );

        var tether = new Vector3(0, 0, this.minDistance + (this.maxDistance - this.minDistance) * this.zoomScale);
        var yaw = new Matrix3().setRotationY(this.yawDegrees);
        var pitch = new Matrix3().setRotationX(this.pitchDegrees);
        pitch.multiplyVector(tether);
        yaw.multiplyVector(tether);

        var fromTargetToCamera = this.cameraTarget.clone().add(tether);

        position = this.cameraTarget.clone().add(fromTargetToCamera);
        this.cameraWorldMatrix.setLookAt(position, new Vector3(), new Vector3(0, 1, 0));
    }

    // -------------------------------------------------------------------------
    document.onmousedown = function(evt) {
        isDragging = true;
        lastMouseX = evt.pageX;
        lastMouseY = evt.pageY;
    }

    // -------------------------------------------------------------------------
    document.onmousemove = function(evt) {
        if (isDragging) {
            this.yawDegrees -= (evt.pageX - lastMouseX) * 0.5;
            this.pitchDegrees -= (evt.pageY - lastMouseY) * 0.5;

            this.pitchDegrees = Math.min(this.pitchDegrees, 85);
            this.pitchDegrees = Math.max(this.pitchDegrees, -85);

            lastMouseX = evt.pageX;
            lastMouseY = evt.pageY;
        }
    }.bind(this)

    // -------------------------------------------------------------------------
    document.onmousewheel = function(evt) {
        this.zoomScale -= evt.wheelDelta * 0.001;
        this.zoomScale = Math.min(this.zoomScale, 1);
        this.zoomScale = Math.max(this.zoomScale, 0);
    }.bind(this)

    // -------------------------------------------------------------------------
    document.onmouseup = function(evt) {
        isDragging = false;
    }
}