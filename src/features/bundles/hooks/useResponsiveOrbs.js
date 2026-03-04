import { useEffect, useMemo, useState } from "react";
import { clamp } from "@/utils/clamp"; // Use Absolute Import

/**
 * HOOK: useResponsiveOrbs
 * Calculates how many decorative rings fit on the screen based
 * on the viewport width using O(1) mathematical scaling.
 */
export default function useResponsiveOrbs({
    min = 3, max = 10, artDiameter = 360, step = 0.3, base = 130, increment = 30
} = {}) {
    const [count, setCount] = useState(min);

    useEffect(() => {
        let rafId;
        const calculate = () => {
            const width = window.innerWidth;
            const maxScale = width / artDiameter;
            const rawCount = Math.floor((maxScale - 1) / step) + 1;
            setCount(clamp(rawCount, min, max));
        };

        const onResize = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(calculate);
        };

        calculate();
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
        };
    }, [artDiameter, max, min, step]);

    const orbSizes = useMemo(
        () => Array.from({ length: count }, (_, i) => base + i * increment),
        [count, base, increment]
    );

    return { count, orbSizes };
}