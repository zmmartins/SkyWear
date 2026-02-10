import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";

// Components & Hooks
import HeroSlide from "./HeroSlide";
import useHeroCarousel from "./hooks/useHeroCarousel";
import useResponsiveOrbs from "./hooks/useResponsiveOrbs";
import { getHeroSlides } from "./data/getHeroSlides";
import { getPrefetchUrlsForSlide, prefetchImages } from "../../utils/prefetch";

/**
 * COMPONENT: Hero
 * ------------------------------------------------------------------
 * The main container for the homepage hero section.
 * Orchestrates data fetching, state management, animations, and prefetching.
 */
export default function Hero() {
    // 1. Local State (Data & UI Status)
    const [slides, setSlides] = useState([]);
    const [status, setStatus] = useState("loading"); // 'loading' | 'error' | 'ready'
    const [errorMsg, setErrorMsg] = useState("");

    // 2. Custom Hooks
    // Calculate background decoration based on viewport
    const { orbSizes } = useResponsiveOrbs({
        min: 3, max: 10, artDiameter: 360, step: 0.3
    });

    // Handle carousel logic (timers, swipe, state)
    const carousel = useHeroCarousel({
        slidesLength: slides.length,
        slides, // Passed for automatic theme extraction
        autoplayMs: 6000,
        swipeThreshold: 50,
    });

    // 3. Data Fetching Effect
    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                if (slides.length === 0) setStatus("loading");
                
                const data = await getHeroSlides();
                
                if (isMounted) {
                    setSlides(Array.isArray(data) ? data : []);
                    setStatus("ready");
                }
            } catch (e) {
                if (isMounted) {
                    console.error("Hero Data Error:", e);
                    setErrorMsg("Unable to load latest collections.");
                    setStatus("error");
                }
            }
        })();

        return () => { isMounted = false; };
    }, []); 

    // 4. Smart Image Prefetching
    const prefetchedSet = useRef(new Set());

    useEffect(() => {
        if (status !== "ready" || slides.length <= 1) return;

        const { current } = carousel.slideState;
        const total = slides.length;

        // Calculate indices of neighbors (Circular)
        const nextIdx = (current + 1) % total;
        const prevIdx = (current - 1 + total) % total;

        // Gather URLs for priority images in neighbor slides
        const nextUrls = getPrefetchUrlsForSlide(slides[nextIdx]);
        const prevUrls = getPrefetchUrlsForSlide(slides[prevIdx]);
        
        // Filter out what we already have
        const newUrls = [...nextUrls, ...prevUrls].filter(
            url => url && !prefetchedSet.current.has(url)
        );

        if (newUrls.length === 0) return;

        // Use requestIdleCallback to avoid blocking the main thread
        const task = () => prefetchImages(newUrls, prefetchedSet.current);
        
        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(task, { timeout: 2000 });
            return () => window.cancelIdleCallback(idleId);
        } else {
            const timeoutId = setTimeout(task, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [carousel.slideState.current, slides, status]);

    // ------------------------------------------------------------------
    // RENDER HELPERS
    // ------------------------------------------------------------------
    
    // A. Loading State
    if (status === "loading") {
        return (
            <section 
                className="hero-carousel" 
                data-theme="winter" 
                aria-busy="true"
                aria-label="Loading content"
            />
        );
    }

    // B. Error State
    if (status === "error") {
        return (
            <section className="hero-carousel" data-theme="winter">
                <div className="carousel__layout">
                    <div className="carousel__info" style={{ zIndex: 10 }}>
                        <h2 className="carousel__title" style={{ fontSize: "2rem" }}>
                            Unavailable
                        </h2>
                        <p className="text-muted" style={{ marginTop: "1rem" }}>
                            {errorMsg}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // C. Main Content
    const { current } = carousel.slideState;
    const activeSlide = slides[current];

    // Helper titles for accessibility labels
    const prevTitle = slides[(current - 1 + slides.length) % slides.length]?.title || "Previous";
    const nextTitle = slides[(current + 1) % slides.length]?.title || "Next";

    return (
        <section 
            className="hero-carousel" 
            data-theme={carousel.activeTheme}
            data-nav-text="light"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured Clothing Collections"
            aria-live={carousel.isPaused ? "polite" : "off"}
            {...carousel.bind} // <--- INTEGRATION: This handles pausing on hover/touch automatically
        >
            <div className="carousel">
                {/* 1. SLIDES TRACK */}
                <div className="carousel__track">
                    {slides.map((slide, index) => (
                        <HeroSlide
                            key={slide.id || index}
                            slide={slide}
                            // INTEGRATION: Uses the hook's class generator
                            className={carousel.getSlideClass(index)}
                            orbSizes={orbSizes}
                            isActive={index === current}
                        />
                    ))}
                </div>

                {/* 2. CONTROLS: ARROWS */}
                <NavArrow 
                    direction="prev" 
                    label="Previous Slide"
                    // INTEGRATION: Just call the method, no need to manually pause
                    onClick={carousel.prevSlide}
                />
                <NavArrow 
                    direction="next" 
                    label="Next Slide"
                    onClick={carousel.nextSlide}
                />

                {/* 3. CONTROLS: DOTS */}
                {carousel.dots.length > 0 && (
                    <div className="carousel__dots">
                        {carousel.dots.map((d) => {
                            let ariaLabel = `Go to slide ${d.slideIndex + 1}`;
                            if (d.pos === 1) ariaLabel = `Current slide: ${activeSlide?.title}`;
                            else if (d.pos === 0) ariaLabel = `Go to previous: ${prevTitle}`;
                            else if (d.pos === 2) ariaLabel = `Go to next: ${nextTitle}`;

                            return (
                                <button
                                    key={d.id}
                                    type="button"
                                    className="carousel__dot"
                                    data-pos={d.pos}
                                    // INTEGRATION: Uses handleDotClick matching the hook export
                                    onClick={() => carousel.handleDotClick(d.pos)}
                                    aria-label={ariaLabel}
                                    aria-current={d.pos === 1 ? "true" : undefined}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

// ------------------------------------------------------------------
// SUB-COMPONENT: NavArrow
// ------------------------------------------------------------------
function NavArrow({ direction, onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`carousel__arrow carousel__arrow--${direction}`}
            aria-label={label}
        >
            <svg
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}