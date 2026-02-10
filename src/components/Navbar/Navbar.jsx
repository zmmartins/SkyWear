import React, { useEffect, useRef } from "react";
import "./Navbar.css";

export default function Navbar() {
    const navbarRef = useRef(null);

    useEffect(() => {
        // --- DYNAMIC COLOR LOGIC ---
        const handleScroll = () => {
            if (!navbarRef.current) return;
            
            // 1. DEFINE PROBE POINTS
            // We check the pixels directly under the Logo (Left) and the Actions (Right)
            // This ensures we only switch colors when the background *at that spot* changes.
            const y = navbarRef.current.offsetHeight / 2; 
            const xLeft = 40; // Approx logo center
            const xRight = window.innerWidth - 40; // Approx actions center
            
            // 2. HELPER: FIND COLOR PREFERENCE
            // Looks through the stack of elements at (x, y) for a data-nav-text attribute
            const getColorAtPoint = (x, y) => {
                const elements = document.elementsFromPoint(x, y);
                
                for (const el of elements) {
                    // Ignore the navbar itself
                    if (navbarRef.current.contains(el) || el === navbarRef.current) continue;
                    
                    // Look for the closest section with a preference
                    const section = el.closest('[data-nav-text]');
                    if (section) {
                        return section.getAttribute('data-nav-text');
                    }
                }
                return null; // No preference found
            };

            const leftPref = getColorAtPoint(xLeft, y);
            const rightPref = getColorAtPoint(xRight, y);

            // 3. DECIDE COLOR
            // Logic: 
            // - If EITHER side is over a "light" background (needs dark text), use Dark.
            // - Otherwise, default to White.
            // (You can invert this logic depending on which is the "safer" default)
            let finalColor = "var(--color-text)"; // Default White/Light Grey

            if (leftPref === 'dark' || rightPref === 'dark') {
                finalColor = "#000000"; // Force Black
            } else if (leftPref === 'light' || rightPref === 'light') {
                finalColor = "#f9fafb"; // Force White
            }

            // 4. UPDATE CSS VARIABLE
            document.documentElement.style.setProperty('--navbar-text-color', finalColor);
        };

        // --- PERFORMANCE OPTIMIZATION ---
        // Throttled scroll listener
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
        
        // Initial check on mount
        handleScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return(
        <header className="navbar" ref={navbarRef}>
            <div className="navbar__logo">SkyWear</div>
            <div className="navbar__actions">
                <button className="btn btn--ghost">Sign in</button>
                <button className="btn btn--primary">Cart (0)</button>
            </div>
        </header>
    );
}