import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ProductCard from './components/ProductCard/ProductCard';

const PRODUCTS = [
  { id: 1, title: "Oversized Hoodie", price: "$59.99" },
  { id: 2, title: "Relaxed Fit Jeans", price: "$69.99" },
  { id: 3, title: "Cropped Puffer Jacket", price: "$89.99" },
];

function App(){
  return(
    <main>
      <Navbar />
      <Hero />

      <section className="content-section">
        <h2>New Arrivals</h2>
        <div className="product-grid">
          {PRODUCTS.map(product => (
            <ProductCard 
              key={product.id}
              title={product.title} 
              price={product.price} 
            />
          ))}
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