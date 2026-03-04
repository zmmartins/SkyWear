import { useEffect, useRef } from 'react';

/**
 * HOOK: useBannerScroll
 * ------------------------------------------------------------------
 * Manages hardware-accelerated scroll animations for the ItemsBanner.
 * Includes a requestAnimationFrame throttle and an immediate mobile bailout.
 */
export const useBannerScroll = () => {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const titleTopRef = useRef(null);
    const titleBottomRef = useRef(null);
    const highlightTopRef = useRef(null);
    const highlightBottomRef = useRef(null);
    const arrowWrapperRef = useRef(null);
    const arrowMaskRef = useRef(null);

    useEffect(() => {
        let ticking = false;

        const calculateScrollEffects = () => {
            if (!sectionRef.current || !imageRef.current) return;
            
            // 1. MOBILE BAILOUT: Reset transforms and stop calculations to save battery
            if (window.innerWidth <= 768) {
                imageRef.current.style.transform = 'none';
                if (titleTopRef.current) titleTopRef.current.style.setProperty('--scroll-offset-top', '0px');
                if (titleBottomRef.current) titleBottomRef.current.style.setProperty('--scroll-offset-bottom', '0px');
                return;
            }

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // 2. ACTIVE SCROLL ZONE (Section is entering/moving through viewport)
            if (rect.top >= 0 && rect.top <= viewportHeight) {
                
                // Image Parallax
                const translateY = rect.top * -0.25;
                imageRef.current.style.transform = `translate3d(-50%, ${translateY}px, 0)`;

                // Text Slide-In
                const textScrollFactor = 0.4; 
                if (titleTopRef.current) titleTopRef.current.style.setProperty('--scroll-offset-top', `${rect.top * -textScrollFactor}px`);
                if (titleBottomRef.current) titleBottomRef.current.style.setProperty('--scroll-offset-bottom', `${rect.top * textScrollFactor}px`);

                // Color Interpolation (Grayscale to Orange)
                const rawRatio = Math.max(0, Math.min(1, rect.top / viewportHeight));
                const progress = 1 - rawRatio; 
                let colorString = progress >= 1 
                    ? `rgb(249, 115, 22)` 
                    : `rgb(${Math.floor(progress * 255)}, ${Math.floor(progress * 255)}, ${Math.floor(progress * 255)})`;
                
                if (highlightTopRef.current) highlightTopRef.current.style.color = colorString;
                if (highlightBottomRef.current) highlightBottomRef.current.style.color = colorString;

                // SVG Arrow "Drawing" Expansion
                if (arrowWrapperRef.current && arrowMaskRef.current) {
                    const arrowMaxHeight = arrowWrapperRef.current.offsetHeight || 400; 
                    const visibleHeight = (viewportHeight - 10) - arrowWrapperRef.current.getBoundingClientRect().top;
                    const clampHeight = Math.min(Math.max(visibleHeight, 0), arrowMaxHeight);
                    arrowMaskRef.current.style.height = `${clampHeight}px`;
                }

            } 
            // 3. LOCK ZONE (Section has reached the top of the screen)
            else if (rect.top < 0) {
                imageRef.current.style.transform = `translate3d(-50%, 0px, 0)`;
                
                if (titleTopRef.current) titleTopRef.current.style.setProperty('--scroll-offset-top', '0px');
                if (titleBottomRef.current) titleBottomRef.current.style.setProperty('--scroll-offset-bottom', '0px');
                
                const finalColor = `rgb(249, 115, 22)`;
                if (highlightTopRef.current) highlightTopRef.current.style.color = finalColor;
                if (highlightBottomRef.current) highlightBottomRef.current.style.color = finalColor;

                if (arrowMaskRef.current && arrowWrapperRef.current) {
                     arrowMaskRef.current.style.height = `${arrowWrapperRef.current.offsetHeight}px`;
                }
            }
        };

        // requestAnimationFrame Wrapper ensures we don't calculate faster than the screen can draw
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
        window.addEventListener('resize', onScroll, { passive: true }); // Also recalculate on resize (e.g., rotating phone)
        
        onScroll(); // Fire once on mount

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return {
        sectionRef, imageRef, titleTopRef, titleBottomRef,
        highlightTopRef, highlightBottomRef, arrowWrapperRef, arrowMaskRef
    };
};