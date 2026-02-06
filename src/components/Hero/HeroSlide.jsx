import React, { memo } from "react";

/**
 * Determines image loading strategy.
 * We only "eager" load images if they are marked as priority AND the slide is currently active.
 */
function getImgProps(img = {}, isActive) {
    const isPriority = img.priority || img.eager;
    const shouldEagerLoad = isActive && isPriority;

    return {
        decoding: "async",
        loading: shouldEagerLoad ? "eager" : "lazy",
        fetchPriority: shouldEagerLoad ? "high" : "auto",
    };
}

function HeroSlide({ slide = {}, className, orbSizes = [], isActive }) {
    // 1. Destructure with default values to avoid "safeSlide.x ?? ''" repetition
    const {
        theme = "",
        badge = "",
        title = "",
        pieces = 0,
        price = "",
        stack = []
    } = slide || {};

    return (
        <article 
            className={className}
            aria-hidden={!isActive}
            // 2. Only allow focus on the active slide
            tabIndex={isActive ? 0 : -1} 
        >
            {/* Background Layer */}
            <div className="slide-bg" data-theme={theme} />

            <div className="carousel__layout">
                {/* 3. Text/Info Section */}
                <aside className="carousel__info">
                    <p className="carousel__badge">{badge}</p>
                    <h1 className="carousel__title">{title}</h1>

                    <div className="carousel__meta">
                        <span className="carousel__pieces">
                            <span className="num_pieces mono">{pieces}</span> pieces
                        </span>
                        <span className="carousel__meta-dot">•</span>
                        <span className="carousel__price mono">{price}</span>
                    </div>
                </aside>

                {/* 4. Art/Visual Section */}
                <div className="carousel__art">
                    {/* Dynamic background orbs */}
                    {orbSizes.map((sizePct, i) => (
                        <div 
                            key={i} 
                            className="carousel__art-extra-orb" 
                            style={{ height: `${sizePct}%` }} 
                        />
                    ))}

                    {/* Clothing Stack */}
                    <div className="outfit-stack">
                        {stack.map((layer, i) => (
                            <div 
                                key={layer.key || i} 
                                className={layer.className}
                            >
                                {(layer.images || []).map((img, j) => {
                                    if (!img.src) return null;
                                    return (
                                        <img
                                            key={img.id || img.className || j}
                                            src={img.src}
                                            className={img.className}
                                            alt={img.alt || ""}
                                            {...getImgProps(img, isActive)}
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
}

// 5. Memoize to prevent re-renders of hidden slides when parent state changes
export default memo(HeroSlide);