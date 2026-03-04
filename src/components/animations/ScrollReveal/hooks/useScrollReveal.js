import { useRef, useEffect, useCallback } from 'react';
import { clamp } from '@/utils/clamp';

/**
 * Custom hook to manage the cinematic scroll-reveal physics.
 * Controls the scroll progress CSS variable, clip-path expansion, 
 * and handles custom scroll hijacking/auto-completion.
 */
export const useScrollReveal = ({ revealStart, collapseStart, autoComplete, duration }) => {
    const trackRef = useRef(null);
    const containerRef = useRef(null);
    const revealLayerRef = useRef(null);
    
    const isLockedRef = useRef(false);
    const prevProgressRef = useRef(0);
    const animationFrameId = useRef(null); // Used to cancel pending animations on unmount

    // --- 1. SCROLL HIJACKING UTILITIES ---
    const preventDefault = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);

    const preventKeyScroll = useCallback((e) => {
        const keys = [' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'];
        if (keys.includes(e.key)) preventDefault(e);
    }, [preventDefault]);

    const lockUserScroll = useCallback(() => {
        document.documentElement.style.setProperty('scroll-snap-type', 'none', 'important');
        document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
        
        window.addEventListener('wheel', preventDefault, { passive: false });
        window.addEventListener('touchmove', preventDefault, { passive: false });
        window.addEventListener('keydown', preventKeyScroll, { passive: false });
        
        isLockedRef.current = true;
    }, [preventDefault, preventKeyScroll]);

    const unlockUserScroll = useCallback(() => {
        document.documentElement.style.removeProperty('scroll-snap-type');
        document.documentElement.style.removeProperty('scroll-behavior');

        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
        window.removeEventListener('keydown', preventKeyScroll);
        
        isLockedRef.current = false;
    }, [preventDefault, preventKeyScroll]);

    // --- 2. VISUAL UPDATE LOGIC ---
    const updateScrollLogic = useCallback(() => {
        if (!trackRef.current || !revealLayerRef.current || !containerRef.current) return null;

        const rect = trackRef.current.getBoundingClientRect();
        const scrollableDistance = rect.height - window.innerHeight;
        
        // Calculate progress and inject it as a CSS variable for child components
        const rawProgress = -rect.top / scrollableDistance;
        const progress = clamp(rawProgress, 0, 1);
        containerRef.current.style.setProperty('--scroll-progress', progress);

        // Expand the clip-path circle once we pass the revealStart threshold
        let circleProgress = 0;
        if (progress > revealStart) {
            circleProgress = (progress - revealStart) / (1 - revealStart);
        }

        const radius = circleProgress * 100;
        revealLayerRef.current.style.clipPath = `circle(${radius}% at 50% 50%)`;

        // Prevent interactions with the hidden layer until it's fully revealed
        revealLayerRef.current.style.pointerEvents = radius < 1 ? 'none' : 'auto';

        return { progress, rect };
    }, [revealStart]);

    // --- 3. SMOOTH SCROLL LOOP ---
    const scrollToTarget = useCallback((targetY) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        let startTime = null;
        
        const ease = (t) => 1 - Math.pow(1 - t, 4);

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const time = timestamp - startTime;
            const percent = Math.min(time / duration, 1);

            window.scrollTo({ top: startY + diff * ease(percent), behavior: 'auto' });
            updateScrollLogic();

            if (percent < 1) {
                animationFrameId.current = window.requestAnimationFrame(step);
            } else {
                unlockUserScroll();
                window.scrollTo({ top: targetY, behavior: 'auto' });
                updateScrollLogic();
            }
        };

        if (animationFrameId.current) window.cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = window.requestAnimationFrame(step);
    }, [duration, unlockUserScroll, updateScrollLogic]);

    // --- 4. SCROLL EVENT LISTENER ---
    useEffect(() => {
        const handleScroll = () => {
            const state = updateScrollLogic();
            if (!state) return;
            
            const { progress, rect } = state;
            const direction = progress - prevProgressRef.current;

            // BYPASS HIJACK IF NAVBAR TRIGGERED SCROLL
            if (document.documentElement.dataset.navScrolling === 'true') {
                prevProgressRef.current = progress;
                return;
            }

            // AUTO-COMPLETE TRIGGER
            if (autoComplete && !isLockedRef.current && Math.abs(direction) > 0.0001) {
                if (progress > (revealStart + 0.001) && progress < 0.999) {
                    const absoluteTopOfTrack = window.scrollY + rect.top;
                    
                    if (direction > 0) {
                        lockUserScroll();
                        scrollToTarget(absoluteTopOfTrack + rect.height - window.innerHeight);
                    } else if (direction < 0 && progress < collapseStart) {
                        lockUserScroll();
                        scrollToTarget(absoluteTopOfTrack);
                    }
                }
            }
            prevProgressRef.current = progress;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        
        // Initial setup
        handleScroll();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            unlockUserScroll();
            if (animationFrameId.current) window.cancelAnimationFrame(animationFrameId.current);
        };
    }, [updateScrollLogic, revealStart, collapseStart, autoComplete, lockUserScroll, unlockUserScroll, scrollToTarget]);

    return { trackRef, containerRef, revealLayerRef };
};