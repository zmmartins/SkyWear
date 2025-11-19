// Simple carousel logic

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector("[data-carousel]");
    if (!carousel) return;

    const track = carousel.querySelector("[data-carousel-track]");
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
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce");

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
                
            });
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
        next();
    });

    if (prevBtn) prevBtn.addEventListener("click", () => {
        prev();
    });

    if(dots.length){
        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
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