/**
 * Calculates simple hash value of a string. Designed for performance, not perfect.
 *
 * @param {string} str - String.
 * @returns {number} Hash value.
 * @ignore
 */
function hashCode(str:string):number {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        // Convert to 32bit integer
        hash |= 0;
    }
    return hash;
}

export { hashCode };
