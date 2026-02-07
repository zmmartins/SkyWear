import React from 'react';
import './IndividualItems.css';

export default function IndividualItems() {
    return (
        <section className="individual-items" aria-label="Individual Items Collection">
            <div className="individual-items__container">
                <header className="individual-items__header">
                    <h2 className="individual-items__title">
                        Build Your Own Style
                    </h2>
                    
                    <div className="individual-items__content">
                        {/* Decorative Arrow - aria-hidden to hide from screen readers */}
                        <div className="individual-items__arrow-wrapper" aria-hidden="true">
                            <svg 
                                className="individual-items__arrow" 
                                viewBox="0 0 24 100" 
                                preserveAspectRatio="none"
                                focusable="false"
                            >
                                <path 
                                    vectorEffect="non-scaling-stroke" 
                                    d="M12 0 V100 M0 90 L12 100 L24 90" 
                                />
                            </svg>
                        </div>

                        <p className="individual-items__text mono">
                            Not looking for a pre-made bundle? Explore our collection of 
                            individual pieces. Mix, match, and reserve exactly what you 
                            need for your trip.
                        </p>
                    </div>
                </header>
            </div>
        </section>
    );
}