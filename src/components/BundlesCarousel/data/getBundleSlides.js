import { SLIDES } from "./slides";

/**
 * SERVICE: getBundleSlides
 * ------------------------------------------------------------------
 * Simulates fetching slide data from a remote API.
 */

// Helper to mimic network latency (remove when integrating real API)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getBundleSlides() {
    // 1. Simulate Network Request
    await delay(600); 

    try {
        // In the future: const response = await fetch('/api/bundle-slides');
        // const data = await response.json();
        
        const data = SLIDES;

        // 2. Transformation Layer (Optional)
        // If the backend returns "image_url" but our UI needs "src", map it here.
        // This keeps the React components decoupled from API structure.
        
        return data;

    } catch (error) {
        console.error("Failed to fetch bundle slides:", error);
        return []; // Return empty array to prevent UI crash
    }
}