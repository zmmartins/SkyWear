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

      <LandingIntro/>

      <Hero />
      <IndividualItems />

    </main>
  );
}

export default App;