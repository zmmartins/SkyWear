/**
 * UTILS: Prefetch
 * ------------------------------------------------------------------
 * Methods to aggressively cache images for upcoming slides so the
 * user doesn't see blank spaces when swiping.
 */

/**
 * Extracts a list of high-priority image URLs from a slide object.
 * We only prefetch images marked 'priority' or 'eager' to save bandwidth.
 */
export function getPrefetchUrlsForSlide(slide) {
    if (!slide?.stack) return [];

    // 1. Flatten all images from all stack layers into one array
    const allImages = slide.stack.flatMap(layer => layer.images || []);

    // 2. Filter for priority items and extract their source
    const priorityUrls = allImages
        .filter(img => img.priority || img.eager)
        .map(img => img.src);

    // 3. Deduplicate (just in case)
    return Array.from(new Set(priorityUrls));
}

/**
 * Triggers the browser to download images in the background.
 * Uses the Image() constructor to force a cache write.
 * * @param {string[]} urls - List of image URLs
 * @param {Set} prefetchedSet - Reference to a Set tracking already loaded URLs
 */
export function prefetchImages(urls, prefetchedSet) {
    urls.forEach((url) => {
        if (!url || prefetchedSet.has(url)) return;
        
        // Mark as requested immediately to prevent duplicate calls
        prefetchedSet.add(url);

        const img = new Image();
        img.decoding = "async"; 
        img.src = url;
    });
}