/**
 * @name math
 * @namespace
 * @description Math API.
 */
export class MathTool {
    /**
     * @constant
     * @type {number}
     * @name math.DEG_TO_RAD
     * @description Conversion factor between degrees and radians.
     * @example
     * // Convert 180 degrees to pi radians
     * var rad = 180 * pc.math.DEG_TO_RAD;
     */
    static DEG_TO_RAD: number = Math.PI / 180;

    /**
     * @constant
     * @type {number}
     * @name math.RAD_TO_DEG
     * @description Conversion factor between degrees and radians.
     * @example
     * // Convert pi radians to 180 degrees
     * var deg = Math.PI * pc.math.RAD_TO_DEG;
     */
    static RAD_TO_DEG: number = 180 / Math.PI

    /**
     * @function
     * @name math.clamp
     * @description Clamp a number between min and max inclusive.
     * @param {number} value - Number to clamp.
     * @param {number} min - Min value.
     * @param {number} max - Max value.
     * @returns {number} The clamped value.
     */
    static clamp (value: number, min: number, max: number) {
        if (value >= max) return max;
        if (value <= min) return min;
        return value;
    }

    /**
     * @function
     * @name math.intToBytes24
     * @description Convert an 24 bit integer into an array of 3 bytes.
     * @param {number} i - Number holding an integer value.
     * @returns {number[]} An array of 3 bytes.
     * @example
     * // Set bytes to [0x11, 0x22, 0x33]
     * var bytes = pc.math.intToBytes24(0x112233);
     */
    static intToBytes24 (i: number) {
        var r, g, b;

        r = (i >> 16) & 0xff;
        g = (i >> 8) & 0xff;
        b = (i) & 0xff;

        return [r, g, b];
    }

    /**
     * @function
     * @name math.intToBytes32
     * @description Convert an 32 bit integer into an array of 4 bytes.
     * @returns {number[]} An array of 4 bytes.
     * @param {number} i - Number holding an integer value.
     * @example
     * // Set bytes to [0x11, 0x22, 0x33, 0x44]
     * var bytes = pc.math.intToBytes32(0x11223344);
     */
    static intToBytes32 (i: number) {
        var r, g, b, a;

        r = (i >> 24) & 0xff;
        g = (i >> 16) & 0xff;
        b = (i >> 8) & 0xff;
        a = (i) & 0xff;

        return [r, g, b, a];
    }

    /**
     * @function
     * @name math.bytesToInt24
     * @description Convert 3 8 bit Numbers into a single unsigned 24 bit Number.
     * @example
     * // Set result1 to 0x112233 from an array of 3 values
     * var result1 = pc.math.bytesToInt24([0x11, 0x22, 0x33]);
     *
     * // Set result2 to 0x112233 from 3 discrete values
     * var result2 = pc.math.bytesToInt24(0x11, 0x22, 0x33);
     * @param {number} r - A single byte (0-255).
     * @param {number} g - A single byte (0-255).
     * @param {number} b - A single byte (0-255).
     * @returns {number} A single unsigned 24 bit Number.
     */
    static bytesToInt24 (bytes:any[]) {
        const b = bytes[2];
        const g = bytes[1];
        const r = bytes[0];
        return ((r << 16) | (g << 8) | b);
    }

    /**
     * @function
     * @name math.bytesToInt32
     * @description Convert 4 1-byte Numbers into a single unsigned 32bit Number.
     * @returns {number} A single unsigned 32bit Number.
     * @example
     * // Set result1 to 0x11223344 from an array of 4 values
     * var result1 = pc.math.bytesToInt32([0x11, 0x22, 0x33, 0x44]);
     *
     * // Set result2 to 0x11223344 from 4 discrete values
     * var result2 = pc.math.bytesToInt32(0x11, 0x22, 0x33, 0x44);
     * @param {number} r - A single byte (0-255).
     * @param {number} g - A single byte (0-255).
     * @param {number} b - A single byte (0-255).
     * @param {number} a - A single byte (0-255).
     */
    static bytesToInt32 (bytes: any[]) {
        const a = bytes[3];
        const b = bytes[2];
        const g = bytes[1];
        const r = bytes[0];
        // Why ((r << 24)>>>32)?
        // << operator uses signed 32 bit numbers, so 128<<24 is negative.
        // >>> used unsigned so >>>32 converts back to an unsigned.
        // See http://stackoverflow.com/questions/1908492/unsigned-integer-in-javascript
        return ((r << 24) | (g << 16) | (b << 8) | a) >>> 32;
    }

