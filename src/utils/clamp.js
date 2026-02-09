/**
 * UTILS: Clamp
 * ------------------------------------------------------------------
 * Restricts a value within a specified range.
 * * @param {number} value - The value to constrain
 * @param {number} min   - The minimum lower bound
 * @param {number} max   - The maximum upper bound
 * @returns {number}     - The clamped value
 * * @example
 * clamp(10, 0, 5);  // Returns 5
 * clamp(-5, 0, 5);  // Returns 0
 * clamp(3, 0, 5);   // Returns 3
 */
export function clamp(value, min, max) {
    // Optimization: Ternary operators are faster than Math.min/Math.max 
    // in high-frequency animation loops (requestAnimationFrame).
    return value < min ? min : (value > max ? max : value);
}