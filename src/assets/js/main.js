// Simple carousel logic

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector("[data-carousel]");
    if (!carousel) return;

    const hero = document.querySelector(".hero-carousel");
    let currentHeroTheme = null;

    const track = carousel.querySelector("[data-carousel-track]");
    if (!track) return;
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    
    const dotContainer = carousel.querySelector("[data-carousel-dots]");
    const slideCount = slides.length;
    let dots = [];
    let currentIndex = 0;
    let autoPlayId = null;
    const AUTO_PLAY_INTERVAL = 6000;

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
            resizeTimeout = setTimeout(updateAllArtCircles(), 150);
        });
    }

    // If there is only ONE slide -> hide controls and stop here
    if(slideCount <= 1){
        if(prevBtn) prevBtn.style.display = "none";
        if(nextBtn) nextBtn.style.display = "none";
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

    // ------- Create dots dynamically (for 2+ slides) -------
    if (dotContainer) {
        dotContainer.innerHTML = "";

        slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.classList.add("carousel__dot");
            dot.setAttribute("type", "button");
            dot.dataset.carouselDot = "";

            if(index === 0){
                dot.classList.add("is-active");
            }

            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
            dot.setAttribute("aria-pressed", index === 0 ? "true" : "false");

            dotContainer.appendChild(dot);
        });

        dots = Array.from(dotContainer.querySelectorAll(".carousel__dot"));
    }

    function updateCarousel(index) {
        currentIndex = (index + slideCount) % slideCount;

        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;

        slides.forEach((slide, i) => {
            slide.classList.toggle("is-active", i === currentIndex);
        });

        if(dots.length){
            dots.forEach((dot, i) => {
                const isActive = i === currentIndex;
                dot.classList.toggle("is-active", isActive);
                dot.setAttribute("aria-pressed", isActive ? "true" : "false");
                dot.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }

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
        updateCarousel(currentIndex + 1);
    }

    function prev() {
        updateCarousel(currentIndex - 1);
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

    // Event listeners
    if (nextBtn) nextBtn.addEventListener("click", () => {
        stopAutoplay();
        next();
    });

    if (prevBtn) prevBtn.addEventListener("click", () => {
        stopAutoplay();
        prev();
    });

    if(dots.length){
        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                stopAutoplay();
                updateCarousel(i);
            });
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