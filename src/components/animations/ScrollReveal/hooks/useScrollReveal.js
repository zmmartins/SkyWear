import { useRef, useEffect, useCallback } from 'react';
import { clamp } from '@/utils/clamp';

export const useScrollReveal = ({ revealStart, collapseStart, autoComplete, duration }) => {
    const trackRef = useRef(null);
    const containerRef = useRef(null);
    const revealLayerRef = useRef(null);
    
    const isLockedRef = useRef(false);
    const inViewRef = useRef(false);
    const prevProgressRef = useRef(0);
    const animationFrameId = useRef(null);
    
    // NEW: Physics tracking refs
    const lastScrollRef = useRef({ time: performance.now(), y: 0 });
    const scrollEndTimeoutRef = useRef(null);

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
        
        // Passive: false is required to actively block the scroll event
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
        
        const rawProgress = -rect.top / scrollableDistance;
        const progress = clamp(rawProgress, 0, 1);
        containerRef.current.style.setProperty('--scroll-progress', progress);

        let circleProgress = 0;
        if (progress > revealStart) {
            circleProgress = (progress - revealStart) / (1 - revealStart);
        }

        // The 150% math fix to ensure corners aren't clipped on ultrawide/mobile
        const radius = circleProgress * 150;
        revealLayerRef.current.style.clipPath = `circle(${radius}% at 50% 50%)`;
        revealLayerRef.current.style.pointerEvents = radius < 149 ? 'none' : 'auto';

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
                unlockUserScroll(); // Crucial: Release the lock immediately when done
                window.scrollTo({ top: targetY, behavior: 'auto' });
                updateScrollLogic();
            }
        };

        if (animationFrameId.current) window.cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = window.requestAnimationFrame(step);
    }, [duration, unlockUserScroll, updateScrollLogic]);

    // --- 4. LIFECYCLE & EVENT LISTENERS ---
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            inViewRef.current = entry.isIntersecting;
        });
        if (trackRef.current) observer.observe(trackRef.current);

        const handleScroll = () => {
            if (!inViewRef.current) return;

            const state = updateScrollLogic();
            if (!state) return;
            
            const { progress, rect } = state;
            const direction = progress - prevProgressRef.current;

            // 1. Calculate precise scroll velocity (pixels per millisecond)
            const now = performance.now();
            const currentY = window.scrollY;
            const deltaTime = now - lastScrollRef.current.time;
            const deltaY = currentY - lastScrollRef.current.y;
            
            // Prevent infinite velocity if two events fire on the same millisecond
            const velocity = deltaTime > 0 ? Math.abs(deltaY / deltaTime) : 0;
            
            lastScrollRef.current = { time: now, y: currentY };

            if (document.documentElement.dataset.navScrolling === 'true') {
                prevProgressRef.current = progress;
                return;
            }

            // 2. Clear any pending "scroll end" checks
            if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);

            // 3. The Velocity-Aware Auto-Complete Logic
            if (autoComplete && !isLockedRef.current && Math.abs(direction) > 0.0001) {
                
                // TUNE THIS: 1.0 px/ms is a solid threshold for a "fast" scroll. 
                // Anything under this is considered a slow, deliberate scroll.
                const isSlowScroll = velocity < 1.0; 

                // Are we inside the portal transition zone?
                const isInsidePortal = progress > (revealStart + 0.001) && progress < 0.999;

                if (isInsidePortal && isSlowScroll) {
                    const absoluteTopOfTrack = window.scrollY + rect.top;
                    
                    if (direction > 0) {
                        lockUserScroll();
                        scrollToTarget(absoluteTopOfTrack + rect.height - window.innerHeight);
                    } else if (direction < 0 && progress < collapseStart) {
                        lockUserScroll();
                        scrollToTarget(absoluteTopOfTrack);
                    }
                } else if (isInsidePortal && !isSlowScroll) {
                    // SAFETY NET: If they flicked hard, we let them coast.
                    // But what if their momentum dies right in the middle of the portal?
                    // We wait 150ms after the last scroll event to see if they are stuck.
                    scrollEndTimeoutRef.current = setTimeout(() => {
                        if (isLockedRef.current) return;
                        
                        // Re-check where they landed
                        const finalProgress = parseFloat(containerRef.current.style.getPropertyValue('--scroll-progress'));
                        if (finalProgress > revealStart && finalProgress < 0.999) {
                            const finalTop = window.scrollY + trackRef.current.getBoundingClientRect().top;
                            lockUserScroll();
                            
                            // Snap to the closest boundary
                            if (finalProgress > collapseStart) {
                                scrollToTarget(finalTop + rect.height - window.innerHeight);
                            } else {
                                scrollToTarget(finalTop);
                            }
                        }
                    }, 150);
                }
            }
            prevProgressRef.current = progress;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        
        handleScroll(); // Init

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            observer.disconnect();
            unlockUserScroll();
            if (animationFrameId.current) window.cancelAnimationFrame(animationFrameId.current);
            if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
        };
    }, [updateScrollLogic, revealStart, collapseStart, autoComplete, lockUserScroll, unlockUserScroll, scrollToTarget]);

    return { trackRef, containerRef, revealLayerRef };
};