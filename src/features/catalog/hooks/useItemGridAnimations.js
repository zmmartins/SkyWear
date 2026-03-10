import { useState, useEffect, useRef, useLayoutEffect } from 'react';

/**
 * HOOK: useItemGridAnimations
 * ------------------------------------------------------------------
 * Orchestrates the complex UI interactions for the ItemGrid:
 * 1. The FLIP animation for swapping category titles with filter buttons.
 * 2. The hardware-accelerated scroll parallax for the active title.
 */
export const useItemGridAnimations = (initialCategory = "all items") => {
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    // Structural Refs
    const sectionRef = useRef(null);
    const headerRef  = useRef(null);
    const titleRef   = useRef(null);
    const optionsRef = useRef(new Map());

    // Animation State tracking
    const isAnimating = useRef(false);
    const flipState = useRef({
        prevCategory: null,
        nextCategory: null,
        titleRect: null,
        targetBtnRect: null
    });

    // --- 1. HANDLE CATEGORY CLICK (Trigger FLIP Start) ---
    const handleCategoryChange = (newCategory) => {
        if (activeCategory === newCategory || isAnimating.current) return;

        // --- Smart Scroll Correction ---
        // Prevents the browser from violently snapping the page when a large category switches to a small one
        if(sectionRef.current){
            const triggerY = 64;
            const rect = sectionRef.current.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;

            if(window.scrollY > absoluteTop - triggerY){
                window.scrollTo({
                    top: absoluteTop - triggerY + 50,
                    behavior: 'smooth'
                });
            }
        }

        const titleEl = titleRef.current;
        const targetBtnEl = optionsRef.current.get(newCategory);

        // Record Initial State (First & Last) before React re-renders
        if (titleEl && targetBtnEl) {
            isAnimating.current = true;
            flipState.current = {
                prevCategory: activeCategory,
                nextCategory: newCategory,
                titleRect: titleEl.getBoundingClientRect(),
                targetBtnRect: targetBtnEl.getBoundingClientRect(),
            };
        }

        setActiveCategory(newCategory);
    };

    // --- 2. FLIP ANIMATION EXECUTION (Invert & Play) ---
    useLayoutEffect(() => {
        const state = flipState.current;
        if (!state.titleRect || !state.targetBtnRect) return;

        const newTitleEl = titleRef.current; 
        const oldTitleAsBtnEl = optionsRef.current.get(state.prevCategory);

        if (!newTitleEl || !oldTitleAsBtnEl) {
            isAnimating.current = false;
            return;
        }

        const newTitleRect = newTitleEl.getBoundingClientRect();
        const oldTitleAsBtnRect = oldTitleAsBtnEl.getBoundingClientRect();

        const getCenter = (rect) => ({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });

        // Calculate Deltas using centers to prevent origin shifting issues
        const titleDeltaX = getCenter(state.targetBtnRect).x - getCenter(newTitleRect).x;
        const titleDeltaY = getCenter(state.targetBtnRect).y - getCenter(newTitleRect).y;
        const titleScale = state.targetBtnRect.width / newTitleRect.width;

        const btnDeltaX = getCenter(state.titleRect).x - getCenter(oldTitleAsBtnRect).x;
        const btnDeltaY = getCenter(state.titleRect).y - getCenter(oldTitleAsBtnRect).y;
        const btnScale = state.titleRect.width / oldTitleAsBtnRect.width;

        // INVERT: Apply Instant Transforms
        newTitleEl.style.transition = 'none';
        newTitleEl.style.transform = `translate3d(${titleDeltaX}px, ${titleDeltaY}px, 0) scale(${titleScale})`;
        newTitleEl.style.color = '#9ca3af'; 

        oldTitleAsBtnEl.style.transition = 'none';
        oldTitleAsBtnEl.style.transform = `translate3d(${btnDeltaX}px, ${btnDeltaY}px, 0) scale(${btnScale})`;
        oldTitleAsBtnEl.style.color = '#f97316';
        oldTitleAsBtnEl.style.zIndex = '10';

        // PLAY: Force reflow and animate to natural positions
        void newTitleEl.offsetHeight; 

        const transitionSettings = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), color 0.4s ease';
        
        newTitleEl.style.transition = transitionSettings;
        newTitleEl.style.transform = 'translate3d(0, 0, 0) scale(1)';
        newTitleEl.style.color = ''; 

        oldTitleAsBtnEl.style.transition = transitionSettings;
        oldTitleAsBtnEl.style.transform = 'translate3d(0, 0, 0) scale(1)';
        oldTitleAsBtnEl.style.color = ''; 
        
        const timer = setTimeout(() => {
            isAnimating.current = false;
            oldTitleAsBtnEl.style.zIndex = '';

            newTitleEl.style.transition = '';
            oldTitleAsBtnEl.style.transition = '';

            flipState.current = {};
        }, 600);

        return () => clearTimeout(timer);
    }, [activeCategory]);

    // --- 3. 2-PHASE SCROLL EFFECT ---
    useEffect(() => {
        let ticking = false;

        const updateScrollEffects = () => {
            if (!sectionRef.current || !titleRef.current || !headerRef.current || isAnimating.current) return;
            if (window.innerWidth <= 768) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const triggerY = 64;

            // PHASE 1: Parallax Slide-in (Before it hits the top)
            if (rect.top > triggerY) {
                // Pin the title to 0 if it tries to move down, creating a locking effect
                let translateY = (rect.top - triggerY) * -0.2;
                if (translateY > 0) translateY = 0;

                titleRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
                headerRef.current.style.setProperty('--shrink-progress', '0');
            }

            // PHASE 2: Sticky Layout Morph (After it hits the top)
            else{
                titleRef.current.style.transform = 'translate3d(0, 0, 0)';

                const distance = 50; // Pixels required to complete the shrink layout
                let progress = Math.min(1, (triggerY - rect.top) / distance);
                headerRef.current.style.setProperty('--shrink-progress', progress.toFixed(3));
            }
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return {
        activeCategory,
        handleCategoryChange,
        sectionRef,
        headerRef,
        titleRef,
        optionsRef
    };
};