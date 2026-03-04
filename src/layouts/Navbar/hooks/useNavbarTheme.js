import { useEffect, useState, useRef } from "react";

/**
 * Custom hook to manage the Navbar's scroll-based theming and section tracking.
 * It calculates which section is in the center of the viewport and updates 
 * the CSS variable '--navbar-text-color' accordingly.
 *
 * @returns {Object} { navbarRef, currentSection }
 */
export const useNavbarTheme = () => {
    const navbarRef = useRef(null);
    const [currentSection, setCurrentSection] = useState("INTRO");

    useEffect(() => {
        const handleScroll = () => {
            if (!navbarRef.current) return;
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const navbarCenterY = navbarRef.current.offsetHeight / 2;
            
            // 1. Detect Theme Preference (Dark/Light) underneath the Navbar
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
            const finalColor = pref === 'dark' ? "#111827" : "#f9fafb";
            document.documentElement.style.setProperty('--navbar-text-color', finalColor);

            // 2. Detect Active Section in the center of the screen
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

        // requestAnimationFrame wrapper for buttery smooth scroll performance
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
        
        handleScroll(); // Fire once on mount

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return { navbarRef, currentSection };
};