import React from 'react';

/**
 * COMPONENT: ProductCard
 * A pure, presentational component for displaying a single catalog item.
 */
export default function ProductCard({ product }) {
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
                <p className="item-grid__price mono">
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </article>
    );
}