    /**
     * @function
     * @name math.lerp
     * @returns {number} The linear interpolation of two numbers.
     * @description Calculates the linear interpolation of two numbers.
     * @param {number} a - Number to linearly interpolate from.
     * @param {number} b - Number to linearly interpolate to.
     * @param {number} alpha - The value controlling the result of interpolation. When alpha is 0,
     * a is returned. When alpha is 1, b is returned. Between 0 and 1, a linear interpolation between
     * a and b is returned. alpha is clamped between 0 and 1.
     */
    static lerp (a: number, b: number, alpha: any) {
        return a + (b - a) * MathTool.clamp(alpha, 0, 1);
    }

    /**
     * @function
     * @name math.lerpAngle
     * @description Calculates the linear interpolation of two angles ensuring that interpolation
     * is correctly performed across the 360 to 0 degree boundary. Angles are supplied in degrees.
     * @returns {number} The linear interpolation of two angles.
     * @param {number} a - Angle (in degrees) to linearly interpolate from.
     * @param {number} b - Angle (in degrees) to linearly interpolate to.
     * @param {number} alpha - The value controlling the result of interpolation. When alpha is 0,
     * a is returned. When alpha is 1, b is returned. Between 0 and 1, a linear interpolation between
     * a and b is returned. alpha is clamped between 0 and 1.
     */
    static lerpAngle (a: number, b: number, alpha: any) {
        if (b - a > 180 ) {
            b -= 360;
        }
        if (b - a < -180 ) {
            b += 360;
        }
        return MathTool.lerp(a, b, MathTool.clamp(alpha, 0, 1));
    }

    /**
     * @function
     * @name math.powerOfTwo
     * @description Returns true if argument is a power-of-two and false otherwise.
     * @param {number} x - Number to check for power-of-two property.
     * @returns {boolean} True if power-of-two and false otherwise.
     */
    static powerOfTwo (x: number) {
        return ((x !== 0) && !(x & (x - 1)));
    }

    /**
     * @function
     * @name math.nextPowerOfTwo
     * @description Returns the next power of 2 for the specified value.
     * @param {number} val - The value for which to calculate the next power of 2.
     * @returns {number} The next power of 2.
     */
    static nextPowerOfTwo (val: number) {
        val--;
        val |= (val >> 1);
        val |= (val >> 2);
        val |= (val >> 4);
        val |= (val >> 8);
        val |= (val >> 16);
        val++;
        return val;
    }

    /**
     * @function
     * @name math.random
     * @description Return a pseudo-random number between min and max.
     * The number generated is in the range [min, max), that is inclusive of the minimum but exclusive of the maximum.
     * @param {number} min - Lower bound for range.
     * @param {number} max - Upper bound for range.
     * @returns {number} Pseudo-random number between the supplied range.
     */
    static random (min: number, max: number) {
        var diff = max - min;
        return Math.random() * diff + min;
    }

    /**
     * @function
     * @name math.smoothstep
     * @description The function interpolates smoothly between two input values based on
     * a third one that should be between the first two. The returned value is clamped
     * between 0 and 1.
     * <br/>The slope (i.e. derivative) of the smoothstep function starts at 0 and ends at 0.
     * This makes it easy to create a sequence of transitions using smoothstep to interpolate
     * each segment rather than using a more sophisticated or expensive interpolation technique.
     * <br/>See http://en.wikipedia.org/wiki/Smoothstep for more details.
     * @param {number} min - The lower bound of the interpolation range.
     * @param {number} max - The upper bound of the interpolation range.
     * @param {number} x - The value to interpolate.
     * @returns {number} The smoothly interpolated value clamped between zero and one.
     */
    static smoothstep (min: number, max: number, x: number) {
        if (x <= min) return 0;
        if (x >= max) return 1;

        x = (x - min) / (max - min);

        return x * x * (3 - 2 * x);
    }

