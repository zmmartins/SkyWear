import React from "react";

function imgProps({ eager }, isActive){
    // Only eager-load when the slide is active
    if (isActive && eager){
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

function HeroSlide({ slide, className, orbSizes, isActive }){
    return (
        <article className={className}>
        <div className="slide-bg" data-theme={slide.theme} />

        <div className="carousel__layout">
            <aside className="carousel__info">
                <p className="carousel__badge">{slide.badge}</p>
                <h1 className="carousel__title">{slide.title}</h1>

                <div className="carousel__meta">
                    <span className="carousel__pieces">
                    <span className="num_pieces mono">{slide.pieces}</span> pieces
                    </span>
                    <span className="carousel__meta-dot">•</span>
                    <span className="carousel__price mono">{slide.price}</span>
                </div>
            </aside>

            <div className="carousel__art">
            {orbSizes.map((h, i) => (
                <div key={i} className="carousel__art-extra-orb" style={{ height: `${h}%` }} />
            ))}

            <div className="outfit-stack">
                {slide.stack.map((piece) => (
                <div key={piece.key} className={piece.className}>
                    {piece.images.map((img) => (
                    <img
                        key={img.src}
                        src={img.src}
                        className={img.className}
                        alt={img.alt}
                        {...imgProps(img, isActive)}
                    />
                    ))}
                </div>
                ))}
            </div>
            </div>
        </div>
        </article>
    );
}

export default React.memo(HeroSlide);