import { apiClient } from "@/services/apiClient";
import { bundles, bundleProducts, products } from "@/mock/db"; 

export async function getBundleSlides() {
    try {
        // Construct the slides array by joining the normalized mock data
        const mappedSlides = bundles.map((bundle, index) => {
            
            // 1. Get the mapping items for this specific bundle
            const bProducts = bundleProducts.filter(bp => bp.id_bundle === bundle.id_bundle);
            
            // 2. Group products by 'type' to build the 'stack' layers
            const stackMap = {};
            let piecesCount = 0;

            bProducts.forEach((bp, bpIndex) => {
                // Find the actual product details
                const product = products.find(p => p.id_prod === bp.id_prod);
                if (!product) return;
                
                piecesCount++;
                const type = product.type;
                
                // Initialize the layer if it doesn't exist
                if (!stackMap[type]) {
                    stackMap[type] = {
                        key: type,
                        className: `clothing-piece clothing-piece--${type}`,
                        images: []
                    };
                }

                // Add the image to the layer, setting priority based on 'is_display'
                stackMap[type].images.push({
                    src: product.main_img,
                    alt: product.name,
                    is_display: bp.is_display,
                    position_class: bp.position_class || null,
                    priority: bp.is_display
                });
            });

            // 3. Assemble the final slide object
            return {
                id: index,
                theme: bundle.id_bundle.includes("winter") ? "winter" : "summer",
                badge: `Bundle ${index + 1}`,
                name: bundle.name,
                pieces: piecesCount,
                daily: bundle.daily,
                stack: Object.values(stackMap) // Convert the grouped map back to an array
            };
        });

        const data = await apiClient.getMock(mappedSlides, 600);
        return data;
    } catch (error) {
        console.error("Failed to fetch bundle slides:", error);
        return []; // Graceful degradation
    }
}