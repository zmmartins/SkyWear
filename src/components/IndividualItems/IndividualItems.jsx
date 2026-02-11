import React, { useEffect, useRef } from 'react';
import './IndividualItems.css';

export default function IndividualItems() {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const titleTopRef = useRef(null);
    const titleBottomRef = useRef(null);
    const highlightTopRef = useRef(null);
    const highlightBottomRef = useRef(null);
    const arrowWrapperRef = useRef(null);
    const arrowMaskRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current || !imageRef.current) return;
            
            // Check if mobile
            if (window.innerWidth <= 768) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate effects only when section is entering viewport
            if (rect.top >= 0 && rect.top <= viewportHeight) {
                
                // 1. IMAGE PARALLAX
                // We use translate3d for hardware acceleration
                const translateY = rect.top * -0.25;
                imageRef.current.style.transform = `translate3d(-50%, ${translateY}px, 0)`;

                // 2. TEXT SLIDE-IN
                // UPDATED: We now set CSS VARIABLES instead of overwriting the transform.
                // This keeps the CSS 'transform' property (with its calc() and vw/vh units) intact.
                const textScrollFactor = 0.4; 
                
                const offsetTop = rect.top * -textScrollFactor;
                if (titleTopRef.current) 
                    titleTopRef.current.style.setProperty('--scroll-offset-top', `${offsetTop}px`);
                
                const offsetBottom = rect.top * textScrollFactor;
                if (titleBottomRef.current)
                    titleBottomRef.current.style.setProperty('--scroll-offset-bottom', `${offsetBottom}px`);

                // 3. COLOR TRANSITION
                const rawRatio = Math.max(0, Math.min(1, rect.top / viewportHeight));
                const progress = 1 - rawRatio; 
                const snapThreshold = 1;
                let colorString;

                if (progress >= snapThreshold) {
                    colorString = `rgb(249, 115, 22)`;
                } else {
                    const whiteIntensity = (progress / snapThreshold) * 255;
                    const val = Math.floor(whiteIntensity);
                    colorString = `rgb(${val}, ${val}, ${val})`;
                }
                
                if (highlightTopRef.current) highlightTopRef.current.style.color = colorString;
                if (highlightBottomRef.current) highlightBottomRef.current.style.color = colorString;

                // 4. ARROW EXPANSION
                if (arrowWrapperRef.current && arrowMaskRef.current) {
                    const arrowRect = arrowWrapperRef.current.getBoundingClientRect();
                    
                    // DYNAMIC: Read the height from CSS so we don't have conflicts
                    const arrowMaxHeight = arrowWrapperRef.current.offsetHeight || 400; 
                    const bottomMargin = 10;    
                    
                    const visibleHeight = (viewportHeight - bottomMargin) - arrowRect.top;
                    const clampHeight = Math.min(Math.max(visibleHeight, 0), arrowMaxHeight);
                    
                    arrowMaskRef.current.style.height = `${clampHeight}px`;
                }

            } else if (rect.top < 0) {
                // LOCK state
                imageRef.current.style.transform = `translate3d(-50%, 0px, 0)`;
                
                // Reset CSS Variables to 0 (locks text to original CSS positions)
                if (titleTopRef.current) titleTopRef.current.style.setProperty('--scroll-offset-top', '0px');
                if (titleBottomRef.current) titleBottomRef.current.style.setProperty('--scroll-offset-bottom', '0px');
                
                const finalColor = `rgb(249, 115, 22)`;
                if (highlightTopRef.current) highlightTopRef.current.style.color = finalColor;
                if (highlightBottomRef.current) highlightBottomRef.current.style.color = finalColor;

                // Lock Arrow to Full Height (reading from CSS dynamic height)
                if (arrowMaskRef.current && arrowWrapperRef.current) {
                     arrowMaskRef.current.style.height = `${arrowWrapperRef.current.offsetHeight}px`;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); 

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section 
            ref={sectionRef} 
            className="individual-items" 
            aria-label="Individual Items Collection"
            data-nav-text="dark"
        >
            <div className="individual-items__container">
                
                {/* ROW 1: TOP TITLE */}
                <h2 
                    ref={titleTopRef} 
                    className="individual-items__title-top"
                >
                    BUILD <span ref={highlightTopRef} className="highlight mono">YOUR</span>
                </h2>

                {/* ROW 2: INFO (Left) + BOTTOM TITLE (Right) */}
                <div className="individual-items__row-bottom">
                    
                    {/* The Info Block */}
                    <div className="individual-items__info">
                        
                        {/* ARROW STRUCTURE */}
                        <div 
                            ref={arrowWrapperRef} 
                            className="individual-items__arrow-wrapper" 
                            aria-hidden="true"
                        >
                            {/* Inner Mask */}
                            <div ref={arrowMaskRef} className="individual-items__arrow-mask">
                                <svg 
                                    className="individual-items__arrow" 
                                    viewBox="0 0 24 400" 
                                    preserveAspectRatio="none"
                                >
                                    <path 
                                        vectorEffect="non-scaling-stroke" 
                                        d="M12 0 V400 M0 390 L12 400 L24 390" 
                                    />
                                </svg>
                            </div>
                        </div>

                        <p className="individual-items__text mono">
                            Not looking for a pre-made bundle? Explore our collection of 
                            individual pieces. Mix, match, and reserve exactly what you 
                            need for your trip.
                        </p>
                    </div>
 
                    {/* The Offset Title */}
                    <h2 
                        ref={titleBottomRef}
                        className="individual-items__title-bottom"
                    >
                        <span ref={highlightBottomRef} className="highlight mono">OWN</span> STYLE
                    </h2>
                </div>

                {/* CENTRAL IMAGE FRAME */}
                <div 
                    ref={imageRef} 
                    className="individual-items__central-image"
                >
                    <img 
                        className="image-base"
                        src="/assets/img/Promo1.png" 
                        alt="Traveler carrying a bag" 
                        loading="lazy"
                    />
                    <img 
                        className="image-blur-overlay"
                        src="/assets/img/Promo1.png" 
                        alt="" 
                        aria-hidden="true"
                    />
                </div>

            </div>
        </section>
    );
}