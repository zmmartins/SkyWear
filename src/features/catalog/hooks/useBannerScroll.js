import { useEffect, useRef } from 'react';
import { clamp } from '@/utils/clamp';

export const useBannerScroll = () => {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const arrowWrapperRef = useRef(null);
    const arrowMaskRef = useRef(null);

    useEffect(() => {
        let ticking = false;

        const calculateScrollEffects = () => {
            if (!sectionRef.current || !imageRef.current) return;

            // REMOVED THE MOBILE BAILOUT BLOCK HERE!
            // Now the scroll math applies to all devices.

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const rawProgress = 1 - (rect.top / viewportHeight);
            const progress = clamp(rawProgress, 0, 1);
            
            sectionRef.current.style.setProperty('--scroll-progress', progress);

            const translateY = rect.top * -0.25;
            imageRef.current.style.transform = `translate3d(-50%, ${translateY}px, 0)`;

            let colorString;
            if (progress >= 0.9998) {
                colorString = 'var(--color-accent, #f97316)';
            } else {
                const shade = Math.floor((progress / 0.99) * 255);
                colorString = `rgb(${shade}, ${shade}, ${shade})`;
            }
            sectionRef.current.style.setProperty('--highlight-color', colorString);

            if (arrowWrapperRef.current && arrowMaskRef.current) {
                const arrowMaxHeight = arrowWrapperRef.current.offsetHeight || 400; 
                const visibleHeight = (viewportHeight - 10) - arrowWrapperRef.current.getBoundingClientRect().top;
                const clampHeight = Math.min(Math.max(visibleHeight, 0), arrowMaxHeight);
                arrowMaskRef.current.style.height = `${clampHeight}px`;
            }
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    calculateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        
        onScroll(); 

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return { sectionRef, imageRef, arrowWrapperRef, arrowMaskRef };
};