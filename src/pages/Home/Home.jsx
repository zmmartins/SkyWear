import React from 'react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import LandingHero from '@/features/core/components/LandingHero';
import BundlesCarousel from '@/features/bundles/components/BundlesCarousel';
import ItemsBanner from '@/features/catalog/components/ItemsBanner';
import ItemGrid from '@/features/catalog/components/ItemGrid';

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