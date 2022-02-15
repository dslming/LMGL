import { Vec3 } from "../maths/math.vec3";
import { Logger } from "../misc/logger";

/**
 * An infinite ray.
 */
class Ray {
    origin: Vec3;
    direction: Vec3;

    /**
     * Creates a new Ray instance. The ray is infinite, starting at a given origin and pointing in
     * a given direction.
     *
     * @param {Vec3} [origin] - The starting point of the ray. The constructor takes a reference of
     * this parameter. Defaults to the origin (0, 0, 0).
     * @param {Vec3} [direction] - The direction of the ray. The constructor takes a reference of
     * this parameter. Defaults to a direction down the world negative Z axis (0, 0, -1).
     * @example
     * // Create a new ray starting at the position of this entity and pointing down
     * // the entity's negative Z axis
     * var ray = new pc.Ray(this.entity.getPosition(), this.entity.forward);
     */
    constructor(origin: Vec3 = new Vec3(), direction: Vec3 = new Vec3(0, 0, -1)) {
        Logger.Assert(!Object.isFrozen(origin), `The constructor of 'Ray' does not accept a constant (frozen) object as a 'origin' parameter`);
        Logger.Assert(!Object.isFrozen(direction), `The constructor of 'Ray' does not accept a constant (frozen) object as a 'direction' parameter`);

        /**
         * The starting point of the ray.
         *
         * @type {Vec3}
         */
        this.origin = origin;
        /**
         * The direction of the ray.
         *
         * @type {Vec3}
         */
        this.direction = direction;
    }

    /**
     * Sets origin and direction to the supplied vector values.
     *
     * @param {Vec3} origin - The starting point of the ray.
     * @param {Vec3} direction - The direction of the ray.
     * @returns {Ray} Self for chaining.
     */
    set(origin: Vec3, direction: Vec3): Ray {
        this.origin.copy(origin);
        this.direction.copy(direction);
        return this;
    }
}

export { Ray };
