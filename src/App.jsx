import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollReveal from './components/ScrollReveal';
import IndividualItems from './components/IndividualItems';
import LandingIntro from "./components/LandingIntro";

function App(){
  return(
    <main>
      <Navbar />
      
      {/* revealStart={0.6} -> Text slides out until 60% scroll.
        autoComplete={true} -> Once we hit 60%, the page takes control 
                               and smooth-scrolls to the end of the reveal.
      */}
      <ScrollReveal 
          revealStart={0.3} 
          autoComplete={true} 
          duration={1200} /* Slower, more dramatic (1.2 seconds) */
      >
        <LandingIntro />
        <Hero/>
      </ScrollReveal>
      
      <IndividualItems />

    </main>
  );
}

export default App;