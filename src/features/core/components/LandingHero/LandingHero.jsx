import React from "react";
import "./LandingHero.css";

/**
 * LandingHero is the primary entry section of the application.
 * It uses an intricate Z-index stacking strategy to create a hardware-accelerated
 * "stencil" reveal effect driven by the --scroll-progress CSS variable.
 * Must be wrapped inside the ScrollReveal component to function correctly.
 */
export default function LandingHero() {
    return (
        <section 
            className="landing-hero"
            data-nav-text="dark"
        >
            {/* LAYER 1: Background Orange Dots */}
            <div className="landing-hero__dots-layer" aria-hidden="true" />

            {/* LAYER 2: Expanding Accent Circle */}
            <div className="landing-hero__accent-circle" aria-hidden="true"/>

            {/* LAYER 3: White Dots (Masked to exactly match the expanding circle) */}
            <div className="landing-hero__dots-layer landing-hero__dots-layer--white" aria-hidden="true" />

            {/* LAYER 4: The SVG Stencils */}
            
            {/* 4A: Desktop Stencil (1 Row: "SKYWEAR") */}
            <svg 
                className="landing-hero__stencil landing-hero__stencil--desktop" 
                viewBox="0 0 100 14" /* Shrink the canvas height */
                preserveAspectRatio="none" 
                aria-hidden="true"
            >
                <defs>
                    <mask id="text-cutout-desktop">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <text 
                            x="50%" 
                            y="65%" /* Nudge down slightly to perfectly center the oversized cap-height */
                            fontSize="20" /* Oversized! Forces the text to bleed outside the 14px canvas */
                            dominantBaseline="middle"
                            textAnchor="middle"
                            textLength="105%" 
                            lengthAdjust="spacingAndGlyphs"
                            fontWeight="900"
                            fill="black" 
                        >
                            SKYWEAR
                        </text>
                    </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" mask="url(#text-cutout-desktop)" />
            </svg>

            {/* 4B: Mobile Stencil (2 Rows: "SKY" / "WEAR") */}
            <svg 
                className="landing-hero__stencil landing-hero__stencil--mobile" 
                viewBox="0 0 100 28" /* Shrink the canvas height */
                preserveAspectRatio="none" 
                aria-hidden="true"
            >
                <defs>
                    <mask id="text-cutout-mobile">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <text 
                            x="50%" 
                            y="32%" 
                            fontSize="19" /* Oversized bleed */
                            dominantBaseline="middle"
                            textAnchor="middle"
                            textLength="105%" 
                            lengthAdjust="spacingAndGlyphs"
                            fontWeight="900"
                            fill="black" 
                        >
                            SKY
                        </text>
                        <text 
                            x="50%" 
                            y="82%" 
                            fontSize="19" /* Oversized bleed */
                            dominantBaseline="middle"
                            textAnchor="middle"
                            textLength="105%" 
                            lengthAdjust="spacingAndGlyphs"
                            fontWeight="900"
                            fill="black" 
                        >
                            WEAR
                        </text>
                    </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" mask="url(#text-cutout-mobile)" />
            </svg>

            {/* LAYER 5: Navbar Shield */}
            <div className="landing-hero__navbar-shield" aria-hidden="true" />

            {/* LAYER 6: Foreground Text Content */}
            <div className="landing-hero__content">
                <h1 className="landing-hero__line landing-hero__line--top">
                    <span>YOU PICK <br /> THE LOOK</span>
                </h1>
                
                <h1 className="landing-hero__line landing-hero__line--bottom">
                    <span>WE'LL HAVE IT <br /> WAITING</span>
                </h1>
            </div>
            
        </section>
    );
}