import { apiClient } from "@/services/apiClient";
import { clothingTypes, products } from "@/mock/db"; 

export async function getCatalogData() {
    try {
        // 1. Map clothingTypes to a flat array of strings 
        const categories = clothingTypes.map(c => c.label.toLowerCase());
        
        // 2. Map the new Product interface to the old MOCK_PRODUCTS shape
        // We substitute 'price' with 'daily' to match the rental logic
        const mappedProducts = products.map(p => ({
            id: p.id_prod,
            type: p.type,
            name: p.name,
            price: p.daily, 
            mainImage: p.main_img
        }));

        // 3. Return the assembled payload
        const data = await apiClient.getMock({
            categories: categories,
            products: mappedProducts
        }, 500);
        
        return data;
    } catch (error) {
        console.error("Failed to fetch catalog:", error);
        throw new Error("Unable to load the catalog at this time.");
    }
}