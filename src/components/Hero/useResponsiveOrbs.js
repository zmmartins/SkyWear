import { useEffect, useMemo, useState } from "react";
import { clamp } from "../../utils/clamp";

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
        let rafId = 0;

        const calculate = () => {
            const width = window.innerWidth;
            
            let lastScale = 1.0;
            let c = 0;

            while (width > artDiameter * lastScale && c < max){
                lastScale += step;
                c++;
            }

            setCount(clamp(c, min, max));
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