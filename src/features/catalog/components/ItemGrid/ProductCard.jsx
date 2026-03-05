import React, { useState } from 'react';
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
    const [orbs, setOrbs] = useState([]);

    const handleQuickAdd = (e) => {
        e.stopPropagation();
        addItem(product, "M");

        const buttonRect = e.currentTarget.getBoundingClientRect();
        const wrapperRect = e.currentTarget.closest('.item-grid__image-wrapper').getBoundingClientRect();
        
        const x = (buttonRect.left + buttonRect.width / 2) - wrapperRect.left;
        const y = (buttonRect.top + buttonRect.height / 2) - wrapperRect.top*2;

        const newOrb = { id: Date.now(), x, y };
        setOrbs((prev) => [...prev, newOrb]);

        setTimeout(() => {
            setOrbs((prev) => prev.filter((orb) => orb.id !== newOrb.id));
        }, 700);
    };

    return (
        <article className="item-grid__card">
            <div className="item-grid__image-wrapper">
                
                {/* --- UPDATED: Inject Liquid Glass into the Orb --- */}
                {orbs.map((orb) => (
                    <div 
                        key={orb.id} 
                        className="item-grid__orb"
                        style={{ 
                            '--click-x': `${orb.x}px`,
                            '--click-y': `${orb.y}px`
                        }}
                    >
                        <LiquidGlassLayers />
                    </div>
                ))}

                <img 
                    src={product.mainImage} 
                    alt={`Image of ${product.name}`} 
                    className="item-grid__image"
                    loading="lazy"
                    decoding="async"
                />
                
                <p className="item-grid__price mono">
                    ${product.price.toFixed(2)}
                </p>

                <button
                    className="mono item-grid__add-btn"
                    onClick={handleQuickAdd}
                    aria-label={`Add ${product.name} to suitcase`}
                >
                    <LiquidGlassLayers/>
                    <span className='btn-content'>+</span>
                </button>
            </div>

            <div className="item-grid__details">
                <h3 className="item-grid__name">{product.name}</h3>
            </div>
        </article>
    );
}