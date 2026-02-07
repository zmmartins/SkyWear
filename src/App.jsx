import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollReveal from './components/ScrollReveal';
import IndividualItems from './components/IndividualItems';
import ProductCard from './components/ProductCard';

const PRODUCTS = [
  { id: 1, title: "Oversized Hoodie", price: "$59.99" },
  { id: 2, title: "Relaxed Fit Jeans", price: "$69.99" },
  { id: 3, title: "Cropped Puffer Jacket", price: "$89.99" },
];

function App(){
  return(
    <main>
      <Navbar />

      {/* The Artsy Scroll Transition Section */}
      <ScrollReveal>
          <Hero />
          <IndividualItems />
      </ScrollReveal>
    </main>
  );
}

export default App;