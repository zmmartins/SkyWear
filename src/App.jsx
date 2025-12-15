import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';

function App(){
  return(
    <main>
      <Navbar />
      <Hero />

      {/* Static Content Section */}
      <section className="content-section">
        <h2>New Arrivals</h2>
        <div className="product-grid">
          <article className="product-card">
            <div className="product-card__img"></div>
            <h3>Oversized Hoodie</h3>
            <p>$59.99</p>
          </article>
          <article className="product-card">
            <div className="product-card__img"></div>
            <h3>Relaxed Fit Jeans</h3>
            <p>$69.99</p>
          </article>
          <article className="product-card">
            <div className="product-card__img"></div>
            <h3>Cropped Puffer Jacket</h3>
            <p>$89.99</p>
          </article>
        </div>
      </section>

      <section className="content-section" id="sale">
        <h2>On Sale</h2>
        <p className="text-muted">Later you can render real products here.</p>
      </section>
    </main>
  );
}

export default App;