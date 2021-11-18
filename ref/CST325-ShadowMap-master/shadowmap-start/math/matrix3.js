/*
 * An object representing a 3x3 matrix
 */

var Matrix3 = function() {

	// Stores a matrix in a flat array, see the "set" function for an example of the layout
	// This format will be similar to what we'll eventually need when feeding this to WebGL
	this.elements = new Float32Array(9);

	if (!(this instanceof Matrix3)) {
		alert("Matrix3 constructor must be called with the new operator");
	}

	// -------------------------------------------------------------------------
	this.clone = function() {
		var newMatrix = new Matrix3();
		for (var i = 0; i < 9; ++i) {
			newMatrix.elements[i] = this.elements[i];
		}
		return newMatrix;
	};

	// -------------------------------------------------------------------------
	this.copy = function(other) {
		for (var i = 0; i < 16; ++i) {
			this.elements[i] = other.elements[i];
		}

		return this;
	};

	// -------------------------------------------------------------------------
	this.set = function (e11, e12, e13, e21, e22, e23, e31, e32, e33) {
		var e = this.elements;

		e[0] = e11;   e[1] = e12;   e[2] = e13;
		e[3] = e21;   e[4] = e22;   e[5] = e23;
		e[6] = e31;   e[7] = e32;   e[8] = e33;

		return this;
	};

	// -------------------------------------------------------------------------
	this.getElement = function(row, col) {
		return this.elements[3 * row + col];
	};

	// -------------------------------------------------------------------------
	this.identity = function() {
		this.set(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		);
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationX = function(degrees) {
		var radians = degrees * Math.PI / 180;
		var e = this.elements;
		var c = Math.cos(radians);
		var s = Math.sin(radians);

		e[0] = 1;   e[1] = 0;   e[2] = 0;
		e[3] = 0;   e[4] = c;   e[5] = -s;
		e[6] = 0;   e[7] = s;   e[8] = c;

		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationY = function(degrees) {
		var radians = degrees * Math.PI / 180;
		var e = this.elements;
		var c = Math.cos(radians);
		var s = Math.sin(radians);

		e[0] = c;   e[1] = 0;   e[2] = s;
		e[3] = 0;   e[4] = 1;   e[5] = 0;
		e[6] = -s;  e[7] = 0;   e[8] = c;

		return this;
	};


	// -------------------------------------------------------------------------
	this.setRotationZ = function(degrees) {
		var radians = degrees * Math.PI / 180;
		var e = this.elements;
		var c = Math.cos(radians);
		var s = Math.sin(radians);

		e[0] = c;   e[1] = -s;  e[2] = 0;
		e[3] = s;   e[4] = c;   e[5] = 0;
		e[6] = 0;   e[7] = 0;   e[8] = 1;

		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyScalar = function(s) {
		for (var i = 0; i < 16; ++i) {
			this.elements[i] = this.elements[i] * s;
		}
	};

	// -------------------------------------------------------------------------
	this.multiplyRightSide = function(otherMatrixOnRight) {
		// shorthand
		var te = this.elements;
		var oe = otherMatrixOnRight.elements;

		var m11 = te[0] * oe[0] + te[1] * oe[3] + te[2] * oe[6];
		var m12 = te[0] * oe[1] + te[1] * oe[4] + te[2] * oe[7];
		var m13 = te[0] * oe[2] + te[1] * oe[5] + te[2] * oe[8];

		var m21 = te[3] * oe[0] + te[4] * oe[3] + te[5] * oe[6];
		var m22 = te[3] * oe[1] + te[4] * oe[4] + te[5] * oe[7];
		var m23 = te[3] * oe[2] + te[4] * oe[5] + te[5] * oe[8];

		var m31 = te[6] * oe[0] + te[7] * oe[3] + te[8] * oe[6];
		var m32 = te[6] * oe[1] + te[7] * oe[4] + te[8] * oe[7];
		var m33 = te[6] * oe[2] + te[7] * oe[5] + te[8] * oe[8];

		this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);

		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyVector = function(vector) {
		// shorthand
		var te = this.elements;
		var clone = vector.clone();
		vector.x = te[0] * clone.x + te[1] * clone.y + te[2] * clone.z;
		vector.y = te[3] * clone.x + te[4] * clone.y + te[5] * clone.z;
		vector.z = te[6] * clone.x + te[7] * clone.y + te[8] * clone.z;
	}

	// -------------------------------------------------------------------------
	this.determinant = function() {
		var e = this.elements;

		// laid out for clarity, not performance
		var m11 = e[0];   var m12 = e[1];   var m13 = e[2];
		var m21 = e[3];   var m22 = e[4];   var m23 = e[5];
		var m31 = e[6];   var m32 = e[7];   var m33 = e[8];

		var minor11 = m22 * m33 - m23 * m32;
		var minor12 = m21 * m33 - m23 * m31;
		var minor13 = m21 * m32 - m22 * m31;

		return m11 * minor11 - m12 * minor12 + m13 * minor13;
	};

	// -------------------------------------------------------------------------
	this.transpose = function() {
		var e = this.elements;
		var tmp;

		tmp = e[1];   e[1] = e[3];   e[3] = tmp;
		tmp = e[2];   e[2] = e[6];   e[6] = tmp;
		tmp = e[5];   e[5] = e[7];   e[7] = tmp;

		return this;
	};

	// -------------------------------------------------------------------------
	this.inverse = function() {
		var FLOAT32_EPSILON = 1.1920928955078125e-7;
		var det = this.determinant();
		if(Math.abs(det) <= FLOAT32_EPSILON) {
			return identity();
		} else {
			var e = this.elements;

			// laid out for clarity, not performance
			var m11 = e[0];   var m12 = e[1];   var m13 = e[2];
			var m21 = e[3];   var m22 = e[4];   var m23 = e[5];
			var m31 = e[6];   var m32 = e[7];   var m33 = e[8];

			var minor11 = m22 * m33 - m23 * m32;
			var minor12 = m21 * m33 - m23 * m31;
			var minor13 = m21 * m32 - m22 * m31;
			var minor21 = m12 * m33 - m13 * m32;
			var minor22 = m11 * m33 - m13 * m31;
			var minor23 = m11 * m32 - m12 * m31;
			var minor31 = m12 * m23 - m13 * m22;
			var minor32 = m11 * m33 - m13 * m31;
			var minor33 = m11 * m22 - m12 * m21;

			return this.set(
				minor11, -minor21, minor31,
				-minor12, minor22, -minor32,
				minor13, -minor23, minor33
			).multiplyScalar(1/det);
		}
	};

	// -------------------------------------------------------------------------
	this.log = function() {
		var e = this.elements;
		console.log('[ '+
					'\n ' + e[0]  + ', ' + e[1]  + ', ' + e[2]  +
			        '\n ' + e[4]  + ', ' + e[5]  + ', ' + e[6]  +
			        '\n ' + e[8]  + ', ' + e[9]  + ', ' + e[10] +
			        '\n ' + e[12] + ', ' + e[13] + ', ' + e[14] +
			        '\n]'
		);

		return this;
	};

	// default value
	this.identity();
};
