import React from "react";

export default function Navbar(){
    return(
        <header className="navbar">
            <div className="navbar__logo">SkyWear</div>
            <div className="navbar__actions">
                <button className="btn btn--ghost">Sign in</button>
                <button className="btn btn--primary">Cart (0)</button>
            </div>
        </header>
    );
}