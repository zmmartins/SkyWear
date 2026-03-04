import React from 'react';
import { useCartStore } from "@/store/cartStore";

/**
 * COMPONENT: ProductCard
 * A pure, presentational component for displaying a single catalog item.
 * Wired up to the global suitcase store.
 */
export default function ProductCard({ product }) {
    const addItem = useCartStore((state) => state.addItem);

    const handleQuickAdd = (e) => {
        e.stopPropagation();
        addItem(product, "M");
    };

    return (
        <article className="item-grid__card">
            <div className="item-grid__image-wrapper">
                <img 
                    src={product.mainImage} 
                    alt={`Image of ${product.name}`} 
                    className="item-grid__image"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="item-grid__details">
                <h3 className="item-grid__name">{product.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <p className="item-grid__price mono">
                        ${product.price.toFixed(2)}
                    </p>

                    <button
                        className="btn btn--primary mono"
                        onClick={handleQuickAdd}
                        aria-label={`Add ${product.name} to suitcase`}
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: 'bold' }}
                    >
                        + Add
                    </button>
                </div>
            </div>
        </article>
    );
}