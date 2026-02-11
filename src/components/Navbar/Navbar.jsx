import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
    const navbarRef = useRef(null);
    const [currentSection, setCurrentSection] = useState("INTRO");

    useEffect(() => {
        const handleScroll = () => {
            if (!navbarRef.current) return;
            
            const centerX = window.innerWidth / 2;
            const navbarCenterY = navbarRef.current.offsetHeight / 2;
            
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
            
            // NOTE: You mentioned you inverted the attributes in your HTML,
            // so we keep the logic simple here:
            // if pref is 'dark' -> set color to dark (#111827)
            // if pref is 'light' -> set color to light (#f9fafb)

            let finalColor = "#f9fafb"; 

            if (pref === 'dark') {
                finalColor = "#111827"; 
            } else if (pref === 'light') {
                finalColor = "#f9fafb"; 
            }

            document.documentElement.style.setProperty('--navbar-text-color', finalColor);

            // --- SECTION NAME DETECTION ---
            const centerY = window.innerHeight / 2;
            const centerElements = document.elementsFromPoint(centerX, centerY);
            
            let foundSection = "INTRO";

            for (const el of centerElements) {
                if (el.classList.contains('landing-intro') || el.closest('.landing-intro')) {
                    foundSection = "INTRO";
                    break;
                } else if (el.classList.contains('hero-carousel') || el.closest('.hero-carousel')) {
                    foundSection = "HERO";
                    break;
                } else if (el.classList.contains('individual-items') || el.closest('.individual-items')) {
                    foundSection = "ITEMS";
                    break;
                } else if (el.classList.contains('items-grid') || el.closest('.items-grid')) {
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
    }, []);

    return(
        <header className="navbar" ref={navbarRef}>
            
            {/* LEFT COLUMN */}
            <div className="navbar__col navbar__col--left">
                <span className="navbar__context-menu mono">
                    <span>/</span>
                    {currentSection}
                </span>
            </div>

            {/* CENTER COLUMN */}
            <div className="navbar__col navbar__col--center">
                <div className="navbar__logo">SkyWear</div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="navbar__col navbar__col--right">
                <div className="navbar__actions">
                    {/* Simplified Text Button */}
                    <button className="btn-text">Sign in</button>
                    
                    {/* Cart with Logo Icon + Count */}
                    <button className="btn-cart" aria-label="Cart">
                        <span className="navbar__cart-count mono">0</span>
                        <div className="navbar__cart-icon"></div>
                    </button>
                </div>
            </div>
            
        </header>
    );
}