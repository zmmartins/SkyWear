import React, { useMemo, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useItemGridAnimations } from '../../hooks/useItemGridAnimations';
import { useCatalogItems } from '../../hooks/useCatalogItems';
import ProductCard from './ProductCard';
import './ItemGrid.css';

const DockGlassLayer = () => (
    <div className="liquid-glass-container dock-glass" aria-hidden="true">
        <div className="liquid-glass__bend"></div>
        <div className="liquid-glass__face"></div>
        <div className="liquid-glass__edge"></div>
    </div>
);

export default function ItemGrid() {
    // 1. Data Layer
    const { products, categories, status, error } = useCatalogItems();
    const location = useLocation();

    // 2. Animation & Interaction Layer
    const {
        activeCategory,
        handleCategoryChange,
        sectionRef,
        headerRef,
        titleRef,
        optionsRef
    } = useItemGridAnimations("all items");

    // 3. Smart hash scrolling 
    // waits for the API to finish before attempting to scroll.
    useEffect(() => {
        if (status === "ready" && location.hash === "#catalog"){
            setTimeout(() => {
                const catalogSection = document.getElementById("catalog");
                if(catalogSection){

                    document.documentElement.dataset.navScrolling = "true";
                    if(window.navScrollTimeout) clearTimeout(window.navScrollTimeout);
                    window.navScrollTimeout = setTimeout(() => {
                        document.documentElement.dataset.navScrolling = "false";
                    }, 1200);
                    
                    catalogSection.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    }, [status, location.hash]);

    // 4. Derived State (Memorized for performance)
    const filteredProducts = useMemo(() => {
        return activeCategory === "all items"
            ? products
            : products.filter(product => product.rootType === activeCategory);
    }, [products, activeCategory]);

    const availableCategories = useMemo(() => {
        return categories.filter(cat => cat !== activeCategory);
    }, [categories, activeCategory]);

    // 5. Conditional Rendering (Handling Async States)
    if (status === 'loading') {
        return <section className="item-grid item-grid--loading" aria-busy="true">Loading catalog...</section>;
    }

    if (status === 'error') {
        return <section id="catalog" className="item-grid item-grid--error">{error}</section>;
    }

    return (
        <section 
            ref={sectionRef}
            className="item-grid" 
            aria-label="Product Catalog"
            data-nav-text="dark"
            id="catalog"
        >
            <div className="item-grid__container">
                
                <header ref={headerRef} className="item-grid__header-row">
                    
                    <DockGlassLayer/>

                    <div className="item-grid__title-wrapper">
                        <h2 
                            ref={titleRef}
                            className="item-grid__title-active"
                            data-category={activeCategory} 
                        >
                            {activeCategory}
                        </h2>
                    </div>
                    
                    <div className="item-grid__nav-wrapper">
                        <nav className="item-grid__filter-nav mono" aria-label="Catalog categories">
                            {availableCategories.map((cat) => (
                                <button 
                                    key={cat}
                                    ref={(el) => optionsRef.current.set(cat, el)}
                                    className="item-grid__filter-btn"
                                    onClick={() => handleCategoryChange(cat)}
                                    aria-label={`Filter by ${cat}`}
                                    aria-pressed={activeCategory === cat}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </div>
                </header>

                <div className="item-grid__grid" role="list">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} role="listitem">
                                <ProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <p className="item-grid__empty">No items found in this category.</p>
                    )}
                </div>

            </div>
        </section>
    );
}