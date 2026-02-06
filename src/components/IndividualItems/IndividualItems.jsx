import React from 'react';
import './IndividualItems.css';

export default function IndividualItems() {
    return (
        <section className="individual-items">
            <div className="individual-items__container">
                <header className="individual-items__header">
                    <h2 className="individual-items__title">
                        Build Your Own Style
                    </h2>
                    <p className="individual-items__text mono">
                        Not looking for a pre-made bundle? Explore our collection of 
                        individual pieces. Mix, match, and reserve exactly what you 
                        need for your trip.
                    </p>
                    <button className="btn btn--primary" style={{ marginTop: '2rem' }}>
                        Browse All Items
                    </button>
                </header>
            </div>
        </section>
    );
}