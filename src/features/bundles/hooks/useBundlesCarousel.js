import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "@/utils/clamp"; // Use Absolute Import

export default function useBundlesCarousel({
    slidesLength = 0, slides = [], autoplayMs = 6000, swipeThreshold = 50,
}) {
    const TRANSITION_MS = 800; 
    const DOT_ANIM_MS = 500;   
    
    const timerRef = useRef(null);         
    const transitionTimer = useRef(null);  
    const dotTimer = useRef(null);         
    const touchStartX = useRef(0);         
    const isAnimating = useRef(false);     

    const hasManySlides = slidesLength > 1;

    const [slideState, setSlideState] = useState({ current: 0, prev: null, direction: "next" });
    const [isPaused, setIsPaused] = useState(false);
    const [dots, setDots] = useState([]);

    useEffect(() => {
        if (hasManySlides){
            setDots([
                { id: 0, pos: 0, slideIndex: slidesLength - 1 },
                { id: 1, pos: 1, slideIndex: 0 },
                { id: 2, pos: 2, slideIndex: 1 },
            ]);
        } else {
            setDots([]);
        }
    }, [slidesLength, hasManySlides]);

    const getIndices = useCallback((centerIndex) => {
        const prev = (centerIndex - 1 + slidesLength) % slidesLength;
        const next = (centerIndex + 1) % slidesLength;
        return { prev, center: centerIndex, next };
    }, [slidesLength]);

    const goToSlide = useCallback((newIndex, direction) => {
        setSlideState((prev) => {
            if (newIndex === prev.current) return prev;
            return { current: newIndex, prev: prev.current, direction };
        });

        isAnimating.current = true;
        clearTimeout(transitionTimer.current);
        transitionTimer.current = setTimeout(() => {
            setSlideState((s) => ({ ...s, prev: null })); 
            isAnimating.current = false;
        }, TRANSITION_MS);

        if (hasManySlides) {
            setDots((currentDots) => 
                currentDots.map((d) => ({
                    ...d,
                    pos: direction === "next" ? (d.pos + 2) % 3 : (d.pos + 1) % 3 
                }))
            );

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
    }, [hasManySlides, getIndices]);

    const nextSlide = useCallback(() => {
        if (!hasManySlides) return;
        goToSlide((slideState.current + 1) % slidesLength, "next");
    }, [slideState.current, slidesLength, hasManySlides, goToSlide]);

    const prevSlide = useCallback(() => {
        if (!hasManySlides) return;
        goToSlide(slideState.current === 0 ? slidesLength - 1 : slideState.current - 1, "prev");
    }, [slideState.current, slidesLength, hasManySlides, goToSlide]);

    const handleDotClick = useCallback((pos) => {
        if (!hasManySlides || isAnimating.current) return;
        if (pos === 0) prevSlide();
        if (pos === 2) nextSlide();
    }, [hasManySlides, prevSlide, nextSlide]);

    const savedNextSlide = useRef(nextSlide);
    useEffect(() => { savedNextSlide.current = nextSlide; }, [nextSlide]);

    useEffect(() => {
        if (!hasManySlides || isPaused) return;
        const tick = () => savedNextSlide.current();
        timerRef.current = setInterval(tick, autoplayMs);
        return () => clearInterval(timerRef.current);
    }, [hasManySlides, isPaused, autoplayMs]);

    const handlers = useMemo(() => ({
        onMouseEnter: () => setIsPaused(true),
        onMouseLeave: () => setIsPaused(false),
        onTouchStart: (e) => {
            touchStartX.current = e.changedTouches[0].screenX;
            setIsPaused(true);
        },
        onTouchEnd: (e) => {
            if (!hasManySlides) return;
            const diff = touchStartX.current - e.changedTouches[0].screenX;
            if (Math.abs(diff) > clamp(swipeThreshold, 20, 200)) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        }
    }), [hasManySlides, nextSlide, prevSlide, swipeThreshold]);

    const getSlideClass = useCallback((index) => {
        const { current, prev, direction } = slideState;
        let className = "carousel__slide";
        if (index === current) {
            className += " is-active";
            if (prev !== null) className += direction === "next" ? " slide-enter-from-right" : " slide-enter-from-left";
        } else if (index === prev) {
            className += " is-exiting";
            className += direction === "next" ? " slide-exit-to-left" : " slide-exit-to-right";
        } else {
            className += " is-hidden";
        }
        return className;
    }, [slideState]);

    const activeTheme = useMemo(() => slides?.[slideState.current]?.theme ?? "winter", [slides, slideState.current]);

    useEffect(() => {
        return () => {
            clearTimeout(transitionTimer.current);
            clearTimeout(dotTimer.current);
            clearInterval(timerRef.current);
        };
    }, []);

    return { slideState, activeTheme, dots, isPaused, nextSlide, prevSlide, goToSlide, handleDotClick, getSlideClass, bind: handlers };
}