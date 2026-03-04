import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import Home from '@/pages/Home/Home';
import Cart from '@/pages/Cart/Cart'; 

const App = () => {
  // Vite automatically injects the base path you defined in vite.config.js
  // If you are running locally, this is usually '/'. 
  // If deployed to GitHub pages, it will be '/SkyWear/'.
  const base = import.meta.env.BASE_URL;

  return (
    <Router basename={base}>
      <MainLayout>
        <Routes>
          {/* The Home Page */}
          <Route path="/" element={<Home />} />
          
          {/* The Suitcase/Cart Page */}
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;