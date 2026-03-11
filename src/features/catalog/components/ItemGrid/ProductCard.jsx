import React, { useState } from 'react';
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from 'react-router-dom';

const LiquidGlassLayers = () => (
    <div className="liquid-glass-container" aria-hidden="true">
        <div className="liquid-glass__bend"></div>
        <div className="liquid-glass__face"></div>
        <div className="liquid-glass__edge"></div>
    </div>
)

export default function ProductCard({ product }) {
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.suitcase) || [];
    const navigate = useNavigate();

    const cartQuantity = cartItems.reduce((total, item) => {
        if(item.id === product.id || item.id_prod === product.id){
            return total + (item.quantity || 1);
        }
        return total;
    }, 0);

    const [orbs, setOrbs] = useState([]);

    const handleQuickAdd = (e) => {
        e.stopPropagation();
        addItem(product, "M");

        const newOrb = { id: Date.now(), x: '50%', y: '50%' };
        setOrbs((prev) => [...prev, newOrb]);

        setTimeout(() => {
            setOrbs((prev) => prev.filter((orb) => orb.id !== newOrb.id));
        }, 700);
    };

    return (
        <article className="item-grid__card">
            <div className="item-grid__image-wrapper">
                {/* Persistent Cart Quantity Badge */}
                {cartQuantity > 0 && (
                    <button 
                        className="item-grid__cart-badge mono"
                        aria-label={`View ${cartQuantity} items in cart`}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/cart');
                        }}
                    >
                        <span>{cartQuantity}</span>
                        <span className="item-grid__badge-logo" aria-hidden="true"></span>
                    </button>
                )}

                {/* Expanding Orb */}
                {orbs.map((orb) => (
                    <div 
                        key={orb.id} 
                        className="item-grid__orb"
                        style={{ 
                            '--click-x': orb.x,
                            '--click-y': orb.y
                        }}
                    >
                        <LiquidGlassLayers />

                        <div className="item-grid__orb-particles">
                            <span style={{"--angle": "0deg", "--dist": "35px"}}></span>
                            <span style={{"--angle": "60deg", "--dist": "45px"}}></span>
                            <span style={{"--angle": "120deg", "--dist": "38px"}}></span>
                            <span style={{"--angle": "180deg", "--dist": "42px"}}></span>
                            <span style={{"--angle": "240deg", "--dist": "36px"}}></span>
                            <span style={{"--angle": "300deg", "--dist": "44px"}}></span>
                        </div>

                        <div className="item-grid__orb-logo"></div>
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
                    ${product.price.toFixed(2)} / day
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