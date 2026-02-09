import React, { memo } from "react";

/**
 * OPTIMIZATION: Image Loading Strategy
 * ------------------------------------
 * Calculates attributes to prioritize the "Hero" image (LCP) 
 * while lazy-loading secondary images to save bandwidth.
 * * @param {Object} img - The image data object
 * @param {boolean} isActive - Is this slide currently visible?
 */
const getImgAttributes = (img, isActive) => {
    // We only eager load if the slide is active AND the image is marked important in data
    const isPriority = img?.priority || img?.eager;
    const shouldPrioritize = isActive && isPriority;

    return {
        decoding: "async",
        // 'eager' loads immediately (good for LCP), 'lazy' waits until near viewport
        loading: shouldPrioritize ? "eager" : "lazy", 
        // Hints browser to download this specific resource before others
        fetchPriority: shouldPrioritize ? "high" : "auto", 
    };
};

/**
 * COMPONENT: HeroSlide
 * ------------------------------------
 * Represents a single slide in the carousel.
 * Handles the "Liquid Glass" orb visuals and the "Exploding" clothing stack.
 * * @param {Object} slide - Data for text, theme, and images
 * @param {string} className - CSS classes (managed by parent for animations)
 * @param {Array} orbSizes - Array of percentages for the background decorative orbs
 * @param {boolean} isActive - Toggles accessibility and interaction
 */
const HeroSlide = ({ 
    slide = {}, 
    className = "", 
    orbSizes = [], 
    isActive = false 
}) => {
    // 1. Safe Destructuring with Defaults
    const {
        theme = "winter", // Fallback theme
        badge = "New Arrival",
        title = "Untitled",
        pieces = 0,
        price = "$0.00",
        stack = [] 
    } = slide;

    return (
        <article 
            className={className}
            // A11y: Hide non-active slides from screen readers
            aria-hidden={!isActive}
            // A11y: Only allow tabbing into the active slide
            tabIndex={isActive ? 0 : -1} 
        >
            {/* Background Gradient Layer */}
            <div className="slide-bg" data-theme={theme} />

            <div className="carousel__layout">
                
                {/* 2. Content Info Panel */}
                <div className="carousel__info">
                    <p className="carousel__badge">{badge}</p>
                    <h1 className="carousel__title">{title}</h1>

                    <div className="carousel__meta">
                        <span className="carousel__pieces">
                            <span className="num_pieces mono">{pieces}</span> pieces
                        </span>
                        <span className="carousel__meta-dot">•</span>
                        <span className="carousel__price mono">{price}</span>
                    </div>
                </div>

                {/* 3. Art & Visuals (The Orb) */}
                <div className="carousel__art">
                    
                    {/* A. Decorative Background Orbs */}
                    {orbSizes.map((sizePct, i) => (
                        <div 
                            key={`orb-${i}`} 
                            className="carousel__art-extra-orb" 
                            style={{ height: `${sizePct}%` }} 
                        />
                    ))}

                    {/* B. The Clothing Stack (Images inside the orb) */}
                    <div className="outfit-stack">
                        {stack.map((layer, layerIndex) => (
                            <div 
                                key={layer.key || `layer-${layerIndex}`} 
                                className={layer.className}
                            >
                                {/* Safe map in case 'images' is undefined */}
                                {layer.images?.map((img, imgIndex) => {
                                    if (!img?.src) return null;
                                    
                                    return (
                                        <img
                                            key={img.id || `img-${layerIndex}-${imgIndex}`}
                                            src={img.src}
                                            className={img.className}
                                            alt={img.alt || ""}
                                            {...getImgAttributes(img, isActive)}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
};

// 4. Optimization: Memoize to prevent re-renders of off-screen slides
export default memo(HeroSlide);