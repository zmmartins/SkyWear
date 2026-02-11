import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollReveal from './components/ScrollReveal';
import IndividualItems from './components/IndividualItems';
import LandingIntro from "./components/LandingIntro";
import IndividualItemsGrid from "./components/IndividualItemsGrid";

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
          <LandingIntro />
          <Hero />
      </ScrollReveal>
      
      <IndividualItems />
      <IndividualItemsGrid />

    </main>
  );
}

export default App;