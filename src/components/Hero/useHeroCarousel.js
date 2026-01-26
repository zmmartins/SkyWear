import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "../../utils/clamp";

/**
 * useHeroCarousel
 * 
 * Encapsula o comportamento do carrossel: estado dos slides, dots, autoplay, keyboard, swipe, pausa/resumo.
 * 
 * @param {object} opts
 * @param {number} opts.slidesLength - Number of slides.
 * @param {Array<{ theme?: string }>} [opts.slides] - Optional slide metadata for activeTheme.
 * @param {number} [opts.autoplayMs=6000]
 * @param {number} [opts.dotAnimMs=500]
 * @param {number} [opts.swipeThresholdPx=50]
 */
export default function useHeroCarousel({
    slidesLength,
    slides= [],
    autoplayMs = 6000,
    dotAnimMs = 500,
    swipeThresholdPx = 50,
}) {

    const SWIPE_THRESHOLD = clamp(swipeThresholdPx, 20, 200);

    const clearAnimRef = useRef(null);

    const clearAnimationState = useCallback(() => {
        setSlideState((s) => (s.prev === null ? s : { ...s, prev: null }));
    }, []);

    const [slideState, setSlideState] = useState({
        current: 0,
        prev: null,
        direction: "next",
    });

    const [isPaused, setIsPaused] = useState(false);

    const timerRef= useRef(null);
    const dotTimerRef= useRef(null);
    const touchStartX = useRef(0);

    const hasManySlides = slidesLength > 1;
    
    const buildWindow = useCallback((center) => {
            if (slidesLength <= 1) return { prev: 0, center: 0, next: 0 };
            const prev = (center - 1 + slidesLength) % slidesLength;
            const next= (center + 1) % slidesLength;
            return { prev, center, next };
    }, [slidesLength]);
    
    const [dots, setDots] = useState(() => {
        if (!hasManySlides) return [{ id: 1, pos: 1, slideIndex: 0 }];
        const w = buildWindow(0);
        return [
            { id: 0, pos: 0, slideIndex: w.prev },
            { id:1, pos: 1, slideIndex: w.center },
            { id: 2, pos: 2, slideIndex: w.next },
        ];
    });

    const animateDots = useCallback((direction, newCenter) => {
        if (!hasManySlides) return;

        setDots((ds) => 
            ds.map((d) => ({
                ...d,
                pos: direction === "next" ? (d.pos + 2) % 3 : (d.pos + 1) % 3,
            }))
        );

        clearTimeout(dotTimerRef.current);
        dotTimerRef.current = setTimeout(() => {
            const w = buildWindow(newCenter);
            setDots((ds) =>
                ds.map((d) => 
                    d.pos === 0 
                    ? {...d, slideIndex: w.prev}
                    : d.pos === 1
                        ? {...d, slideIndex: w.center}
                        : {...d, slideIndex: w.next}
                )
            );
        }, dotAnimMs);
    }, [buildWindow, dotAnimMs, hasManySlides]);

    useEffect(() => {
        return () => clearTimeout(dotTimerRef.current);
    }, []);

    const TRANSITION_MS = 800;

    const changeSlide = useCallback((newIndex, direction) => {
        setSlideState((prevState) => {
            if (prevState.current === newIndex) return prevState;
            return { current: newIndex, prev: prevState.current, direction};
        });
        animateDots(direction, newIndex);

        clearTimeout(clearAnimRef.current);
        clearAnimRef.current = setTimeout(() => {
            clearAnimationState();
        }, TRANSITION_MS);
    }, [animateDots, clearAnimationState]);

    const nextSlide = useCallback(() => {
        if (slidesLength <= 1) return;
        const nextIndex = (slideState.current + 1) % slidesLength;
        changeSlide(nextIndex, "next");
    }, [slidesLength, slideState.current, changeSlide]);

    const prevSlide = useCallback(()=> {
        if(slidesLength <= 1) return;
        const prevIndex = slideState.current === 0 ? slidesLength - 1 : slideState.current - 1;
        changeSlide(prevIndex, "prev");
    }, [slidesLength, slideState.current, changeSlide]);

    // Autoplay
    useEffect(() => {
        if (!hasManySlides) return;
        if (isPaused) return;

        timerRef.current = setInterval(nextSlide, autoplayMs);
        return () => clearInterval(timerRef.current);
    }, [autoplayMs, hasManySlides, isPaused, nextSlide]);

    // Keyboard
    useEffect(() => {
        if (!hasManySlides) return;

        const handleKeyDown = (e) => {
            const tag = e.target?.tagName;
            if(tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;

            if (e.key === "ArrowLeft"){
                setIsPaused(true);
                prevSlide();
            }
            else if (e.key === "ArrowRight"){
                setIsPaused(true);
                nextSlide();
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hasManySlides, nextSlide, prevSlide]);

    useEffect(() => {
        return () => clearTimeout(clearAnimRef.current);
    }, []);

    // Touch / Swipe
    const onTouchStart = useCallback((e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    }, []);

    const onTouchEnd = useCallback((e) => {
        if(!hasManySlides) return;
        const endX = e.changedTouches[0].screenX;
        const diff = touchStartX.current - endX;

        if (Math.abs(diff) > SWIPE_THRESHOLD){
            setIsPaused(true);
            diff > 0 ? nextSlide() : prevSlide();
        }
    }, [hasManySlides, nextSlide, prevSlide, SWIPE_THRESHOLD]);

    const onMouseEnter = useCallback(() => setIsPaused(true), []);
    const onMouseLeave = useCallback(() => setIsPaused(false), []);

    const getSlideClass = useCallback((index) => {
        let className = "carousel__slide";

        if(index === slideState.current){
            className += " is-active";
            if (slideState.prev != null){
                className += slideState.direction === "next" ? " slide-enter-from-right" : " slide-enter-from-left";
            }
        }
        else if (index === slideState.prev){
            className += " is-exiting";
            className += slideState.direction === "next" ? " slide-exit-to-left" : " slide-exit-to-right";
        }
        else {
            className += " is-hidden";
        }

        return className;
    }, [slideState]);

    const activeTheme = useMemo(() => {
        return slides?.[slideState.current]?.theme ?? "winter";
    }, [slides, slideState.current]);

    const dotNav = useCallback((pos) => {
        if(!hasManySlides) return;
        if(pos === 0) prevSlide();
        if(pos === 2) nextSlide();
    }, [hasManySlides, nextSlide, prevSlide]);

    return {
        slideState, 
        activeTheme,
        
        isPaused,
        setIsPaused,

        dots: hasManySlides ? dots : [{ id: 1, pos: 1, slideIndex: 0 }],

        nextSlide,
        prevSlide,
        changeSlide,

        getSlideClass,
        dotNav,

        bind: {
            onMouseEnter,
            onMouseLeave,
            onTouchStart,
            onTouchEnd,
        },
    };
}
