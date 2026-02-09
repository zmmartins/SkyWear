import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "../../../utils/clamp";

/**
 * HOOK: useHeroCarousel
 * ------------------------------------------------------------------
 * Manages the state machine for the Hero Carousel.
 * Handles: Sliding logic, Dot "rotation" logic, Autoplay, and Swipe.
 * * @param {Object} config
 * @param {number} config.slidesLength - Total count of slides
 * @param {Array} config.slides - The slide data (needed for theme extraction)
 * @param {number} config.autoplayMs - Delay between auto-slides (default: 6000)
 * @param {number} config.swipeThreshold - Pixels required to trigger swipe (default: 50)
 */
export default function useHeroCarousel({
    slidesLength = 0,
    slides = [],
    autoplayMs = 6000,
    swipeThreshold = 50,
}) {
    // -- Configuration Constants --
    const TRANSITION_MS = 800; // Must match CSS --slide-transition-ms
    const DOT_ANIM_MS = 500;   // Time for dot to shift position
    
    // -- Refs for Logic (Non-rendering state) --
    const timerRef = useRef(null);         // Autoplay timer
    const transitionTimer = useRef(null);  // CSS Cleanup timer
    const dotTimer = useRef(null);         // Dot animation timer
    const touchStartX = useRef(0);         // Swipe tracking
    const isAnimating = useRef(false);     // Prevents spam-clicking

    const hasManySlides = slidesLength > 1;

    // -- State: Slide Position --
    // We store 'prev' to allow the CSS to animate the exiting slide
    const [slideState, setSlideState] = useState({
        current: 0,
        prev: null,
        direction: "next", // 'next' | 'prev'
    });

    const [isPaused, setIsPaused] = useState(false);

    // -- State: Dots (The Rolling Window) --
    // We initialize this lazily to avoid recalculating on every render
    const [dots, setDots] = useState([]);

    useEffect(() => {
        if (hasManySlides){
            setDots([
                { id: 0, pos: 0, slideIndex: slidesLength - 1 },
                { id: 1, pos: 1, slideIndex: 0 },
                { id: 2, pos: 2, slideIndex: 1 },
            ]);
        }
        else{
            setDots([]);
        }
    }, [slidesLength, hasManySlides]);

    // ------------------------------------------------------------------
    // 1. HELPER: Calculate Slide Indices (Circular)
    // ------------------------------------------------------------------
    const getIndices = useCallback((centerIndex) => {
        const prev = (centerIndex - 1 + slidesLength) % slidesLength;
        const next = (centerIndex + 1) % slidesLength;
        return { prev, center: centerIndex, next };
    }, [slidesLength]);

    // ------------------------------------------------------------------
    // 2. CORE: Change Slide Logic
    // ------------------------------------------------------------------
    const goToSlide = useCallback((newIndex, direction) => {
        if (newIndex === slideState.current) return;
        
        // A. Update Main Slide State
        setSlideState((prev) => ({
            current: newIndex,
            prev: prev.current,
            direction,
        }));

        // B. Lock Animation (prevent spam)
        isAnimating.current = true;
        clearTimeout(transitionTimer.current);
        transitionTimer.current = setTimeout(() => {
            setSlideState((s) => ({ ...s, prev: null })); // Cleanup 'exiting' class
            isAnimating.current = false;
        }, TRANSITION_MS);

        // C. Update Dots (The "Rolling" Animation)
        if (hasManySlides) {
            // 1. Shift dots visually first (rotate positions)
            setDots((currentDots) => 
                currentDots.map((d) => ({
                    ...d,
                    pos: direction === "next" 
                        ? (d.pos + 2) % 3  // Shift Left logic
                        : (d.pos + 1) % 3  // Shift Right logic
                }))
            );

            // 2. After animation, snap valid indices into place
            clearTimeout(dotTimer.current);
            dotTimer.current = setTimeout(() => {
                const w = getIndices(newIndex);
                setDots((currentDots) =>
                    currentDots.map((d) => {
                        if (d.pos === 0) return { ...d, slideIndex: w.prev };
                        if (d.pos === 1) return { ...d, slideIndex: w.center };
                        return { ...d, slideIndex: w.next };
                    })
                );
            }, DOT_ANIM_MS);
        }
    }, [slideState.current, hasManySlides, getIndices]);

    // ------------------------------------------------------------------
    // 3. DIRECTIONAL CONTROLS
    // ------------------------------------------------------------------
    const nextSlide = useCallback(() => {
        if (!hasManySlides) return;
        const next = (slideState.current + 1) % slidesLength;
        goToSlide(next, "next");
    }, [slideState.current, slidesLength, hasManySlides, goToSlide]);

    const prevSlide = useCallback(() => {
        if (!hasManySlides) return;
        const prev = slideState.current === 0 ? slidesLength - 1 : slideState.current - 1;
        goToSlide(prev, "prev");
    }, [slideState.current, slidesLength, hasManySlides, goToSlide]);

    // Exposed helper for the Dot onClick events
    const handleDotClick = useCallback((pos) => {
        if (!hasManySlides || isAnimating.current) return;
        if (pos === 0) prevSlide();
        if (pos === 2) nextSlide();
    }, [hasManySlides, prevSlide, nextSlide]);

    // ------------------------------------------------------------------
    // 4. AUTOPLAY ENGINE
    // ------------------------------------------------------------------
    // Use a Ref to store the latest 'nextSlide' so setInterval doesn't need to reset
    const savedNextSlide = useRef(nextSlide);
    useEffect(() => { savedNextSlide.current = nextSlide; }, [nextSlide]);

    useEffect(() => {
        if (!hasManySlides || isPaused) return;
        
        const tick = () => savedNextSlide.current();
        timerRef.current = setInterval(tick, autoplayMs);
        
        return () => clearInterval(timerRef.current);
    }, [hasManySlides, isPaused, autoplayMs]);

    // ------------------------------------------------------------------
    // 5. EVENT HANDLERS (Swipe & Mouse)
    // ------------------------------------------------------------------
    const handlers = useMemo(() => ({
        onMouseEnter: () => setIsPaused(true),
        onMouseLeave: () => setIsPaused(false),
        
        onTouchStart: (e) => {
            touchStartX.current = e.changedTouches[0].screenX;
            setIsPaused(true);
        },
        
        onTouchEnd: (e) => {
            if (!hasManySlides) return;
            const endX = e.changedTouches[0].screenX;
            const diff = touchStartX.current - endX;

            // diff > 0 means finger moved Left (Next Slide)
            // diff < 0 means finger moved Right (Prev Slide)
            if (Math.abs(diff) > clamp(swipeThreshold, 20, 200)) {
                diff > 0 ? nextSlide() : prevSlide();
            }
            
            // Optional: Resume autoplay after a delay, or keep paused until interaction ends
            // Currently logic keeps it paused until mouse leave or next interaction
        }
    }), [hasManySlides, nextSlide, prevSlide, swipeThreshold]);

    // ------------------------------------------------------------------
    // 6. RENDER HELPERS
    // ------------------------------------------------------------------
    
    /**
     * Generates the CSS classes for animations based on current state.
     * Prevents logic clutter in the JSX.
     */
    const getSlideClass = useCallback((index) => {
        const { current, prev, direction } = slideState;
        let className = "carousel__slide";

        if (index === current) {
            className += " is-active";
            // Only add entrance animation if we have a previous slide (not on first load)
            if (prev !== null) {
                className += direction === "next" 
                    ? " slide-enter-from-right" 
                    : " slide-enter-from-left";
            }
        } else if (index === prev) {
            className += " is-exiting";
            className += direction === "next" 
                ? " slide-exit-to-left" 
                : " slide-exit-to-right";
        } else {
            className += " is-hidden";
        }

        return className;
    }, [slideState]);

    const activeTheme = useMemo(() => {
        return slides?.[slideState.current]?.theme ?? "winter";
    }, [slides, slideState.current]);

    // ------------------------------------------------------------------
    // 7. CLEANUP
    // ------------------------------------------------------------------
    useEffect(() => {
        return () => {
            clearTimeout(transitionTimer.current);
            clearTimeout(dotTimer.current);
            clearInterval(timerRef.current);
        };
    }, []);

    return {
        // State
        slideState,
        activeTheme,
        dots,
        isPaused,
        
        // Actions
        nextSlide,
        prevSlide,
        goToSlide,
        handleDotClick,
        
        // Helpers
        getSlideClass,
        
        // Event Bindings (Spread these onto the container)
        bind: handlers
    };
}