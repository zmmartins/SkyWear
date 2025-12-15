import React, {useState, useEffect, useRef, useCallback} from "react";

export default function Hero(){

    const [slideState, setSlideState] = useState({
        current: 0,
        prev: null,
        direction: "next"
    });

    const [ heroTheme, setHeroTheme ] = useState("winter");
    const [ extraOrbs, setExtraOrbs ] = useState(3);
    const [isPaused, setIsPaused] = useState(false);

    const timerRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const slides = [
        { id: 0, theme: "winter" },
        { id: 1, theme: "summer" }
    ];
    
    const DOT_ANIM_MS = 500; // must match your CSS transition time (0.5s)
    const dotTimerRef = useRef(null);

    const buildWindow = useCallback((center) => {
    const prev = (center - 1 + slides.length) % slides.length;
    const next = (center + 1) % slides.length;
    return { prev, center, next };
    }, [slides.length]);

    const [dots, setDots] = useState(() => {
    if (slides.length <= 1) return [{ id: 1, pos: 1, slideIndex: 0 }];
    const w = buildWindow(0);
    return [
        { id: 0, pos: 0, slideIndex: w.prev },
        { id: 1, pos: 1, slideIndex: w.center },
        { id: 2, pos: 2, slideIndex: w.next },
    ];
    });

    const animateDots = useCallback((direction, newCenter) => {
    if (slides.length <= 1) return;

    // Step 1: rotate positions (this is what CSS animates)
    setDots((ds) =>
        ds.map((d) => ({
        ...d,
        pos: direction === "next" ? (d.pos + 2) % 3 : (d.pos + 1) % 3,
        }))
    );

    // Step 2: after the motion finishes, update which slide each dot represents
    clearTimeout(dotTimerRef.current);
    dotTimerRef.current = setTimeout(() => {
        const w = buildWindow(newCenter);
        setDots((ds) =>
        ds.map((d) =>
            d.pos === 0 ? { ...d, slideIndex: w.prev }
            : d.pos === 1 ? { ...d, slideIndex: w.center }
            : { ...d, slideIndex: w.next }
        )
        );
    }, DOT_ANIM_MS);
    }, [slides.length, buildWindow]);

    useEffect(() => {
    return () => clearTimeout(dotTimerRef.current);
    }, []);

    // --- Navigation Logic --- //
    const changeSlide = useCallback((newIndex, direction) => {
        setSlideState(prevState => {
            if(prevState.current === newIndex) return prevState;

            return {
                current: newIndex,
                prev: prevState.current,
                direction: direction
            };
        });

        setHeroTheme(slides[newIndex].theme);
        animateDots(direction, newIndex);
    }, [slides]);

    const nextSlide = useCallback(() => {
        const nextIndex = (slideState.current + 1) % slides.length;
        changeSlide(nextIndex, "next");
    }, [slideState.current, slides.length, changeSlide]);

    const prevSlide = useCallback(() => {
        const prevIndex = slideState.current === 0 ? slides.length - 1 : slideState.current - 1;
        changeSlide(prevIndex, "prev");
    }, [slideState.current, slides.length, changeSlide]);

    const goToSlide = useCallback((newIndex) => {
        if (newIndex === slideState.current) return;

        const direction = newIndex > slideState.current ? "next" : "prev";
        changeSlide(newIndex, direction);
    }, [slideState.current, changeSlide]);

    // --- Autoplay --- //
    useEffect(() => {
        if (isPaused) return;

        timerRef.current = setInterval(nextSlide, 6000);
        return () => clearInterval(timerRef.current);
    }, [isPaused, nextSlide]);


    // --- Keyboard--- // 
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === "INPUT") return;
            if (e.key === "ArrowLeft") {
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
    }, [prevSlide, nextSlide]);


    // --- Orbs Logic --- //
    useEffect(() => {
        const calculateOrbs = () => {
            const artDiameter = 360;
            const width = window.innerWidth;
            let lastScale = 1.0;
            let count = 0;

            while (width > artDiameter * lastScale && count < 10){
                lastScale += 0.3;
                count++;
            }
            setExtraOrbs(Math.max(3, count));
        };

        calculateOrbs();
        window.addEventListener("resize", calculateOrbs);
        return () => window.removeEventListener("resize", calculateOrbs);
    }, []);


    // --- Swipe Logic --- //
    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e) =>{
        touchEndX.current = e.changedTouches[0].screenX;
        handleSwipe();
    };
    const handleSwipe = () => {
        const diff = touchStartX.current - touchEndX.current;
        const MIN_SWIPE = 50;

        if(Math.abs(diff) > MIN_SWIPE){
            setIsPaused(true);
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    };

    // --- Class Helper for Animation --- //
    const getSlideClass = (index) => {
        let className = "carousel__slide";

        // Active Slide (The one arriving)
        if (index === slideState.current){
            className += " is-active";
            if(slideState.prev !== null){
                className += slideState.direction === "next"
                    ? " slide-enter-from-right"
                    : " slide-enter-from-left";
            }
        }
        // Previous Slide (The one leaving)
        else if (index === slideState.prev){
            className += " is-exiting";
            className += slideState.direction === "next"
                ? " slide-exit-to-left"
                : " slide-exit-to-right";
        }
        // All other slides
        else {
            className += " is-hidden";
        }

        return className;
    }

    return (
        <section 
            className={`hero-carousel hero-theme-${heroTheme}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="carousel">
                <div className="carousel__track">

                    {/* SLIDE 1: WINTER */}
                    <article className={getSlideClass(0)}>
                        <div className="carousel__layout">
                            <aside className="carousel__info">
                                <p className="carousel__badge">Bundle 1</p>
                                <h1 className="carousel__title">Winter Bundle</h1>
                                <div className="carousel__meta">
                                    <span className="carousel__pieces">8 pieces</span>
                                    <span className="carousel__meta-dot">•</span>
                                    <span className="carousel__price">$150</span>
                                </div>
                            </aside>

                            <div className="carousel__art">
                                {[...Array(extraOrbs)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="carousel__art-extra-orb"
                                        style={{ height: `${130 + (i * 30)}%`, aspectRatio: "1/1"}}
                                    ></div>
                                ))}

                                <div className="outfit-stack">
                                    <div className="clothing-piece clothing-piece--pants">
                                        <img src="/assets/img/winter bundle/pants1.png" className="main" alt="Pants" />
                                        <img src="/assets/img/winter bundle/pants2.png" className="alt-item alt-item--pants1" alt="Alt pants" />
                                    </div>
                                    <div className="clothing-piece clothing-piece--hoodie">
                                        <img src="/assets/img/winter bundle/hoodie1.png" className="alt-item alt-item--hoodie1" alt="Hoodie 1" />
                                        <img src="/assets/img/winter bundle/hoodie2.png" className="alt-item alt-item--hoodie2" alt="Hoodie 2" />
                                    </div>
                                    <div className="clothing-piece clothing-piece--tshirt">
                                        <img src="/assets/img/winter bundle/tshirt1.png" className="alt-item alt-item--tshirt1" alt="Tshirt 1" />
                                        <img src="/assets/img/winter bundle/tshirt2.png" className="alt-item alt-item--tshirt2" alt="Tshirt 2" />
                                    </div>
                                    <div className="clothing-piece clothing-piece--jacket">
                                        <img src="/assets/img/winter bundle/jacket.png" className="main" alt="Jacket" />
                                    </div>
                                    <div className="clothing-piece clothing-piece--beanie">
                                        <img src="/assets/img/winter bundle/beanie.png" className="main" alt="Beanie" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* SLIDE 2: SUMMER */}
                    <article className={getSlideClass(1)}>
                        <div className="carousel__layout">
                        <aside className="carousel__info">
                            <p className="carousel__badge">Bundle 2</p>
                            <h1 className="carousel__title">Summer Bundle</h1>
                            <div className="carousel__meta">
                            <span className="carousel__pieces">9 pieces</span>
                            <span className="carousel__meta-dot">•</span>
                            <span className="carousel__price">$150</span>
                            </div>
                        </aside>

                        <div className="carousel__art">
                            {[...Array(extraOrbs)].map((_, i) => (
                                <div
                                    key={i}
                                    className="carousel__art-extra-orb"
                                    style={{ height: `${130 + (i * 30)}%`, aspectRatio: "1/1" }}
                                ></div>
                            ))}

                            <div className="outfit-stack">
                            <div className="clothing-piece clothing-piece--pants">
                                <img src="/assets/img/summer bundle/pants.png" className="alt-item alt-item--pants2" alt="Pants" />
                            </div>
                            <div className="clothing-piece clothing-piece--shorts">
                                <img src="/assets/img/summer bundle/shorts1.png" className="main" alt="Shorts" />
                                <img src="/assets/img/summer bundle/shorts2.png" className="alt-item alt-item--shorts1" alt="Alt shorts" />
                            </div>
                            <div className="clothing-piece clothing-piece--sweater">
                                <img src="/assets/img/summer bundle/sweater.png" className="alt-item alt-item--sweater1" alt="Sweater" />
                            </div>
                            <div className="clothing-piece clothing-piece--tshirt">
                                <img src="/assets/img/summer bundle/tshirt1.png" className="alt-item alt-item--tshirt1" alt="Tshirt" />
                                <img src="/assets/img/summer bundle/tshirt2.png" className="alt-item alt-item--tshirt2" alt="Tshirt" />
                            </div>
                            <div className="clothing-piece clothing-piece--shirt">
                                <img src="/assets/img/summer bundle/shirt.png" className="main" alt="Shirt" />
                            </div>
                            <div className="clothing-piece clothing-piece--hat">
                                <img src="/assets/img/summer bundle/hat1.png" className="alt-item alt-item--hat1" alt="Hat 1" />
                                <img src="/assets/img/summer bundle/hat2.png" className="main" alt="Hat" />
                            </div>
                            </div>
                        </div>
                        </div>
                    </article>
                </div>

                {/* CONTROLS */}
                <button onClick={prevSlide} className="carousel__arrow carousel__arrow--prev" aria-label="Previous slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 19l-7-7 7-7" fill="none" />
                    <path d="M19 21 L5 12 L19 3 V21 Z" />
                </svg>
                </button>

                <button onClick={nextSlide} className="carousel__arrow carousel__arrow--next" aria-label="Next slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 3 L19 12 L5 21 V3 Z"/>
                </svg>
                </button>

                <div className="carousel__dots">
                    {(slides.length <= 1 ? [{ id: 1, pos: 1, slideIndex: 0 }] : dots).map((d) => (
                        <button
                        key={d.id}
                        className="carousel__dot"
                        data-pos={d.pos}
                        onClick={() => {
                            if (slides.length <= 1) return;
                            if (d.pos === 0) prevSlide(); // left dot -> previous
                            if (d.pos === 2) nextSlide(); // right dot -> next
                        }}
                        aria-label={
                            slides.length <= 1
                            ? "Slide 1"
                            : d.pos === 1
                                ? `Current slide ${d.slideIndex + 1}`
                                : `Go to slide ${d.slideIndex + 1}`
                        }
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}