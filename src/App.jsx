import React from 'react';
import Navbar from './components/Navbar';
import BundlesCarousel from './components/BundlesCarousel';
import ScrollReveal from './components/ScrollReveal';
import ItemsBanner from './components/ItemsBanner';
import LandingHero from "./components/LandingHero";
import ItemGrid from "./components/ItemGrid";

function App(){
  return(
    <main>
      <Navbar />
      
      {/* revealStart={0.6} -> Text slides out until 60% scroll.
        autoComplete={true} -> Once we hit 60%, the page takes control 
                               and smooth-scrolls to the end of the reveal.
      */}
      <ScrollReveal 
          revealStart={0.3}     // Starts opening when you are 30% down
          collapseStart={0.9}   // Starts closing automatically only when you are back to 70%
          autoComplete={true}
      >
          <LandingHero />
          <BundlesCarousel />
      </ScrollReveal>
      
      <ItemsBanner />
      <ItemGrid />

    </main>
  );
}

export default App;