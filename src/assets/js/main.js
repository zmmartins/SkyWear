// Simple carousel logic

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector("[data-carousel]");
    if (!carousel) return;

    const hero = document.querySelector(".hero-carousel");
    let currentHeroTheme = null;

    const track = carousel.querySelector("[data-carousel-track]");
    if (!track) return;
    const slides = Array.from(track.children);
    
    const dotContainer = carousel.querySelector("[data-carousel-dots]");
    const slideCount = slides.length;
    let dots = [];
    let currentIndex = 0;
    let autoPlayId = null;
    const AUTO_PLAY_INTERVAL = 6000;
    let isAnimating = false;

    // Respect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const artElements = Array.from(document.querySelectorAll(".carousel__art"));
    if(artElements.length){
        function createOrUpdateExtraCircles(artEl) {
            const width = window.innerWidth;

            artEl.querySelectorAll(".carousel__art-extra-orb").forEach(el => el.remove());

            const artRect = artEl.getBoundingClientRect();
            const artDiameter = artRect.height;

            let lastScale = 1.0;
            const extraScales = [];

            while(width > artDiameter * lastScale){
                const nextScale = lastScale + 0.3;
                extraScales.push(nextScale);
                lastScale = nextScale;

                if(extraScales.length > 10) break;
            }
            
            extraScales.forEach(scale => {
                const orb = document.createElement("div");
                orb.classList.add("carousel__art-extra-orb");

                orb.style.height = `${scale * 100}%`;
                orb.style.aspectRatio = "1/1";

                artEl.appendChild(orb);
            });
        }

        function updateAllArtCircles(){
            artElements.forEach(createOrUpdateExtraCircles);
        }

        updateAllArtCircles();

        let resizeTimeout = null;
        window.addEventListener("resize", ()=> {
            if(resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateAllArtCircles, 150);
        });
    }

    // If there is only ONE slide -> hide controls and stop here
    if(slideCount <= 1){
        if(dotContainer) dotContainer.style.display = "none";

        // Ensure the only slide is visible and centered
        track.style.transform = "translateX(0)";
        slides.forEach((slide, i) => {
            slide.classList.toggle("is-active", i === 0);
        });

        if(hero){
            const activeSlide = slides[0];
            const theme = activeSlide.dataset.heroTheme;
            if(theme){
                hero.classList.add(`hero-theme-${theme}`);
                currentHeroTheme = theme;
            }
        }

        return; // no autoplay, no navigation needed
    }

    // ------- create 3 dots ------- //
    let prevDot = null
    let currentDot = null;
    let nextDot = null;

    if (dotContainer){
        dotContainer.innerHTML = "";

        function createDot(position){
            const dot = document.createElement("button");
            dot.classList.add("carousel__dot");
            dot.setAttribute("type", "button");
            dot.dataset.carouselDot = position;

            if(position == "current"){
                dot.classList.add("carousel__dot--center", "is-active");
                dot.setAttribute("aria-label", `Slide 1 of ${slideCount}`);
                dot.setAttribute("aria-pressed", "true");
                dot.setAttribute("aria-current", "true");
            }
            else{
                dot.classList.add("carousel__dot--side");
                dot.setAttribute("aria-label", position === "prev" ? "Previous slide" : "Next slide");
                dot.setAttribute("aria-pressed", "false");
            }

            dotContainer.appendChild(dot);
            return dot;
        }

        prevDot = createDot("prev");
        currentDot = createDot("current");
        nextDot = createDot("next");

        dots = [prevDot, currentDot, nextDot];
    }

    function animateSlideChange(fromIndex, toIndex, direction){
        const currentSlide = slides[fromIndex];
        const nextSlide = slides[toIndex];

        if (!currentSlide || !nextSlide || currentSlide === nextSlide) return;

        isAnimating = true;

        const offsetOut = direction === "next" ? "-100%" : "100%";
        const offsetInStart = direction === "next" ? "100%" : "-100%";

        currentSlide.style.transition = "none";
        nextSlide.style.transition = "none";

        currentSlide.style.opacity = "1";
        currentSlide.style.transform = "translateX(0)";

        nextSlide.style.opacity = "0";
        nextSlide.style.transform = `translateX(${offsetInStart})`;

        // Force reflow so the browser picks up the initial styles
        void currentSlide.offsetWidth;

        // Apply transitions
        const transitionSpec = "transform 0.6s ease, opacity 0.6s ease";
        currentSlide.style.transition = transitionSpec;
        nextSlide.style.transition = transitionSpec;
        
        // Animate to final positions
        currentSlide.style.opacity = "0";
        currentSlide.style.transform = `translateX(${offsetOut})`;
        nextSlide.style.opacity = "1";
        nextSlide.style.transform = "translateX(0)";

        let finishedCount = 0;
        function onDone(){
            finishedCount++;
            if (finishedCount < 2) return;

            currentSlide.removeEventListener("transitionend", onDone);
            nextSlide.removeEventListener("transitionend", onDone);

            slides.forEach((slide, i) => {
                const isActive = i === toIndex;
                slide.classList.toggle("is-active", isActive);
                slide.style.transition = "";
                slide.style.opacity = isActive ? "1" : "0";
                slide.style.transform = "translateX(0)";
                slide.style.pointerEvents = isActive ? "auto" : "none";
                slide.style.zIndex = isActive ? "1" : "0";
            });

            isAnimating = false;
        }

        currentSlide.addEventListener("transitionend", onDone);
        nextSlide.addEventListener("transitionend", onDone);
    }

    function updateCarousel(index, direction = null) {
        if (isAnimating && direction) return;
        
        const previousIndex = currentIndex;
        const newIndex = (index + slideCount) % slideCount;

        // If trying to go to same slide
        if (previousIndex === newIndex && direction) return;

        // Handle visual slide change
        if (!mediaQuery.matches && direction){
            animateSlideChange(previousIndex, newIndex, direction);
        }
        else{
            slides.forEach((slide, i) =>{
                const isActive = i === newIndex;
                slide.classList.toggle("is-active", isActive);
                slide.style.transition = "none";
                slide.style.opacity = isActive ? "1" : "0";
                slide.style.transform = "translateX(0)";
                slide.style.pointerEvents = isActive ? "auto" : "none";
                slide.style.zIndex = isActive ? "1" : "0";
            });
        }

        // Update index after setting up the visuals
        currentIndex = newIndex;


        // Dots
        if(dots.length){
            dots.forEach((dot) => {
                const isCenter = dot.dataset.carouselDot === "current";
                dot.classList.toggle("is-active", isCenter);
            });

            if(currentDot){
                const humanIndex = currentIndex + 1;
                currentDot.setAttribute("aria-label", `Slide ${humanIndex} of ${slideCount}`);
                currentDot.setAttribute("aria-pressed", "true");
                currentDot.setAttribute("aria-current", "true");
            }

            if(prevDot){
                const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
                prevDot.setAttribute("aria-label", `Go to slide ${prevIndex + 1}`);
                prevDot.setAttribute("aria-pressed", "false");
                prevDot.removeAttribute("aria-current");
            }

            if(nextDot){
                const nextIndex = (currentIndex + 1) % slideCount;
                nextDot.setAttribute("aria-label", `Go to slide ${nextIndex + 1}`);
                nextDot.setAttribute("aria-pressed", "false");
                nextDot.removeAttribute("aria-current");
            }
        }

        // Hero theme
        if(hero){
            const activeSlide = slides[currentIndex];
            const theme = activeSlide.dataset.heroTheme;

            if(currentHeroTheme){
                hero.classList.remove(`hero-theme-${currentHeroTheme}`);
            }
            if(theme){
                hero.classList.add(`hero-theme-${theme}`);
                currentHeroTheme = theme;
            }
            else{
                currentHeroTheme = null;
            }
        }
    }

    function next() {
        updateCarousel(currentIndex + 1, "next");
    }

    function prev() {
        updateCarousel(currentIndex - 1, "prev");
    }

    function startAutoplay() {
        // Don't auto play if user prefers reduced motion
        if(mediaQuery.matches) return;
        // Don't create a second timer if one is already running
        if(autoPlayId !== null) return;

        autoPlayId = setInterval(next, AUTO_PLAY_INTERVAL);
    }

    function stopAutoplay() {
        if (autoPlayId !== null) {
            clearInterval(autoPlayId);
            autoPlayId = null;
        }
    }



    if(prevDot){
        prevDot.addEventListener("click", () => {
            stopAutoplay();
            prev();
        });
    }

    if(nextDot){
        nextDot.addEventListener("click", () => {
            stopAutoplay();
            next();
        });
    }

    // Pause on hover
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", () => {
        // Only resume if user does not prefer reduced motion
        if(!mediaQuery.matches){
            startAutoplay();
        }
    });


    // Watch for changes to reduced motion preference
    mediaQuery.addEventListener("change", (event) => {
        if(event.matches) {
            stopAutoplay();
        }
        else {
            startAutoplay();
        }
    });

    // Init
    updateCarousel(0);
    if(!mediaQuery.matches){
        startAutoplay();
    }
});