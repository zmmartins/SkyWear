import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavbarTheme } from "./hooks/useNavbarTheme";
import { useCartStore } from "@/store/cartStore";
import "./Navbar.css";

/**
 * LiquidGlassLayers renders the hidden DOM structure required for the 
 * SVG-filtered fractal noise distortion effect on hover/active states.
 */
const LiquidGlassLayers = () => (
    <div className="liquid-glass-container" aria-hidden="true">
        <div className="liquid-glass__bend"></div>
        <div className="liquid-glass__face"></div>
        <div className="liquid-glass__edge"></div>
    </div>
);

const SECTIONS = [
    { id: "INTRO", label: "Intro", selector: ".landing-hero" },
    { id: "BUNDLES", label: "Bundles", selector: ".bundles-carousel" },
    { id: "ITEMS", label: "Items", selector: ".items-banner" }
];

export default function Navbar() {
    const { navbarRef, currentSection } = useNavbarTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Calculation of the total quantity
    const cartItemCount = useCartStore((state) =>
        state.suitcase.reduce((total, item) => total + item.quantity, 0)
    );

    // Ensure we clean up the scroll timeout if the component unmounts
    useEffect(() => {
        return () => {
            if (window.navScrollTimeout) clearTimeout(window.navScrollTimeout);
        };
    }, []);

    /**
     * Handles custom smooth scrolling to sections, including setting
     * a temporary flag to prevent the ScrollReveal component from hijacking it.
     */
    const executeScroll = (sec) => {
        // --- 1. SET "DO NOT DISTURB" FLAG FOR SCROLL REVEAL ---
        document.documentElement.dataset.navScrolling = 'true';
        
        if (window.navScrollTimeout) clearTimeout(window.navScrollTimeout);
        
        window.navScrollTimeout = setTimeout(() => {
            document.documentElement.dataset.navScrolling = 'false';
        }, 1200); 

        // --- 2. EXECUTE SCROLL ---
        if (sec.id === "INTRO" || sec.id === "BUNDLES") {
            const revealTrack = document.querySelector('.scroll-reveal');
            
            if (revealTrack) {
                const rect = revealTrack.getBoundingClientRect();
                const absoluteTop = window.scrollY + rect.top;
                
                let targetY = absoluteTop;
                if (sec.id === "BUNDLES") {
                    const viewportHeight = window.innerHeight;
                    targetY = absoluteTop + rect.height - viewportHeight;
                }
                
                window.scrollTo({ top: targetY, behavior: 'smooth' });
                return;
            }
        }

        const element = document.querySelector(sec.selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleMenuClick = (sec) => {
        setIsMenuOpen(false);
        if(location.pathname.includes('/cart')){
            navigate('/', { state: { scrollTo: sec.id } });
        }
        else{
            executeScroll(sec);
        }
    }

    useEffect(() => {
        if (location.pathname === '/' && location.state?.scrollTo){
            const sec = SECTIONS.find(s => s.id === location.state.scrollTo);
            if (sec) {
                setTimeout(() => {
                    executeScroll(sec);
                }, 100);
            }

            navigate('/', { replace: true, state: {} });
        }
    }, [location, navigate]);

    return(
        <header className="navbar" ref={navbarRef}>
            <div className="navbar__bg"></div>
            
            {/* LEFT COLUMN */}
            <div className="navbar__col navbar__col--left">
                {isMenuOpen && 
                    <div 
                        className="navbar__modal-overlay" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                }

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
                            {SECTIONS.filter(sec => sec.id !== currentSection).map(sec => (
                                <button 
                                    key={sec.id} 
                                    className="navbar__modal-btn mono"
                                    onClick={() => handleMenuClick(sec)}
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
                    
                    <button 
                        className="btn-cart" 
                        aria-label="Cart"
                        onClick={() => navigate('/cart')}
                    >
                        <LiquidGlassLayers />
                        <div className="btn-content" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span className="navbar__cart-count mono">{ cartItemCount }</span>
                            {/* Logo path adjusted to match absolute structure if needed, or handled via CSS */}
                            <div className="navbar__cart-icon"></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* SVG FILTER FOR LIQUID GLASS EFFECT */}
            <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <filter id="glass-blur" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox">
                    <feTurbulence type="fractalNoise" baseFrequency="0.003 0.007" numOctaves="1" result="turbulence" />
                    <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="200" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>
        </header>
    );
}