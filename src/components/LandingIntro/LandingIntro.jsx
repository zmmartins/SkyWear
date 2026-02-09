import React, { useEffect } from "react";
import "./LandingIntro.css";

export default function LandingIntro() {
    
    // Force Navbar to be transparent/black text when this component mounts
    useEffect(() => {
        document.documentElement.style.setProperty('--navbar-text-color', '#000000');
    }, []);

    return (
        <section className="landing-intro">
            
            {/* LAYER 1: The standard orange dots (background) */}
            <div className="landing-intro__dots-layer" aria-hidden="true" />

            {/* LAYER 4: The Stencil (White sheet with Text Cutout) */}
            <svg 
                className="landing-intro__stencil" 
                viewBox="0 0 100 13" 
                preserveAspectRatio="none" 
                aria-hidden="true"
            >
                <defs>
                    {/* A Mask that is White (Opaque) everywhere, except the Text (Black/Transparent) */}
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

                {/* The White Overlay applying the mask */}
                <rect 
                    x="0" 
                    y="0" 
                    width="100%" 
                    height="100%" 
                    fill="#ffffff" 
                    mask="url(#text-cutout)" 
                />
            </svg>

            {/* LAYER 3: The actual solid accent circle */}
            <div className="landing-intro__accent-circle" aria-hidden="true"/>

            {/* LAYER 2: The white dots (only visible inside the circle) */}
            <div className="landing-intro__dots-layer landing-intro__dots-layer--white" aria-hidden="true" />

            {/* LAYER 5: The Message */}
            <div className="landing-intro__content">
                <h1 className="landing-intro__line landing-intro__line--top">
                    YOU PICK <br /> THE LOOK
                </h1>
                
                <h1 className="landing-intro__line landing-intro__line--bottom">
                    WE'LL HAVE IT <br /> WAITING
                </h1>
            </div>
        </section>
    );
}