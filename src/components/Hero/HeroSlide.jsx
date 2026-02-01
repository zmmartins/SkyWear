import React from "react";

function imgProps(img = {}, isActive){
    const isPriority = Boolean(img.priority ?? img.eager);

    // Only eager-load when the slide is active
    if (isActive && isPriority){
        return { 
            decoding: "async", 
            loading: "eager", 
            fetchPriority: "high" 
        };
    }

    // Everything else is lazy (including "main" images on non-active slides)
    return { 
        decoding: "async", 
        loading: "lazy",
        fetchPriority: "auto",
    };
}

function HeroSlide({ slide, className, orbSizes = [], isActive }){
    const safeSlide = slide ?? {};
    const theme = safeSlide.theme ?? "";
    
    const badge  = safeSlide.badge ?? "";
    const title  = safeSlide.title ?? "";
    const pieces = safeSlide.pieces ?? 0;
    const price  = safeSlide.price ?? "";

    const stack = Array.isArray(safeSlide.stack) ? safeSlide.stack : [];

    return (
        <article 
            className={className}
            aria-hidden = {!isActive}
            tabIndex = {isActive ? 0 : -1}
            style={!isActive ? { pointerEvents: "none" } : undefined}
        >
            <div className="slide-bg" data-theme={theme} />

            <div className="carousel__layout">
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

                <div className="carousel__art">
                    {orbSizes.map((h, i) => (
                        <div 
                            key={i} 
                            className="carousel__art-extra-orb" 
                            style={{ height: `${h}%` }} 
                        />
                    ))}

                    <div className="outfit-stack">
                        {stack.map((piece, pieceIndex) => {
                            const pieceKey = piece?.key ?? `${pieceIndex}`;
                            const pieceClass = piece?.className ?? "";

                            const images = Array.isArray(piece?.images) ? piece.images : [];

                            return (
                                <div key={pieceKey} className={pieceClass}>
                                    {images.map((img, imgIndex) => {
                                        const src = img?.src ?? "";
                                        if (!src) return null;

                                        const key = img?.id ?? img?.className ?? `${pieceKey}-${imgIndex}`;
                                        const alt = img?.alt ?? "";

                                        return (
                                            <img
                                                key={key}
                                                src={src}
                                                className={img?.className ?? ""}
                                                alt={alt}
                                                {...imgProps(img, isActive)}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default React.memo(HeroSlide);