import React from 'react';
import { useCartStore } from "@/store/cartStore";

const LiquidGlassLayers = () => (
    <div className="liquid-glass-container" aria-hidden="true">
        <div className="liquid-glass__bend"></div>
        <div className="liquid-glass__face"></div>
        <div className="liquid-glass__edge"></div>
    </div>
)

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
                
                {/* SOLID PILL: Price (Stays exactly as it was) */}
                <p className="item-grid__price mono">
                    ${product.price.toFixed(2)}
                </p>

                {/* LIQUID GLASS: Quick Add Button */}
                <button
                    className="mono item-grid__add-btn"
                    onClick={handleQuickAdd}
                    aria-label={`Add ${product.name} to suitcase`}
                >
                    <LiquidGlassLayers/>
                    {/* The btn-content class ensures the + sign sits above the glass */}
                    <span className='btn-content'>+</span>
                </button>
            </div>

            <div className="item-grid__details">
                <h3 className="item-grid__name">{product.name}</h3>
            </div>
        </article>
    );
}