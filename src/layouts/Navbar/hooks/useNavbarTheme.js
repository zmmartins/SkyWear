import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom"; 

export const useNavbarTheme = () => {
    const navbarRef = useRef(null);
    const [currentSection, setCurrentSection] = useState("INTRO");
    const location = useLocation(); 

    useEffect(() => {
        const isCartPage = location.pathname.includes('/cart');

        const handleScroll = () => {
            if (!navbarRef.current) return;
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const navbarCenterY = navbarRef.current.offsetHeight / 2;
            
            // ==========================================================
            // 1. THEME DETECTION (Runs on EVERY page automatically)
            // ==========================================================
            const getNavTextSetting = (x, y) => {
                const elements = document.elementsFromPoint(x, y);
                for (const el of elements) {
                    if (navbarRef.current.contains(el) || el === navbarRef.current) continue;
                    const section = el.closest('[data-nav-text]');
                    if (section) return section.getAttribute('data-nav-text');
                }
                return null;
            };

            const pref = getNavTextSetting(centerX, navbarCenterY);
            // Default to light text if no attribute is found, since the global background is dark
            const finalColor = pref === 'dark' ? "#111827" : "#f9fafb";
            document.documentElement.style.setProperty('--navbar-text-color', finalColor);

            // ==========================================================
            // 2. SECTION NAMING
            // ==========================================================
            // If we are on the Cart page, force the label and skip the rest
            if (isCartPage) {
                setCurrentSection("CART");
                return; 
            }

            // Otherwise, we are on the Home page, so detect the active section
            const centerElements = document.elementsFromPoint(centerX, centerY);
            let foundSection = "INTRO";

            for (const el of centerElements) {
                if (el.classList.contains('landing-hero') || el.closest('.landing-hero')) {
                    foundSection = "INTRO";
                    break;
                } else if (el.classList.contains('bundles-carousel') || el.closest('.bundles-carousel')) {
                    foundSection = "BUNDLES";
                    break;
                } else if (el.classList.contains('items-banner') || el.closest('.items-banner') || el.classList.contains('item-grid') || el.closest('.item-grid')) {
                    foundSection = "ITEMS";
                    break;
                }
            }
            
            setCurrentSection(prev => prev !== foundSection ? foundSection : prev);
        };

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        
        handleScroll(); 

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [location.pathname]); 

    return { navbarRef, currentSection };
};