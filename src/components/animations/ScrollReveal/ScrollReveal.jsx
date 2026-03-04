import React from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import './ScrollReveal.css';

/**
 * ScrollReveal creates a cinematic transition between two components.
 * It locks the viewport in place and uses the scroll distance to expand 
 * the top layer over the bottom layer like an expanding circular portal.
 * * @requires Exactly two child elements: [BaseLayer, RevealLayer]
 */
export default function ScrollReveal({ 
    children, 
    className = "", 
    revealStart = 0,        
    collapseStart = 0.8,    
    autoComplete = false,
    duration = 700 
}) {
    // Pull the physics engine logic from the custom hook
    const { trackRef, containerRef, revealLayerRef } = useScrollReveal({
        revealStart,
        collapseStart,
        autoComplete,
        duration
    });

    return (
        <div className={`scroll-reveal ${className}`} ref={trackRef}>
            <div className="scroll-reveal__sticky-container" ref={containerRef}>
                
                {/* Layer 1: The background component (e.g., LandingHero) */}
                <div className="scroll-reveal__layer scroll-reveal__layer--base">
                    {children[0] || null}
                </div>
                
                {/* Layer 2: The overlay component (e.g., BundlesCarousel) */}
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