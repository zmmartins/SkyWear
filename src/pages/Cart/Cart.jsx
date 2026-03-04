import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import './Cart.css';

export default function Cart() {
    const navigate = useNavigate();
    
    // Pull the data and actions from your global store
    const { suitcase, removeItem } = useCartStore();

    // Calculate the subtotal mathematically
    const subtotal = suitcase.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <main 
            className="cart-page content-section"
            data-nav-text="light"
        >
            <header className="cart-page__header">
                <h2>Your Suitcase</h2>
                <p className="text-muted mono">Review your travel wardrobe</p>
            </header>

            {suitcase.length === 0 ? (
                <div className="cart-page__empty">
                    <p>Your suitcase is currently empty.</p>
                    <button className="btn btn--primary" onClick={() => navigate('/')}>
                        Browse Collections
                    </button>
                </div>
            ) : (
                <div className="cart-page__layout">
                    {/* LEFT: The Items List */}
                    <ul className="cart-page__items" role="list">
                        {suitcase.map((item) => (
                            <li key={`${item.id}-${item.size}`} className="cart-item">
                                <img src={item.mainImage} alt={item.name} className="cart-item__image" />
                                
                                <div className="cart-item__details">
                                    <h3 className="cart-item__name">{item.name}</h3>
                                    <p className="cart-item__meta mono">Size: {item.size}</p>
                                    <p className="cart-item__price mono">${item.price.toFixed(2)}</p>
                                </div>

                                <div className="cart-item__actions">
                                    <span className="cart-item__quantity mono">Qty: {item.quantity}</span>
                                    <button 
                                        className="btn-text" 
                                        onClick={() => removeItem(item.id, item.size)}
                                        style={{ color: '#ef4444', fontSize: '0.8rem' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* RIGHT: The Summary / Checkout Panel */}
                    <aside className="cart-page__summary">
                        <h3>Trip Summary</h3>
                        
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span className="mono">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Cleaning Fee</span>
                            <span className="mono">$15.00</span>
                        </div>
                        
                        <div className="summary-row summary-row--total">
                            <span>Total</span>
                            <span className="mono">${(subtotal + 15).toFixed(2)}</span>
                        </div>

                        <button className="btn btn--primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                            Proceed to Checkout
                        </button>
                    </aside>
                </div>
            )}
        </main>
    );
}