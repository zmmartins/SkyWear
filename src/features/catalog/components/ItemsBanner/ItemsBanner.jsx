import React from 'react';
import { useBannerScroll } from '../../hooks/useBannerScroll';
import Promo1Img from '@/features/catalog/components/ItemsBanner/assets/Promo1.png';
import './ItemsBanner.css';

/**
 * COMPONENT: ItemsBanner
 * ------------------------------------------------------------------
 * Full-viewport transition section between bundles and individual items.
 * Uses hardware-accelerated parallax and custom CSS variable injection.
 */
export default function ItemsBanner() {
    // Import all refs and logic from our custom hook
    const {
        sectionRef, imageRef, titleTopRef, titleBottomRef,
        highlightTopRef, highlightBottomRef, arrowWrapperRef, arrowMaskRef
    } = useBannerScroll();

    return (
        <section 
            ref={sectionRef} 
            className="items-banner" 
            aria-label="Individual Items Collection"
            data-nav-text="dark"
        >
            <div className="items-banner__container">
                
                {/* ROW 1: TOP TITLE */}
                <h2 ref={titleTopRef} className="items-banner__title-top">
                    BUILD <span ref={highlightTopRef} className="highlight mono">YOUR</span>
                </h2>

                {/* ROW 2: INFO (Left) + BOTTOM TITLE (Right) */}
                <div className="items-banner__row-bottom">
                    
                    {/* The Info Block */}
                    <div className="items-banner__info">
                        
                        {/* ARROW STRUCTURE */}
                        <div ref={arrowWrapperRef} className="items-banner__arrow-wrapper" aria-hidden="true">
                            <div ref={arrowMaskRef} className="items-banner__arrow-mask">
                                <svg className="items-banner__arrow" viewBox="0 0 24 400" preserveAspectRatio="none">
                                    <path vectorEffect="non-scaling-stroke" d="M12 0 V400 M0 390 L12 400 L24 390" />
                                </svg>
                            </div>
                        </div>

                        <p className="items-banner__text mono">
                            Not looking for a pre-made bundle? Explore our collection of 
                            individual pieces. Mix, match, and reserve exactly what you 
                            need for your trip.
                        </p>
                    </div>
 
                    {/* The Offset Title */}
                    <h2 ref={titleBottomRef} className="items-banner__title-bottom">
                        <span ref={highlightBottomRef} className="highlight mono">OWN</span> STYLE
                    </h2>
                </div>

                {/* CENTRAL IMAGE FRAME */}
                <div ref={imageRef} className="items-banner__central-image">
                    <img className="image-base" src={Promo1Img} alt="Traveler carrying a bag" loading="lazy" />
                    {/* Parallax Depth-of-Field Blur Mask */}
                    <img className="image-blur-overlay" src={Promo1Img} alt="" aria-hidden="true" />
                </div>

            </div>
        </section>
    );
}