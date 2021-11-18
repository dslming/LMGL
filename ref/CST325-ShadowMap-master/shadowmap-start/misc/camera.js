function Camera(input) {
    this.cameraWorldMatrix = new Matrix4();
    this.cameraYaw = 0;
    this.cameraPosition = new Vector3();

    // -------------------------------------------------------------------------
    this.getViewMatrix = function() {
        return this.cameraWorldMatrix.clone().inverse();
    }

    // -------------------------------------------------------------------------
    this.getPosition = function() {
        return this.cameraPosition;
    }

    // -------------------------------------------------------------------------
    this.update = function(dt) {
        // Extract the basis vector corresponding to forward
        var currentForward = new Vector3(
            this.cameraWorldMatrix.elements[2],
            this.cameraWorldMatrix.elements[6],
            this.cameraWorldMatrix.elements[10]
        );

        if (input.up) {
            this.cameraPosition.subtract(currentForward.multiplyScalar(10 * dt));
        }

        if (input.down) {
            this.cameraPosition.add(currentForward.multiplyScalar(10 * dt));
        }

        if (input.left) {
            this.cameraYaw += 1;
        }

        if (input.right) {
            this.cameraYaw -= 1;
        }

        this.cameraWorldMatrix.setRotationY(this.cameraYaw);
        this.cameraWorldMatrix.translate(this.cameraPosition);
    }
}