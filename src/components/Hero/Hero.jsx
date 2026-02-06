import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";
import HeroSlide from "./HeroSlide";
import useHeroCarousel   from "./hooks/useHeroCarousel";
import useResponsiveOrbs from "./hooks/useResponsiveOrbs";
import { getPrefetchUrlsForSlide, prefetchImages } from "../../utils/prefetch";
import { getHeroSlides } from "./data/getHeroSlides";

export default function Hero(){
    // State Management
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // Responsive Orbs Calculation
    const { orbSizes } = useResponsiveOrbs({
        min: 3,
        max: 10,
        artDiameter: 360,
        step: 0.3,
    });
    
    // Carousel Logic Hook
    const carousel = useHeroCarousel({
        slidesLength : slides.length,
        slides, // Passed for automatic theme extraction
        autoplayMs : 6000,
        dotAnimMs : 500,
        swipeThresholdPx : 50,
    });

    // Data Fetching
    useEffect(() => {
        let alive = true;

        (async () => {
            try{
                setLoading(true);
                setErrorMsg("");

                const data = await getHeroSlides();
                if (alive) setSlides(Array.isArray(data) ? data : []);
            }
            catch(e){
                if(alive) {
                    console.error("Hero Load Error:", e);
                    setErrorMsg(e instanceof Error ? e.message : "Failed to load bundles");
                    setSlides([]);
                }
            }
            finally{
                if(alive) setLoading(false);
            }
        })();

        return () => { alive = false; };
    }, []);

    // Smart Image Prefetching (Idle Callback)
    const prefetchedRef = useRef(new Set());

    useEffect(() => {
        if (slides.length <= 1) return;

        const current = carousel.slideState.current;
        const n = slides.length;
        const nextIndex = (current + 1) % n;
        const prevIndex = (current - 1 + n) % n;

        // Collect unique, un-fetched URLs for adjacent slides
        const urls = [
            ...getPrefetchUrlsForSlide(slides[nextIndex]),
            ...getPrefetchUrlsForSlide(slides[prevIndex]),
        ].filter(url => url && !prefetchedRef.current.has(url));

        if (urls.length === 0) return;

        let idleId = null;
        let timeoutId = null;

        const run = () => prefetchImages(urls, prefetchedRef.current);

        // Prefer requestIdleCallback to avoid jank during slide transitions
        if("requestIdleCallback" in window){
            idleId = window.requestIdleCallback(run, { timeout: 1200 });
        }
        else {
            timeoutId = window.setTimeout(run, 250);
        }

        return () => {
            if (idleId) window.cancelIdleCallback(idleId);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [carousel.slideState.current, slides]);

    // --- RENDRE PHASES --- //

    // Phase 1: Loading / Empty State
    if(loading || (slides.length === 0 && !errorMsg)){
        return (
            <section
                className = "hero-carousel"
                data-theme= "winter"
                aria-busy = "true"
            />
        );      
    }

    // Phase 2: Error State
    if (errorMsg){
        return (
            <section className="hero-carousel" data-theme="winter">
                <div className="carousel__layout">
                    <div className="carousel__info" style={{ position: "relative", zIndex: 10 }}>
                        <h2 className="carousel__title" style={{ fontSize: "2rem" }}>Unavailable</h2>
                        <p style={{ marginTop: "1rem", opacity: 0.8 }}>{errorMsg}</p>
                    </div>
                </div>
            </section>
        );
    }

    // Phase 3: Main Carousel Render
    const { current } = carousel.slideState;
    const activeSlide = slides[current];
    const prevTitle = slides[(current - 1 + slides.length) % slides.length]?.title ?? "Previous"; 
    const nextTitle = slides[(current + 1) % slides.length]?.title ?? "Next";

    return (
        <section 
            className = "hero-carousel" 
            data-theme={carousel.activeTheme}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured Clothing Bundles"
            aria-live={carousel.isPaused ? "polite" : "off"}
            {...carousel.bind} // Hook up Swipe/Hover events
        >
            <div className="carousel">
                {/* SLIDES TRACK */}
                <div className="carousel__track">
                    {slides.map((slide, index) => (
                        <HeroSlide
                            key={slide.id || index}
                            slide={slide}
                            className={carousel.getSlideClass(index)}
                            orbSizes={orbSizes}
                            isActive={index === current}
                        />
                    ))}
                </div>

                {/* CONTROLS: ARROWS */}
                <NavArrow
                    direction="prev"
                    onClick={() => { carousel.setIsPaused(true); carousel.prevSlide(); }}
                />
                <NavArrow
                    direction="next"
                    onClick={() => { carousel.setIsPaused(true); carousel.nextSlide(); }}
                />   

                {/* CONTROLS: DOTS */}
                <div className="carousel__dots">
                    {carousel.dots.map((d) => {
                        let label = "";
                        if (d.pos === 1) label = `Current: ${activeSlide?.title}`;
                        else if (d.pos === 0) label = `Go to previous: ${prevTitle}`;
                        else label = `Go to next: ${nextTitle}`;

                        return (
                            <button
                                key={d.id}
                                type="button"
                                className="carousel__dot"
                                data-pos={d.pos}
                                onClick={() => {
                                    carousel.setIsPaused(true);
                                    carousel.dotNav(d.pos);
                                }}
                                aria-label={label}
                                aria-current={d.pos === 1 ? "true" : undefined}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function NavArrow({ direction, onClick }){
    const isNext = direction === "next";
    return (
        <button
            type="button"
            onClick={onClick}
            className={`carousel__arrow carousel__arrow--${direction}`}
            aria-label={`${isNext ? "Next" : "Previous"} slide`}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d = "M9 5l7 7-7 7"/>
            </svg>
        </button>   
    );
}