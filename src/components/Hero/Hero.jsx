import React, { useEffect, useRef } from "react";
import "./Hero.css";
import HeroSlide from "./HeroSlide";
import { SLIDES } from "./slides";
import useHeroCarousel from "./useHeroCarousel";
import useResponsiveOrbs from "./useResponsiveOrbs";
import { getPrefetchUrlsForSlide, prefetchImages } from "../../utils/prefetch";

export default function Hero(){
    const { orbSizes } = useResponsiveOrbs({
        min: 3,
        max: 10,
        artDiameter: 360,
        step: 0.3,
    });

    const carousel = useHeroCarousel({
        slidesLength : SLIDES.length,
        slides : SLIDES,
        autoplayMs : 6000,
        dotAnimMs : 500,
        swipeThresholdPx : 50,
    });

    const prefetchedRef = useRef(new Set());

    useEffect(() => {
        const n = SLIDES.length;
        if (n <= 1) return;

        const current = carousel.slideState.current;
        const nextIndex = (current + 1) % n;
        const prevIndex = (current - 1 + n) % n;

        const urls = Array.from(
            new Set([
                ...getPrefetchUrlsForSlide(SLIDES[nextIndex]),
                ...getPrefetchUrlsForSlide(SLIDES[prevIndex]),
            ])
        );

        if (urls.length === 0) return;

        let cancelled = false;
        let idleId = null;
        let timeoutId = null;

        const run = () => {
            if (cancelled) return;
            prefetchImages(urls, prefetchedRef.current);
        };

        if("requestIdleCallback" in window){
            idleId = window.requestIdleCallback(run, { timeout: 1200 });
        }
        else {
            timeoutId = window.setTimeout(run, 250);
        }

        return () => {
            cancelled = true;
            if (idleId !== null && "cancelIdleCallback" in window){
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== null){
                clearTimeout(timeoutId);
            }
        };
    }, [carousel.slideState.current]);

    return (
        <section 
            className = "hero-carousel" 
            data-theme={carousel.activeTheme}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured bundles"
            aria-live={carousel.isPaused ? "polite" : "off"}
            {...carousel.bind}
        >
            <div className="carousel">
                <div className="carousel__track">
                    {SLIDES.map((slide, index) => (
                        <HeroSlide
                            key={slide.id}
                            slide={slide}
                            className={carousel.getSlideClass(index)}
                            orbSizes={orbSizes}
                            isActive={index === carousel.slideState.current}
                        />
                    ))}
                </div>

                {/* CONTROLS */}
                <button 
                    onClick={() => {
                        carousel.setIsPaused(true);
                        carousel.prevSlide();
                    }} 
                    className="carousel__arrow carousel__arrow--prev" 
                    aria-label="Previous slide"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 19l-7-7 7-7" fill="none" />
                        <path d="M19 21 L5 12 L19 3 V21 Z" />
                    </svg>
                </button>

                <button 
                    onClick={() => {
                        carousel.setIsPaused(true);
                        carousel.nextSlide();
                    }} 
                    className="carousel__arrow carousel__arrow--next" 
                    aria-label="Next slide"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 3 L19 12 L5 21 V3 Z"/>
                    </svg>
                </button>

                <div className="carousel__dots">
                    {carousel.dots.map((d) => (
                        <button
                            key={d.id}
                            className="carousel__dot"
                            data-pos={d.pos}
                            onClick={() => {
                                carousel.setIsPaused(true);
                                carousel.dotNav(d.pos);
                            }}
                            aria-label={
                                d.pos === 1 ? `Current slide: ${SLIDES[carousel.slideState.current].title}` :
                                d.pos === 0 ? "Previous slide" : "Next slide"
                            }
                            aria-current={d.pos === 1 ? "true" : undefined}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}