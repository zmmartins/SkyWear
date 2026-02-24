import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './ItemGrid.css';

// MOCK DATA
const productsData = [
    {
        id: 'prod_001',
        type: 'jacket',
        name: 'Expedition Shell',
        price: 245.00,
        mainImage: 'assets/img/winter-bundle/jacket.png', 
    },
    {
        id: 'prod_002',
        type: 'hoodie',
        name: 'Core Fleece Hoodie',
        price: 95.00,
        mainImage: 'assets/img/winter-bundle/hoodie2.png',
    },
    {
        id: 'prod_003',
        type: 'beanie',
        name: 'Alpine Knit Beanie',
        price: 35.00,
        mainImage: 'assets/img/winter-bundle/beanie.png',
    },
    {
        id: 'prod_004',
        type: 'pants',
        name: 'Utility Cargo Pants',
        price: 120.00,
        mainImage: 'assets/img/winter-bundle/pants1.png',
    },
    {
        id: 'prod_005',
        type: 'tshirt',
        name: 'Base Layer Tee',
        price: 45.00,
        mainImage: 'assets/img/winter-bundle/tshirt2.png',
    },
    {
        id: 'prod_006',
        type: 'sweater',
        name: 'Merino Crew',
        price: 85.00,
        mainImage: 'assets/img/summer-bundle/sweater.png',
    },
];

const categories = [
    "all items", "beanie", "hat", "jacket", "hoodie", 
    "sweater", "tshirt", "pants", "shorts"
];

export default function ItemGrid() {
    const [activeCategory, setActiveCategory] = useState("all items");

    // REFS
    const sectionRef = useRef(null);
    const titleRef = useRef(null); // The big H2
    const optionsRef = useRef(new Map()); // Map to store refs for all buttons

    // ANIMATION STATE
    const isAnimating = useRef(false);
    const flipState = useRef({
        prevCategory: null,
        nextCategory: null,
        titleRect: null,
        targetBtnRect: null
    });

    // 1. HANDLE CATEGORY CLICK (Trigger FLIP Start)
    const handleCategoryChange = (newCategory) => {
        if (activeCategory === newCategory || isAnimating.current) return;

        // A. Record Initial State
        const titleEl = titleRef.current;
        const targetBtnEl = optionsRef.current.get(newCategory);

        if (titleEl && targetBtnEl) {
            isAnimating.current = true;
            flipState.current = {
                prevCategory: activeCategory,
                nextCategory: newCategory,
                titleRect: titleEl.getBoundingClientRect(),
                targetBtnRect: targetBtnEl.getBoundingClientRect(),
            };
        }

        // B. Update State
        setActiveCategory(newCategory);
    };

    // 2. FLIP ANIMATION EXECUTION (Run after DOM update)
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

        // Helper: Get Center Coordinate
        const getCenter = (rect) => ({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });

        const targetBtnCenter = getCenter(state.targetBtnRect); 
        const newTitleCenter = getCenter(newTitleRect);         
        
        const oldTitleCenter = getCenter(state.titleRect);      
        const oldTitleAsBtnCenter = getCenter(oldTitleAsBtnRect); 

        // Calculate Invert (Delta) using CENTERS
        const titleDeltaX = targetBtnCenter.x - newTitleCenter.x;
        const titleDeltaY = targetBtnCenter.y - newTitleCenter.y;
        const titleScale = state.targetBtnRect.width / newTitleRect.width;

        const btnDeltaX = oldTitleCenter.x - oldTitleAsBtnCenter.x;
        const btnDeltaY = oldTitleCenter.y - oldTitleAsBtnCenter.y;
        const btnScale = state.titleRect.width / oldTitleAsBtnRect.width;

        // Apply Instant Transforms (Invert)
        newTitleEl.style.transition = 'none';
        newTitleEl.style.transform = `translate3d(${titleDeltaX}px, ${titleDeltaY}px, 0) scale(${titleScale})`;
        newTitleEl.style.color = '#9ca3af'; 

        oldTitleAsBtnEl.style.transition = 'none';
        oldTitleAsBtnEl.style.transform = `translate3d(${btnDeltaX}px, ${btnDeltaY}px, 0) scale(${btnScale})`;
        oldTitleAsBtnEl.style.color = '#f97316';
        oldTitleAsBtnEl.style.zIndex = '10';

        // Play Animation
        void newTitleEl.offsetHeight; // Force reflow

        const transitionSettings = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), color 0.4s ease';
        
        newTitleEl.style.transition = transitionSettings;
        newTitleEl.style.transform = 'translate3d(0, 0, 0) scale(1)';
        newTitleEl.style.color = ''; 

        oldTitleAsBtnEl.style.transition = transitionSettings;
        oldTitleAsBtnEl.style.transform = 'translate3d(0, 0, 0) scale(1)';
        oldTitleAsBtnEl.style.color = ''; 
        
        // Cleanup
        const timer = setTimeout(() => {
            isAnimating.current = false;
            oldTitleAsBtnEl.style.zIndex = '';
            flipState.current = {};
        }, 600);

        return () => clearTimeout(timer);
    }, [activeCategory]);

    // 3. PARALLAX EFFECT (Updated)
    useEffect(() => {
        const handleScroll = () => {
            // Pause parallax if we are in the middle of a swap animation
            if (!sectionRef.current || !titleRef.current || isAnimating.current) return;
            
            if (window.innerWidth <= 768) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Update only if relevant
            if (rect.top <= viewportHeight && rect.bottom >= 0) {
                const factor = -0.2; 
                
                // Calculate Parallax
                // When rect.top > 0, this is negative (Moves UP / Peeks)
                // When rect.top < 0, this is positive (Moves DOWN)
                let translateY = rect.top * factor;

                // LOCK: If it tries to move down (positive), force it to 0.
                // This ensures it stays fixed in its original position once scrolled past.
                if (translateY > 0) translateY = 0;

                titleRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // FILTER DATA
    const filteredProducts = activeCategory === "all items"
        ? productsData
        : productsData.filter(product => product.type === activeCategory);

    const otherCategories = categories.filter(cat => cat !== activeCategory);

    return (
        <section 
            ref={sectionRef}
            className="item-grid" 
            aria-label="Product Grid"
            data-nav-text="dark"
        >
            <div className="item-grid__container">
                
                <header className="item-grid__header-row">
                    
                    {/* ACTIVE TITLE */}
                    <h2 
                        ref={titleRef}
                        className="item-grid__title-active"
                        data-category={activeCategory} 
                    >
                        {activeCategory}
                    </h2>

                    {/* OPTIONS NAV */}
                    <nav className="item-grid__filter-nav mono">
                        {otherCategories.map((cat) => (
                            <button 
                                key={cat}
                                ref={(el) => optionsRef.current.set(cat, el)}
                                className="item-grid__filter-btn"
                                onClick={() => handleCategoryChange(cat)}
                                aria-label={`Filter by ${cat}`}
                                data-category={cat}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>

                </header>

                <div className="item-grid__grid">
                    {filteredProducts.map((product) => (
                        <article key={product.id} className="item-grid__card">
                            <div className="item-grid__image-wrapper">
                                <img 
                                    src={product.mainImage} 
                                    alt={product.name} 
                                    className="item-grid__image"
                                    loading="lazy"
                                />
                            </div>
                            <div className="item-grid__details">
                                <div className="item-grid__header-details">
                                    <h3 className="item-grid__name">{product.name}</h3>
                                </div>
                                <p className="item-grid__price mono">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className="item-grid__empty">No items found in this category.</p>
                )}

            </div>
        </section>
    );
}