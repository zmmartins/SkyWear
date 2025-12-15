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
    
    let currentIndex = 0;
    let autoPlayId = null;
    const AUTO_PLAY_INTERVAL = 6000;
    let isAnimating = false;

    // Respect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // ART / ORB logic
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
        return; 
    }

    // ------- create 3 dots ------- //
    let dotElements = [];

    if (dotContainer){
        dotContainer.innerHTML = "";

        for(let i = 0; i < 3; i++){
            const dot = document.createElement("button");
            dot.classList.add("carousel__dot");
            dot.setAttribute("type", "button");

            dot.dataset.pos = i;

            dot.addEventListener("click", ()=>{
                const currentPos = parseInt(dot.dataset.pos);
                if(currentPos === 0){
                    stopAutoplay();
                    prev();
                }
                else if(currentPos === 2){
                    stopAutoplay();
                    next();
                }
            });

            dotContainer.appendChild(dot);
            dotElements.push(dot);
        }
    }

    function updateDotsVisuals(){
        dotElements.forEach((dot, index) => {
            dot.dataset.pos = index;

            if(index === 1){
                dot.setAttribute("aria-label", `Current Slide`);
                dot.setAttribute("aria-current", "true");
            }
            else{
                dot.setAttribute("aria-label", index === 0 ? "Previous Slide" : "Next Slide");
                dot.removeAttribute("aria-current");
            }
        });
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

        // Force reflow
        void currentSlide.offsetWidth;

        // Apply transitions
        const transitionSpec = "transform 0.6s ease, opacity 0.6s ease";
        currentSlide.style.transition = transitionSpec;
        nextSlide.style.transition = transitionSpec;
        
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

        currentIndex = newIndex;

        // Dots (CORRIGIDO AQUI: dotElements em vez de dots)
        if(dotElements.length){
            if (direction === "next"){
                const firstDot = dotElements.shift();
                dotElements.push(firstDot);
            }
            else if(direction === "prev"){
                const lastDot = dotElements.pop();
                dotElements.unshift(lastDot);
            }

            updateDotsVisuals();
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
            } else {
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
        if(mediaQuery.matches) return;
        if(autoPlayId !== null) return;
        autoPlayId = setInterval(next, AUTO_PLAY_INTERVAL);
    }

    function stopAutoplay() {
        if (autoPlayId !== null) {
            clearInterval(autoPlayId);
            autoPlayId = null;
        }
    }

    // Pause on hover
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", () => {
        if(!mediaQuery.matches){
            startAutoplay();
        }
    });

    // -------- TOUCH / SWIPE SUPPORT -------- //
    let touchStartX = 0;
    let touchEndX = 0;
    const MIN_SWIPE_DISTANCE = 50;

    carousel.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe(){
        const diff = touchStartX - touchEndX;

        if(Math.abs(diff) > MIN_SWIPE_DISTANCE){
            stopAutoplay();

            if(diff > 0){
                next();
            }
            else{
                prev();
            }
        }
    }

    document.addEventListener("keydown", (e) => {
        if(e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

        if(e.key === "ArrowLeft"){
            stopAutoplay();
            prev();
        }
        else if(e.key === "ArrowRight"){
            stopAutoplay();
            next();
        }
    });

    mediaQuery.addEventListener("change", (event) => {
        if(event.matches) stopAutoplay();
        else startAutoplay();
    });

    // Init
    updateCarousel(0);
    if(!mediaQuery.matches){
        startAutoplay();
    }
});