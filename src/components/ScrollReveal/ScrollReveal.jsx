import React, { useRef, useEffect } from 'react';
import './ScrollReveal.css';
import { clamp } from '../../utils/clamp';

const lerp = (start, end, factor) => start + (end - start) * factor;

export default function ScrollReveal({ children }) {
    const trackRef  = useRef(null);
    const glass1Ref = useRef(null);
    const glass2Ref = useRef(null);
    const revealRef = useRef(null);

    const state = useRef({
        targetProgress: 0,
        currentProgress: 0,
        lastRendered: -1, 
        totalDistance: 0  
    });

    const [HeroNode, ItemsNode] = React.Children.toArray(children);

    useEffect(() => {
        let rAFId;

        const updateMetrics = () => {
            state.current.totalDistance = window.innerHeight * 1.2;
        };

        const onScroll = () => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const scrolled = -rect.top;
            state.current.targetProgress = clamp(scrolled / state.current.totalDistance, 0, 1);
        };

        const loop = () => {
            const { currentProgress, targetProgress, lastRendered } = state.current;

            const diff = targetProgress - currentProgress;
            
            if (Math.abs(diff) < 0.0001) {
                state.current.currentProgress = targetProgress;
            } else {
                state.current.currentProgress = lerp(currentProgress, targetProgress, 0.06);
            }

            if (Math.abs(state.current.currentProgress - lastRendered) > 0.0001) {
                const progress = state.current.currentProgress;
                
                // PHASE 1: Weak Orb
                if (glass1Ref.current) {
                    const p1 = clamp(progress / 0.4, 0, 1);
                    const finalScale = p1 < 0.001 ? 0 : p1;
                    glass1Ref.current.style.transform = `translateZ(0) scale(${finalScale})`;
                }

                // PHASE 2: Strong Orb
                if (glass2Ref.current) {
                    const p2 = clamp((progress - 0.2) / 0.5, 0, 1);
                    const finalScale = p2 < 0.001 ? 0 : p2;
                    glass2Ref.current.style.transform = `translateZ(0) scale(${finalScale})`;
                }

                // PHASE 3: White Reveal & Navbar Color
                // We sync the color change exactly with the white circle expansion
                if (revealRef.current) {
                    const p3 = clamp((progress - 0.5) / 0.5, 0, 1);
                    
                    revealRef.current.style.transform = `translateZ(0)`; 
                    revealRef.current.style.clipPath = `circle(${p3 * 150}% at 50% 50%)`;

                    // --- NEW: NAVBAR COLOR INTERPOLATION ---
                    // Start: White (rgb(249, 250, 251)) -> End: Black (rgb(17, 24, 39))
                    const r = Math.round(lerp(249, 17, p3));
                    const g = Math.round(lerp(250, 24, p3));
                    const b = Math.round(lerp(251, 39, p3));
                    
                    // We update the CSS variable on the document root
                    document.documentElement.style.setProperty('--navbar-text-color', `rgb(${r}, ${g}, ${b})`);
                }

                state.current.lastRendered = progress;
            }

            rAFId = requestAnimationFrame(loop);
        };

        updateMetrics();
        window.addEventListener('resize', updateMetrics);
        window.addEventListener('scroll', onScroll, { passive: true });
        loop();

        return () => {
            window.removeEventListener('resize', updateMetrics);
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rAFId);
            // Cleanup: Reset navbar color when component unmounts
            document.documentElement.style.removeProperty('--navbar-text-color');
        };
    }, []);

    return (
        <div className="scroll-reveal" ref={trackRef}>
            <div className="scroll-reveal__snap-point scroll-reveal__snap-point--start" />
            <div className="scroll-reveal__snap-point scroll-reveal__snap-point--end" />

            <div className="scroll-reveal__sticky">
                <div className="scroll-reveal__layer scroll-reveal__layer--back">
                    {HeroNode}
                </div>

                <div className="scroll-reveal__layer scroll-reveal__layer--glass">
                    <div className="glass-orb glass-orb--weak" ref={glass1Ref} />
                    <div className="glass-orb glass-orb--strong" ref={glass2Ref} />
                </div>

                <div className="scroll-reveal__layer scroll-reveal__layer--front" ref={revealRef}>
                    {ItemsNode}
                </div>
            </div>
        </div>
    );
}