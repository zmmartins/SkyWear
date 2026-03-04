import { SLIDES } from "@/services/mockData";

/**
 * SERVICE: bundlesApi
 * ------------------------------------------------------------------
 * Handles all network requests specifically related to the Bundles domain.
 * Keeps the UI components completely decoupled from network logic.
 */

// Temporary helper to mimic network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getBundleSlides() {
    await delay(600); 

    try {
        // FUTURE IMPLEMENTATION:
        // const response = await fetch('/api/bundle-slides');
        // if (!response.ok) throw new Error('Network response was not ok');
        // const data = await response.json();
        
        const data = SLIDES;

        // Transformation Layer: Map backend keys to frontend expectations here if needed
        return data;
    } catch (error) {
        console.error("Failed to fetch bundle slides:", error);
        return []; // Graceful degradation
    }
}