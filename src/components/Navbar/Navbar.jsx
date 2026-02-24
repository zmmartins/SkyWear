import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";

const LiquidGlassLayers = () => (
    <div className="liquid-glass-container" aria-hidden="true">
        <div className="liquid-glass__bend"></div>
        <div className="liquid-glass__face"></div>
        <div className="liquid-glass__edge"></div>
    </div>
);

export default function Navbar() {
    const navbarRef = useRef(null);
    const [currentSection, setCurrentSection] = useState("INTRO");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const sections = [
        { id: "INTRO", label: "Intro", selector: ".landing-hero" },
        { id: "BUNDLES", label: "Bundles", selector: ".bundles-carousel" },
        { id: "ITEMS", label: "Items", selector: ".items-banner" }
    ];

    const scrollToSection = (sec) => {
        // --- 1. SET "DO NOT DISTURB" FLAG FOR SCROLL REVEAL ---
        document.documentElement.dataset.navScrolling = 'true';
        
        if (window.navScrollTimeout) {
            clearTimeout(window.navScrollTimeout);
        }
        
        // Remove the flag after the smooth scroll is expected to finish
        window.navScrollTimeout = setTimeout(() => {
            document.documentElement.dataset.navScrolling = 'false';
        }, 1200); 

        // --- 2. EXECUTE SCROLL ---
        if (sec.id === "INTRO" || sec.id === "BUNDLES") {
            const revealTrack = document.querySelector('.scroll-reveal');
            
            if (revealTrack) {
                const rect = revealTrack.getBoundingClientRect();
                const absoluteTop = window.scrollY + rect.top;
                
                if (sec.id === "INTRO") {
                    window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
                } else if (sec.id === "BUNDLES") {
                    const viewportHeight = window.innerHeight;
                    const targetY = absoluteTop + rect.height - viewportHeight;
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
                
                setIsMenuOpen(false);
                return;
            }
        }

        const element = document.querySelector(sec.selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMenuOpen(false);
    };

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

            let finalColor = "#f9fafb"; 

            if (pref === 'dark') {
                finalColor = "#111827"; 
            } else if (pref === 'light') {
                finalColor = "#f9fafb"; 
            }

            document.documentElement.style.setProperty('--navbar-text-color', finalColor);

            const centerY = window.innerHeight / 2;
            const centerElements = document.elementsFromPoint(centerX, centerY);
            
            let foundSection = "INTRO";

            for (const el of centerElements) {
                if (el.classList.contains('landing-hero') || el.closest('.landing-hero')) {
                    foundSection = "INTRO";
                    break;
                } else if (el.classList.contains('bundles-carousel') || el.closest('.bundles-carousel')) {
                    foundSection = "BUNDLES";
                    break;
                } else if (el.classList.contains('items-banner') || el.closest('.items-banner')) {
                    foundSection = "ITEMS";
                    break;
                } else if (el.classList.contains('item-grid') || el.closest('.item-grid')) {
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
            
            <div className="navbar__bg"></div>
            
            {/* LEFT COLUMN */}
            <div className="navbar__col navbar__col--left">
                {isMenuOpen && (
                    <div 
                        className="navbar__modal-overlay" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                <div className={`navbar__context-menu-wrapper ${isMenuOpen ? 'is-open' : ''}`}>
                    <LiquidGlassLayers />
                    
                    <span 
                        className="navbar__context-menu mono"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="btn-content">/&nbsp;{currentSection}</span>
                    </span>

                    <div className="navbar__modal-dropdown">
                        <div className="navbar__modal-dropdown-inner">
                            {sections
                                .filter(sec => sec.id !== currentSection) 
                                .map(sec => (
                                    <button 
                                        key={sec.id} 
                                        className="navbar__modal-btn mono"
                                        onClick={() => scrollToSection(sec)}
                                        tabIndex={isMenuOpen ? 0 : -1} 
                                    >
                                        <LiquidGlassLayers/>
                                        <span className="btn-content">{sec.label}</span>
                                    </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER COLUMN */}
            <div className="navbar__col navbar__col--center">
                <div className="navbar__logo">SkyWear</div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="navbar__col navbar__col--right">
                <div className="navbar__actions">
                    <button className="btn-text">
                        <LiquidGlassLayers />
                        <span className="btn-content">Sign in</span>
                    </button>
                    
                    <button className="btn-cart" aria-label="Cart">
                        <LiquidGlassLayers />
                        <div className="btn-content" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span className="navbar__cart-count mono">0</span>
                            <div className="navbar__cart-icon"></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* --- SVG FILTER FOR LIQUID GLASS EFFECT --- */}
            <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <filter
                    id="glass-blur"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    filterUnits="objectBoundingBox"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.003 0.007"
                        numOctaves="1"
                        result="turbulence"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="turbulence"
                        scale="200"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>
            
        </header>
    );
}