import React, { useEffect, useRef, useState } from "react";
import "./BundlesCarousel.css";

// Local Feature Components & Hooks
import BundleSlide from "./BundleSlide";
import useBundlesCarousel from "../../hooks/useBundlesCarousel";
import useResponsiveOrbs from "../../hooks/useResponsiveOrbs";
import { getBundleSlides } from "../../services/bundlesApi"; 

// Global Utilities (Using Alias)
import { getPrefetchUrlsForSlide, prefetchImages } from "@/utils/prefetch";

export default function BundlesCarousel() {
    const [slides, setSlides] = useState([]);
    const [status, setStatus] = useState("loading"); 
    const [errorMsg, setErrorMsg] = useState("");

    const { orbSizes } = useResponsiveOrbs({
        min: 3, max: 10, artDiameter: 360, step: 0.3
    });

    const carousel = useBundlesCarousel({
        slidesLength: slides.length,
        slides, 
        autoplayMs: 6000,
        swipeThreshold: 50,
    });

    // Data Fetching
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                if (slides.length === 0) setStatus("loading");
                const data = await getBundleSlides();
                
                if (isMounted) {
                    setSlides(Array.isArray(data) ? data : []);
                    setStatus("ready");
                }
            } catch (e) {
                if (isMounted) {
                    console.error("Bundles Data Error:", e);
                    setErrorMsg("Unable to load latest collections.");
                    setStatus("error");
                }
            }
        })();
        return () => { isMounted = false; };
    }, []); // Only runs once on mount

    // Image Prefetching Logic
    const prefetchedSet = useRef(new Set());
    useEffect(() => {
        if (status !== "ready" || slides.length <= 1) return;

        const { current } = carousel.slideState;
        const total = slides.length;
        const nextIdx = (current + 1) % total;
        const prevIdx = (current - 1 + total) % total;

        const nextUrls = getPrefetchUrlsForSlide(slides[nextIdx]);
        const prevUrls = getPrefetchUrlsForSlide(slides[prevIdx]);
        
        const newUrls = [...nextUrls, ...prevUrls].filter(
            url => url && !prefetchedSet.current.has(url)
        );

        if (newUrls.length === 0) return;

        const task = () => prefetchImages(newUrls, prefetchedSet.current);
        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(task, { timeout: 2000 });
            return () => window.cancelIdleCallback(idleId);
        } else {
            const timeoutId = setTimeout(task, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [carousel.slideState.current, slides, status]);

    if (status === "loading") {
        return <section className="bundles-carousel" data-theme="winter" aria-busy="true" />;
    }

    if (status === "error") {
        return (
            <section className="bundles-carousel" data-theme="winter">
                <div className="carousel__layout">
                    <div className="carousel__info" style={{ zIndex: 10 }}>
                        <h2 className="carousel__title" style={{ fontSize: "2rem" }}>Unavailable</h2>
                        <p className="text-muted" style={{ marginTop: "1rem" }}>{errorMsg}</p>
                    </div>
                </div>
            </section>
        );
    }

    const { current } = carousel.slideState;
    const activeSlide = slides[current];
    const prevTitle = slides[(current - 1 + slides.length) % slides.length]?.title || "Previous";
    const nextTitle = slides[(current + 1) % slides.length]?.title || "Next";

    return (
        <section 
            className="bundles-carousel" 
            data-theme={carousel.activeTheme}
            data-nav-text="light"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured Clothing Collections"
            aria-live={carousel.isPaused ? "polite" : "off"}
            {...carousel.bind}
        >
            <div className="carousel">
                <div className="carousel__track">
                    {slides.map((slide, index) => (
                        <BundleSlide
                            key={slide.id || index}
                            slide={slide}
                            className={carousel.getSlideClass(index)}
                            orbSizes={orbSizes}
                            isActive={index === current}
                        />
                    ))}
                </div>

                <NavArrow direction="prev" label="Previous Slide" onClick={carousel.prevSlide} />
                <NavArrow direction="next" label="Next Slide" onClick={carousel.nextSlide} />

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

function NavArrow({ direction, onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`carousel__arrow carousel__arrow--${direction}`}
            aria-label={label}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
}