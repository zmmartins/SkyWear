import React, { useRef, useEffect, useCallback } from 'react';
import './ScrollReveal.css';
import { clamp } from '../../utils/clamp';

export default function ScrollReveal({ 
    children, 
    className = "", 
    revealStart = 0,        
    collapseStart = 0.8,    
    autoComplete = false,
    duration = 700 
}) {
    const trackRef = useRef(null);
    const revealLayerRef = useRef(null);
    const containerRef = useRef(null); 
    
    const isLockedRef = useRef(false);
    const prevProgressRef = useRef(0);

    // --- 1. SCROLL HIJACKING UTILITIES ---
    const preventDefault = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    const preventKeyScroll = (e) => {
        const keys = [' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'];
        if (keys.includes(e.key)) {
            preventDefault(e);
        }
    };

    const lockUserScroll = () => {
        document.documentElement.style.setProperty('scroll-snap-type', 'none', 'important');
        document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
        
        window.addEventListener('wheel', preventDefault, { passive: false });
        window.addEventListener('touchmove', preventDefault, { passive: false });
        window.addEventListener('keydown', preventKeyScroll, { passive: false });
        
        isLockedRef.current = true;
    };

    const unlockUserScroll = () => {
        document.documentElement.style.removeProperty('scroll-snap-type');
        document.documentElement.style.removeProperty('scroll-behavior');

        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
        window.removeEventListener('keydown', preventKeyScroll);
        
        isLockedRef.current = false;
    };

    // --- 2. VISUAL UPDATE LOGIC ---
    const updateScrollLogic = useCallback(() => {
        if (!trackRef.current || !revealLayerRef.current || !containerRef.current) return null;

        const rect = trackRef.current.getBoundingClientRect();
        
        const viewportHeight = window.innerHeight;
        const scrollableDistance = rect.height - viewportHeight;
        const rawProgress = -rect.top / scrollableDistance;
        const progress = clamp(rawProgress, 0, 1);

        containerRef.current.style.setProperty('--scroll-progress', progress);

        let circleProgress = 0;
        if (progress > revealStart) {
            const phaseProgress = (progress - revealStart) / (1 - revealStart);
            circleProgress = phaseProgress;
        }

        const radius = circleProgress * 100;
        revealLayerRef.current.style.clipPath = `circle(${radius}% at 50% 50%)`;

        if (radius < 1) {
            revealLayerRef.current.style.pointerEvents = 'none';
        } else {
            revealLayerRef.current.style.pointerEvents = 'auto';
        }

        return { progress, rect };
    }, [revealStart]);

    // --- 3. SMOOTH SCROLL LOOP ---
    const scrollToTarget = (targetY) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        let startTime = null;
        
        const ease = (t) => 1 - Math.pow(1 - t, 4);

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const time = timestamp - startTime;
            
            const percent = Math.min(time / duration, 1);

            const newY = startY + diff * ease(percent);
            window.scrollTo({ top: newY, behavior: 'auto' });

            updateScrollLogic();

            if (percent < 1) {
                window.requestAnimationFrame(step);
            } else {
                unlockUserScroll();
                window.scrollTo({ top: targetY, behavior: 'auto' });
                updateScrollLogic();
            }
        };

        window.requestAnimationFrame(step);
    };

    useEffect(() => {
        const handleScroll = () => {
            const state = updateScrollLogic();
            if (!state) return;
            
            const { progress, rect } = state;
            const direction = progress - prevProgressRef.current;

            // --- THE FIX: BYPASS HIJACK IF NAVBAR TRIGGERED SCROLL ---
            // If the flag is set, we still update visual progress above, 
            // but we skip the forced scrolling below.
            if (document.documentElement.dataset.navScrolling === 'true') {
                prevProgressRef.current = progress;
                return;
            }

            // AUTO-COMPLETE TRIGGER
            if (autoComplete && !isLockedRef.current && Math.abs(direction) > 0.0001) {
                
                if (progress > (revealStart + 0.001) && progress < 0.999) {
                    
                    if (direction > 0) {
                        lockUserScroll();
                        
                        const currentScrollY = window.scrollY;
                        const absoluteTopOfTrack = currentScrollY + rect.top;
                        const viewportHeight = window.innerHeight;
                        const targetScrollY = absoluteTopOfTrack + rect.height - viewportHeight;
                        
                        scrollToTarget(targetScrollY);
                    } 
                    else if (direction < 0) {
                        if (progress < collapseStart) {
                            lockUserScroll();
                            
                            const currentScrollY = window.scrollY;
                            const absoluteTopOfTrack = currentScrollY + rect.top;
                            const targetScrollY = absoluteTopOfTrack; 
                            
                            scrollToTarget(targetScrollY);
                        }
                    }
                }
            }
            
            prevProgressRef.current = progress;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            unlockUserScroll(); 
        };
    }, [updateScrollLogic, revealStart, collapseStart, autoComplete, duration]); 

    return (
        <div className={`scroll-reveal ${className}`} ref={trackRef}>
            <div className="scroll-reveal__sticky-container" ref={containerRef}>
                <div className="scroll-reveal__layer scroll-reveal__layer--base">
                    {children[0] || null}
                </div>
                <div 
                    className="scroll-reveal__layer scroll-reveal__layer--reveal" 
                    ref={revealLayerRef}
                >
                    {children[1] || null}
                </div>
            </div>
        </div>
    );
}