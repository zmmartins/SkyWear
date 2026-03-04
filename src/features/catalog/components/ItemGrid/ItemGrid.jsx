import React, { useMemo } from 'react';
import { useItemGridAnimations } from '../../hooks/useItemGridAnimations';
import { useCatalogItems } from '../../hooks/useCatalogItems';
import ProductCard from './ProductCard';
import './ItemGrid.css';

export default function ItemGrid() {
    // 1. Data Layer
    const { products, categories, status, error } = useCatalogItems();
    
    // 2. Animation & Interaction Layer
    const {
        activeCategory,
        handleCategoryChange,
        sectionRef,
        titleRef,
        optionsRef
    } = useItemGridAnimations("all items");

    // 3. Derived State (Memoized for performance)
    const filteredProducts = useMemo(() => {
        return activeCategory === "all items"
            ? products
            : products.filter(product => product.type === activeCategory);
    }, [products, activeCategory]);

    const availableCategories = useMemo(() => {
        return categories.filter(cat => cat !== activeCategory);
    }, [categories, activeCategory]);

    // 4. Conditional Rendering (Handling Async States)
    if (status === 'loading') {
        return <section className="item-grid item-grid--loading" aria-busy="true">Loading catalog...</section>;
    }

    if (status === 'error') {
        return <section className="item-grid item-grid--error">{error}</section>;
    }

    return (
        <section 
            ref={sectionRef}
            className="item-grid" 
            aria-label="Product Catalog"
            data-nav-text="dark"
        >
            <div className="item-grid__container">
                
                <header className="item-grid__header-row">
                    <h2 
                        ref={titleRef}
                        className="item-grid__title-active"
                        data-category={activeCategory} 
                    >
                        {activeCategory}
                    </h2>

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