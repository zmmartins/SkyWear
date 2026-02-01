import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";
import HeroSlide from "./HeroSlide";
import useHeroCarousel   from "./hooks/useHeroCarousel";
import useResponsiveOrbs from "./hooks/useResponsiveOrbs";
import { getPrefetchUrlsForSlide, prefetchImages } from "../../utils/prefetch";
import { getHeroSlides } from "./data/getHeroSlides";

export default function Hero(){
    const { orbSizes } = useResponsiveOrbs({
        min: 3,
        max: 10,
        artDiameter: 360,
        step: 0.3,
    });

    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const carousel = useHeroCarousel({
        slidesLength : slides.length,
        slides,
        autoplayMs : 6000,
        dotAnimMs : 500,
        swipeThresholdPx : 50,
    });

    useEffect(() => {
        let alive = true;

        (async () => {
            try{
                setLoading(true);
                setErrorMsg("");

                const data = await getHeroSlides();
                if (!alive) return;

                setSlides(Array.isArray(data) ? data : []);
            }
            catch(e){
                if(!alive) return;
                setSlides([]);
                setErrorMsg(e instanceof Error ? e.message : "Failed to load hero slides");
            }
            finally{
                if(!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;

        const current = carousel.slideState.current;
        if (current >= slides.length){
            carousel.changeSlide(0, "next");
        }
    }, [slides.length]);

    const prefetchedRef = useRef(new Set());

    useEffect(() => {
        const n = slides.length;
        if (n <= 1) return;

        const current = carousel.slideState.current;
        if (current < 0 || current >= n) return;

        const nextIndex = (current + 1) % n;
        const prevIndex = (current - 1 + n) % n;

        const urls = Array.from(
            new Set([
                ...getPrefetchUrlsForSlide(slides[nextIndex]),
                ...getPrefetchUrlsForSlide(slides[prevIndex]),
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
    }, [carousel.slideState.current, slides]);

    if(loading){
        return (
            <section
                className="hero-carousel"
                data-theme="winter"
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured bundles"
                aria-live="off"
            ></section>        
        );
    }

    if (errorMsg){
        return (
            <section
                className="hero-carousel"
                data-theme="winter"
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured bundles"
                aria-live="polite"
            >
                <div style={{ padding:"6rem 2rem", position: "relative", zIndex: 5}}>
                    <p style={{ fontWeight: 600 }}> Could not load featured bundles.</p>
                    <p className="text-muted" style={{ marginTop: "0.5rem" }}>
                        {errorMsg}
                    </p>
                </div>
            </section>
        );
    }

    if (slides.length === 0){
        return (
            <section
                className="hero-carousel"
                data-theme="winter"
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured bundles"
                aria-live="off"
            />
        );
    }

    const currentIndex = carousel.slideState.current;
    const currentTitle = slides[carousel.slideState.current]?.title ?? "Slide";
    
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    const nextIndex = (currentIndex + 1) % slides.length;
    const prevTitle = slides[prevIndex]?.title ?? "Previous slide";
    const nextTitle = slides[nextIndex]?.title ?? "Next slide";

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
                    {slides.map((slide, index) => (
                        <HeroSlide
                            key={slide?.id ?? `${slide?.theme ?? "slide"}-${index}`}
                            slide={slide}
                            className={carousel.getSlideClass(index)}
                            orbSizes={orbSizes}
                            isActive={index === currentIndex}
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
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M9 5l7 7-7 7" />
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
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M9 5l7 7-7 7" />
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
                                d.pos === 1 
                                    ? `Current slide: ${currentTitle}` 
                                    : d.pos === 0 
                                    ? `Previous slide: ${prevTitle}` 
                                    : `Next slide: ${nextTitle}`
                            }
                            aria-current={d.pos === 1 ? "true" : undefined}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}