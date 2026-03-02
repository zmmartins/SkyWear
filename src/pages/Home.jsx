import React from 'react';
import ScrollReveal from '../components/ScrollReveal/ScrollReveal';
import LandingHero from '../components/LandingHero/LandingHero';
import BundlesCarousel from '../components/BundlesCarousel/BundlesCarousel';
import ItemsBanner from '../components/ItemsBanner/ItemsBanner';
import ItemGrid from '../components/ItemGrid/ItemGrid';
import './Home.css';

export default function Home() {
  return (
    <main className="page-home">
      <ScrollReveal 
          revealStart={0.3}    
          collapseStart={0.9}  
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