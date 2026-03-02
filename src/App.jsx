import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';

function App(){
  return(
    <>
      {/* Navbar stays here because it should be visible on ALL future pages */}
      <Navbar />
      <Home />
    </>
  );
}

export default App;