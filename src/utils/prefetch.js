export function getPrefetchUrlsForSlide(slide){
    if (!slide?.stack) return [];
    const urls = [];

    for (const piece of slide.stack) {
        for (const img of piece.images || []){
            if (img.eager) urls.push(img.src);
        }
    }
    return Array.from(new Set(urls));
}

export function prefetchImages(urls, prefetchedSet){
    for (const url of urls){
        if (!url || prefetchedSet.has(url)) continue;
        prefetchedSet.add(url);

        const img = new Image();
        img.decoding = "async";
        img.src = url;
    }
}