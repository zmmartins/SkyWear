import React, { useRef, useEffect, useLayoutEffect } from 'react';
import './ScrollReveal.css';
import { clamp } from '../../utils/clamp';

// --- HELPERS ---

// Linear Interpolation for smooth dampening
const lerp = (start, end, factor) => start + (end - start) * factor;

/**
 * Interpolates between two RGB colors based on progress (0 to 1).
 * Used for the Navbar text color transition.
 */
const interpolateColor = (progress) => {
    // Start: White (249, 250, 251) -> End: Dark (17, 24, 39)
    const r = Math.round(lerp(249, 17, progress));
    const g = Math.round(lerp(250, 24, progress));
    const b = Math.round(lerp(251, 39, progress));
    return `rgb(${r}, ${g}, ${b})`;
};

/**
 * COMPONENT: ScrollReveal
 * ------------------------------------------------------------------
 * A sticky container that orchestrates the "Liquid Orb" reveal animation.
 * It maps scroll progress to 3 distinct animation phases.
 */
export default function ScrollReveal({ children }) {
    // 1. REFS (Direct DOM access for high-performance animation)
    const trackRef  = useRef(null);
    const glass1Ref = useRef(null); // Weak Orb
    const glass2Ref = useRef(null); // Strong Orb
    const revealRef = useRef(null); // White Foreground Layer

    // 2. MUTABLE STATE (Avoids React renders during scroll loop)
    const state = useRef({
        target: 0,   // Where we want to be (based on scroll position)
        current: 0,  // Where we currently are (lerped value)
        range: 0,    // Total scrollable distance in pixels
        isActive: false // Optimization: Only loop when necessary
    });

    // 3. CHILDREN SEPARATION
    // We expect exactly two children: [Hero, Content]
    const [HeroNode, ItemsNode] = React.Children.toArray(children);

    // 4. MEASUREMENT EFFECT (Resize Observer)
    useLayoutEffect(() => {
        if (!trackRef.current) return;

        const measure = () => {
            // Calculate how far we can scroll within this component.
            // Formula: Container Height - Sticky Viewport Height
            const rect = trackRef.current.getBoundingClientRect();
            state.current.range = rect.height - window.innerHeight;
        };

        // Modern ResizeObserver is more performant than window 'resize'
        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(trackRef.current);
        
        measure(); // Initial measurement

        return () => resizeObserver.disconnect();
    }, []);

    // 5. ANIMATION LOOP
    useEffect(() => {
        let rAFId;
        
        // A. The Scroll Listener (Inputs)
        const onScroll = () => {
            if (!trackRef.current) return;
            
            // Get relative scroll position of the tracker
            const rect = trackRef.current.getBoundingClientRect();
            
            // Calculate progress: 0 (start) to 1 (end)
            // We use -rect.top because the element moves up as we scroll down
            const rawProgress = -rect.top / state.current.range;
            
            state.current.target = clamp(rawProgress, 0, 1);
            
            // Wake up the loop if it was sleeping
            if (!state.current.isActive) {
                state.current.isActive = true;
                loop();
            }
        };

        // B. The Animation Loop (Outputs)
        const loop = () => {
            const { current, target } = state.current;
            
            // 1. Calculate difference
            const diff = target - current;
            
            // 2. Sleep Check: If we are close enough, snap and stop loop to save battery
            if (Math.abs(diff) < 0.0001) {
                state.current.current = target;
                state.current.isActive = false; // Stop looping
                render(target); // Render final frame
                return; 
            }

            // 3. Lerp (Smooth movement)
            const nextProgress = lerp(current, target, 0.08); // 0.08 = smoothing factor
            state.current.current = nextProgress;
            
            // 4. Render Updates
            render(nextProgress);
            
            // 5. Next Frame
            rAFId = requestAnimationFrame(loop);
        };

        // C. The Renderer (DOM Manipulation)
        const render = (progress) => {
            // PHASE 1: Weak Orb (0.0 -> 0.4)
            if (glass1Ref.current) {
                const p = clamp(progress / 0.4, 0, 1);
                // Optimization: Hide via scale(0) if not needed to prevent paint overlap
                const scale = p < 0.01 ? 0 : p; 
                glass1Ref.current.style.transform = `translate3d(0,0,0) scale(${scale})`;
            }

            // PHASE 2: Strong Orb (0.2 -> 0.7)
            if (glass2Ref.current) {
                const p = clamp((progress - 0.2) / 0.5, 0, 1);
                const scale = p < 0.01 ? 0 : p;
                glass2Ref.current.style.transform = `translate3d(0,0,0) scale(${scale})`;
            }

            // PHASE 3: Content Reveal & Navbar Color (0.5 -> 1.0)
            if (revealRef.current) {
                // Normalize 0.5-1.0 range to 0.0-1.0
                const p = clamp((progress - 0.5) / 0.5, 0, 1);
                
                // Clip Path Animation
                // 150% ensures the circle fully covers the screen corners
                revealRef.current.style.clipPath = `circle(${p * 150}% at 50% 50%)`;
                
                // Navbar Color Update
                // Only update if we are in the transition phase to avoid unnecessary style recalcs
                if (progress > 0.45 && progress < 1.0) {
                    const color = interpolateColor(p);
                    document.documentElement.style.setProperty('--navbar-text-color', color);
                } else if (progress <= 0.45) {
                    // Force white at start
                    document.documentElement.style.setProperty('--navbar-text-color', 'rgb(249, 250, 251)');
                }
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Initial Trigger
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rAFId);
            // Reset navbar color on unmount
            document.documentElement.style.removeProperty('--navbar-text-color');
        };
    }, []);

    return (
        <div className="scroll-reveal" ref={trackRef}>
            {/* Snap points allow CSS Scroll Snapping to catch the start/end */}
            <div className="scroll-reveal__snap-point scroll-reveal__snap-point--start" />
            <div className="scroll-reveal__snap-point scroll-reveal__snap-point--end" />

            <div className="scroll-reveal__sticky">
                {/* 1. Background Layer (Hero) */}
                <div className="scroll-reveal__layer scroll-reveal__layer--back">
                    {HeroNode}
                </div>

                {/* 2. Animation Layer (Glass Orbs) */}
                <div className="scroll-reveal__layer scroll-reveal__layer--glass">
                    <div className="glass-orb glass-orb--weak" ref={glass1Ref} />
                    <div className="glass-orb glass-orb--strong" ref={glass2Ref} />
                </div>

                {/* 3. Foreground Layer (Next Section) */}
                <div className="scroll-reveal__layer scroll-reveal__layer--front" ref={revealRef}>
                    {ItemsNode}
                </div>
            </div>
        </div>
    );
}