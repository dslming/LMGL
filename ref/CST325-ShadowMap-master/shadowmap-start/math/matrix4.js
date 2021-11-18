/*
 * An object representing a 4x4 matrix
 */

var Matrix4 = function(x, y, z) {
	this.elements = new Float32Array(16);

	if (!(this instanceof Matrix4)) {
		alert("Matrix4 constructor must be called with the new operator");
	}

	// -------------------------------------------------------------------------
	this.clone = function () {
		var newMatrix = new Matrix4();
		for (var i = 0; i < 16; ++i) {
			newMatrix.elements[i] = this.elements[i];
		}
		return newMatrix;
	};

	// -------------------------------------------------------------------------
	this.copy = function(m) {
		for (var i = 0; i < 16; ++i) {
			this.elements[i] = m.elements[i];
		}

		return this;
	};

	// -------------------------------------------------------------------------
	this.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
		var e = this.elements;

		e[0] = n11;   e[1] = n12;   e[2] = n13;   e[3] = n14;
		e[4] = n21;   e[5] = n22;   e[6] = n23;   e[7] = n24;
		e[8] = n31;   e[9] = n32;   e[10] = n33;  e[11] = n34;
		e[12] = n41;  e[13] = n42;  e[14] = n43;  e[15] = n44;

		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationX = function(degrees) {
		var radians = degrees * Math.PI / 180;

		var e = this.elements;
		var c = Math.cos(radians);
		var s = Math.sin(radians);

		e[0] = 1;   e[1] = 0;   e[2] = 0;   e[3] = 0;
		e[4] = 0;   e[5] = c;   e[6] = -s;  e[7] = 0;
		e[8] = 0;   e[9] = s;   e[10] = c;  e[11] = 0;
		e[12] = 0;  e[13] = 0;  e[14] = 0;  e[15] = 1;

		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationY = function(degrees) {
		var radians = degrees * Math.PI / 180;

		var e = this.elements;
		var c = Math.cos(radians);
		var s = Math.sin(radians);

		e[0] = c;   e[1] = 0;   e[2] = s;   e[3] = 0;
		e[4] = 0;   e[5] = 1;   e[6] = 0;   e[7] = 0;
		e[8] = -s;  e[9] = 0;   e[10] = c;  e[11] = 0;
		e[12] = 0;  e[13] = 0;  e[14] = 0;  e[15] = 1;

		return this;
	};


	// -------------------------------------------------------------------------
	this.setRotationZ = function(degrees) {
		var radians = degrees * Math.PI / 180;

		var e = this.elements;
		var c = Math.cos(radians);
		var s = Math.sin(radians);

		e[0] = c;   e[1] = -s;  e[2] = 0;   e[3] = 0;
		e[4] = s;   e[5] = c;   e[6] = 0;   e[7] = 0;
		e[8] = 0;   e[9] = 0;   e[10] = 1;  e[11] = 0;
		e[12] = 0;  e[13] = 0;  e[14] = 0;  e[15] = 1;

		return this;
	};

	// -------------------------------------------------------------------------
	this.setLookAt = function(eyePos, targetPos, worldUp) {
		this.identity();
		var forward = targetPos.clone().subtract(eyePos).normalize();
		var right = forward.normalized().cross(worldUp).normalize();
		var up = right.cross(forward);

		var e = this.elements;
		e[0] = right.x;   e[1] = up.x;   e[2] = -forward.x;    e[3] = eyePos.x;
		e[4] = right.y;   e[5] = up.y;   e[6] = -forward.y;    e[7] = eyePos.y;
		e[8] = right.z;   e[9] = up.z;   e[10] = -forward.z;   e[11] = eyePos.z;
		e[12] = 0;        e[13] = 0;     e[14] = 0;            e[15] = 1;

		return this;
	};

	// -------------------------------------------------------------------------
	this.setPerspective = function(fovy, aspect, near, far) {
		var fovyRads = (Math.PI / 180) * fovy;
		var t = near * Math.tan(fovyRads / 2);
		var r = t * aspect;

		// lazy
		this.identity();

		var e = this.elements;
		e[0] = near / r;
		e[5] = near / t;
		e[10] = -(far + near) / (far - near);
		e[11] = (-2 * near * far) / (far - near);
		e[14] = -1;
		e[15] = 0; // easy to forget this one (that lazy identity call...)

		return this;
	};

	// -------------------------------------------------------------------------
	this.setOrthographic = function(left, right, top, bottom, near, far) {
        this.identity();
		// todo set this matrix equal to an orthographic projection
        this.elements[0] = 2 / (right - left);

        this.elements[3] = -1 * (right + left) / (right - left);

        this.elements[5] = 2 / (top - bottom);

        this.elements[7] = -1 * (top + bottom) / (top - bottom);

        this.elements[10] =  -2 / (far - near);

        this.elements[11] = -1 * (far + near) / (far - near);

        return this;
	}

	// -------------------------------------------------------------------------
	this.translate = function(arg1, arg2, arg3) {
		if (arg1 instanceof Vector3) {
			this.elements[3] += arg1.x;
			this.elements[7] += arg1.y;
			this.elements[11] += arg1.z;
		} else {
			this.elements[3] += arg1;
			this.elements[7] += arg2;
			this.elements[11] += arg3;
		}
		return this;
	}

	// -------------------------------------------------------------------------
	this.scale = function(x, y, z) {
		var scaleMatrix = new Matrix4();
		scaleMatrix.elements[0] *= x;
		scaleMatrix.elements[5] *= y;
		scaleMatrix.elements[10] *= z;

		this.multiplyRightSide(scaleMatrix);
		return this;
	}

	// -------------------------------------------------------------------------
	this.identity = function() {
		this.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyScalar = function(s) {
		for (var i = 0; i < 16; ++i) {
			this.elements[i] = this.elements[i] * s;
		}
	};

	// -------------------------------------------------------------------------
	this.multiplyRightSide = function(otherMatrix4) {
		// shorthand
		var te = this.elements;
		var oe = otherMatrix4.elements;

		var m11 = te[0] * oe[0] + te[1] * oe[4] + te[2] * oe[8]  + te[3] * oe[12];
		var m12 = te[0] * oe[1] + te[1] * oe[5] + te[2] * oe[9]  + te[3] * oe[13];
		var m13 = te[0] * oe[2] + te[1] * oe[6] + te[2] * oe[10] + te[3] * oe[14];
		var m14 = te[0] * oe[3] + te[1] * oe[7] + te[2] * oe[11] + te[3] * oe[15];

		var m21 = te[4] * oe[0] + te[5] * oe[4] + te[6] * oe[8] + te[7] * oe[12];
		var m22 = te[4] * oe[1] + te[5] * oe[5] + te[6] * oe[9] + te[7] * oe[13];
		var m23 = te[4] * oe[2] + te[5] * oe[6] + te[6] * oe[10] + te[7] * oe[14];
		var m24 = te[4] * oe[3] + te[5] * oe[7] + te[6] * oe[11] + te[7] * oe[15];

		var m31 = te[8] * oe[0] + te[9] * oe[4] + te[10] * oe[8] + te[11] * oe[12];
		var m32 = te[8] * oe[1] + te[9] * oe[5] + te[10] * oe[9] + te[11] * oe[13];
		var m33 = te[8] * oe[2] + te[9] * oe[6] + te[10] * oe[10] + te[11] * oe[14];
		var m34 = te[8] * oe[3] + te[9] * oe[7] + te[10] * oe[11] + te[11] * oe[15];

		var m41 = te[12] * oe[0] + te[13] * oe[4] + te[14] * oe[8] + te[15] * oe[12];
		var m42 = te[12] * oe[1] + te[13] * oe[5] + te[14] * oe[9] + te[15] * oe[13];
		var m43 = te[12] * oe[2] + te[13] * oe[6] + te[14] * oe[10] + te[15] * oe[14];
		var m44 = te[12] * oe[3] + te[13] * oe[7] + te[14] * oe[11] + te[15] * oe[15];

		this.set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);

		return this;
	};

	// -------------------------------------------------------------------------
	this.determinant = function() {
        var e = this.elements;

        // laid out for clarity, not performance
        var m11 = e[0];   var m12 = e[1];   var m13 = e[2];   var m14 = e[3];
        var m21 = e[4];   var m22 = e[5];   var m23 = e[6];	  var m24 = e[7];
        var m31 = e[8];   var m32 = e[8];   var m33 = e[9];   var m34 = e[10];
        var m41 = e[12];  var m42 = e[13];  var m43 = e[14];  var m44 = e[15];

        var det11 = m11 * (m22 * (m33 * m44 - m34 * m43) +
                           m23 * (m34 * m42 - m32 * m44) +
                           m24 * (m32 * m43 - m33 * m42));

        var det12 = -m12 * (m21 * (m33 * m44 - m34 * m43) +
                            m23 * (m34 * m41 - m31 * m44) +
                            m24 * (m31 * m43 - m33 * m41));

        var det13 =  m13 * (m21 * (m32 * m44 - m34 * m42) +
                            m22 * (m34 * m41 - m31 * m44) +
                            m24 * (m31 * m42 - m32 * m41));

        var det14 = -m14 * (m21 * (m32 * m43 - m33 * m42) +
                            m22 * (m33 * m41 - m31 * m43) +
                            m23 * (m31 * m42 - m32 * m41));

        return det11 + det12 + det13 + det14;
	};

	// -------------------------------------------------------------------------
	this.transpose = function() {
		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;
	};

	// -------------------------------------------------------------------------
	this.getElement = function(row, col) {
		return this.elements[row * 4 + col];
	};

	// -------------------------------------------------------------------------
	this.inverse = function() {
		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements,
			me = this.clone().elements,

			n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ], n41 = me[ 3 ],
			n12 = me[ 4 ], n22 = me[ 5 ], n32 = me[ 6 ], n42 = me[ 7 ],
			n13 = me[ 8 ], n23 = me[ 9 ], n33 = me[ 10 ], n43 = me[ 11 ],
			n14 = me[ 12 ], n24 = me[ 13 ], n34 = me[ 14 ], n44 = me[ 15 ],

			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

		var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

		if ( det === 0 ) {
			var msg = "can't invert matrix, determinant is 0";
			console.warn(msg);
			return this.identity();
		}

		var detInv = 1 / det;

		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
		te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
		te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

		te[ 4 ] = t12 * detInv;
		te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
		te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
		te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

		te[ 8 ] = t13 * detInv;
		te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
		te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
		te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

		te[ 12 ] = t14 * detInv;
		te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
		te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
		te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

		return this;
	};

	// -------------------------------------------------------------------------
	this.log = function() {
		var te = this.elements;
		console.log('[ '+
					'\n ' +te[0] + ', ' + te[1] + ', ' + te[2] + ', ' + te[3] +
			        '\n ' + te[4] + ', ' + te[5] + ', ' + te[6] + ', ' + te[7] +
			        '\n ' + te[8] + ', ' + te[9] + ', ' + te[10] + ', ' + te[11] +
			        '\n ' + te[12] + ', ' + te[13] + ', ' + te[14] + ', ' + te[15] +
			        '\n]'
		);

		return this;
	};

	return this.identity();
};