    /**
     * @function
     * @name math.smootherstep
     * @description An improved version of the {@link math.smoothstep} function which has zero
     * 1st and 2nd order derivatives at t=0 and t=1.
     * <br/>See http://en.wikipedia.org/wiki/Smoothstep for more details.
     * @param {number} min - The lower bound of the interpolation range.
     * @param {number} max - The upper bound of the interpolation range.
     * @param {number} x - The value to interpolate.
     * @returns {number} The smoothly interpolated value clamped between zero and one.
     */
    static smootherstep (min: number, max: number, x: number) {
        if (x <= min) return 0;
        if (x >= max) return 1;

        x = (x - min) / (max - min);

        return x * x * x * (x * (x * 6 - 15) + 10);
    }

    /**
     * @function
     * @name math.roundUp
     * @description Rounds a number up to nearest multiple.
     * @param {number} numToRound - The number to round up.
     * @param {number} multiple - The multiple to round up to.
     * @returns {number} A number rounded up to nearest multiple.
     */
    static roundUp (numToRound: number, multiple: number) {
        if (multiple === 0)
            return numToRound;
        return Math.ceil(numToRound / multiple) * multiple;
    }

    /**
     * @function
     * @name math.float2Half
     * @description Converts float number to half float representation.
     * @param {number} val - The float number.
     * @returns {number} A 16 bit number representing half float representation as used by GPU.
     */
    static float2Half(val: number){
        // based on based on https://esdiscuss.org/topic/float16array
        var floatView = new Float32Array(1);
        var int32View = new Int32Array(floatView.buffer);

        // This method is faster than the OpenEXR implementation (very often
        // used, eg. in Ogre), with the additional benefit of rounding, inspired
        // by James Tursa?s half-precision code.

        floatView[0] = val;
        var x = int32View[0];

        var bits = (x >> 16) & 0x8000; // Get the sign
        var m = (x >> 12) & 0x07ff; // Keep one extra bit for rounding
        var e = (x >> 23) & 0xff; // Using int is faster here

        // If zero, or denormal, or exponent underflows too much for a denormal half, return signed zero.
        if (e < 103) {
            return bits;
        }

        // If NaN, return NaN. If Inf or exponent overflow, return Inf.
        if (e > 142) {
            bits |= 0x7c00;

            // If exponent was 0xff and one mantissa bit was set, it means NaN,
            // not Inf, so make sure we set one mantissa bit too.
            bits |= ((e == 255) ? 0 : 1) && (x & 0x007fffff);
            return bits;
        }

        // If exponent underflows but not too much, return a denormal
        if (e < 113) {
            m |= 0x0800;

            // Extra rounding may overflow and set mantissa to 0 and exponent to 1, which is OK.
            bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
            return bits;
        }

        bits |= ((e - 112) << 10) | (m >> 1);

        // Extra rounding. An overflow will set mantissa to 0 and increment the exponent, which is OK.
        bits += m & 1;
        return bits;
    }

    /**
     * @function
     * @private
     * @name math.between
     * @description Checks whether a given number resides between two other given numbers.
     * @returns {boolean} true if between or false otherwise.
     * @param {number} num - The number to check the position of.
     * @param {number} a - The first upper or lower threshold to check between.
     * @param {number} b - The second upper or lower threshold to check between.
     * @param {boolean} inclusive - If true, a num param which is equal to a or b will return true.
     */
    static between(num: number, a: number, b: number, inclusive: any) {
        var min = Math.min(a, b),
            max = Math.max(a, b);
        return inclusive ? num >= min && num <= max : num > min && num < max;
    }
}
