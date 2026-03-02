import { useEffect, useMemo, useState } from "react";
import { clamp } from "../../../utils/clamp";

/**
 * HOOK: useResponsiveOrbs
 * ------------------------------------------------------------------
 * Calculates how many decorative rings/orbs fit on the screen based
 * on the viewport width relative to the central art element.
 * * Logic: 
 * As the screen gets wider, we add more rings (orbs) to fill the void.
 * We calculate this using a scaling factor step.
 * * @param {Object} config
 * @param {number} config.min - Minimum number of orbs (default: 3)
 * @param {number} config.max - Maximum number of orbs (default: 10)
 * @param {number} config.artDiameter - The base width of the central art in px (default: 360)
 * @param {number} config.step - How much extra space (percentage of diameter) each orb requires (default: 0.3)
 * @param {number} config.base - The starting CSS size % for the first orb (default: 130)
 * @param {number} config.increment - How much each subsequent orb grows in % (default: 30)
 */
export default function useResponsiveOrbs({
    min = 3,
    max = 10,
    artDiameter = 360,
    step = 0.3,
    base = 130,
    increment = 30,
} = {}) {
    const [count, setCount] = useState(min);

    useEffect(() => {
        let rafId;

        const calculate = () => {
            const width = window.innerWidth;
            
            // OPTIMIZATION: Replaced O(N) while loop with O(1) Math
            // Equation: width > artDiameter * (1 + (count * step))
            // Solved for count:
            const maxScale = width / artDiameter;
            const rawCount = Math.floor((maxScale - 1) / step) + 1;

            // Ensure we never show fewer than min or more than max
            setCount(clamp(rawCount, min, max));
        };

        const onResize = () => {
            // Debounce via RequestAnimationFrame
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(calculate);
        };

        // Initial Calculation
        calculate();

        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
        };
    }, [artDiameter, max, min, step]);

    // OPTIMIZATION: Memoize the array generation to avoid 
    // creating new arrays unless the count actually changes.
    const orbSizes = useMemo(
        () => Array.from({ length: count }, (_, i) => base + i * increment),
        [count, base, increment]
    );

    return { count, orbSizes };
}