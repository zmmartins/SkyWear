export function getPrefetchUrlsForSlide(slide){
    if (!slide?.stack) return [];
    const urls = [];

    for (const piece of slide.stack) {
        for (const img of piece.images || []){
            const shouldPrefetch = Boolean(img.priority ?? img.eager);
            if (shouldPrefetch) urls.push(img.src);
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