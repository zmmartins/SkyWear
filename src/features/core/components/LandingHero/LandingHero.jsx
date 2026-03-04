import React from "react";
import "./LandingHero.css";

/**
 * LandingHero is the primary entry section of the application.
 * It uses an intricate Z-index stacking strategy to create a hardware-accelerated
 * "stencil" reveal effect driven by the --scroll-progress CSS variable.
 * * Must be wrapped inside the ScrollReveal component to function correctly.
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

            {/* LAYER 4: The Stencil (Solid white sheet with "SKYWEAR" punched out) */}
            <svg 
                className="landing-hero__stencil" 
                viewBox="0 0 100 13" 
                preserveAspectRatio="none" 
                aria-hidden="true"
            >
                <defs>
                    <mask id="text-cutout">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <text 
                            x="50%" 
                            y="50%" 
                            dy="0.9"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            textLength="110%" 
                            lengthAdjust="spacingAndGlyphs"
                            fontWeight="900"
                            fill="black" 
                        >
                            SKYWEAR
                        </text>
                    </mask>
                </defs>

                {/* The solid white foreground that gets masked */}
                <rect 
                    x="0" 
                    y="0" 
                    width="100%" 
                    height="100%" 
                    fill="#ffffff" 
                    mask="url(#text-cutout)" 
                />
            </svg>

            {/* LAYER 5: Navbar Shield (Protects the blurred navbar from the animations) */}
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