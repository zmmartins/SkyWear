import React from 'react';
import { useBannerScroll } from '../../hooks/useBannerScroll';
import Promo1Img from '@/features/catalog/components/ItemsBanner/assets/Promo1.png';
import './ItemsBanner.css';

export default function ItemsBanner() {
    const { sectionRef, imageRef, arrowWrapperRef, arrowMaskRef } = useBannerScroll();

    return (
        <section 
            ref={sectionRef} 
            className="items-banner" 
            aria-label="Individual Items Collection"
            data-nav-text="dark"
        >
            {/* 1A. BASE TYPOGRAPHY (Always handles the orange animation!) */}
            <div className="items-banner__typography items-banner__typography--base" aria-hidden="true">
                <div className="title-row title-row--top">
                    <span className="text-black absolute-left">BUILD</span>
                    <span className="highlight center-word mono">YOUR</span> 
                </div>
                
                <div className="title-row title-row--bottom">
                    <span className="highlight center-word mono">OWN</span> 
                    <span className="text-black absolute-right">STYLE</span>
                </div>
            </div>

            {/* 1B. GHOST TYPOGRAPHY (Only holds the White Mask for BUILD and STYLE) */}
            <div className="items-banner__typography items-banner__typography--ghost" aria-hidden="true">
                <div className="title-row title-row--top">
                    <span className="text-white absolute-left">BUILD</span>
                    {/* Invisible, but keeps the flex layout perfectly stable */}
                    <span className="invisible-anchor center-word mono">YOUR</span> 
                </div>
                
                <div className="title-row title-row--bottom">
                    {/* Invisible, but keeps the flex layout perfectly stable */}
                    <span className="invisible-anchor center-word mono">OWN</span> 
                    <span className="text-white absolute-right">STYLE</span>
                </div>
            </div>
            
            {/* 2. INFO BLOCK LAYER */}
            <div className="items-banner__info">
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

            {/* 3. CENTRAL IMAGE LAYER */}
            <div ref={imageRef} className="items-banner__central-image">
                <img className="image-base" src={Promo1Img} alt="Traveler carrying a bag" loading="lazy" />
                <img className="image-blur-overlay" src={Promo1Img} alt="" aria-hidden="true" />
            </div>
            
            <span className="sr-only">Build your own style.</span>
        </section>
    );
}