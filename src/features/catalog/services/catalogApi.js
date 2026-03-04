import { apiClient } from "@/services/apiClient";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/services/mockData";

export async function getCatalogData() {
    try {
        // Future: const data = await apiClient.get('/api/catalog');
        const data = await apiClient.getMock({
            categories: MOCK_CATEGORIES,
            products: MOCK_PRODUCTS
        }, 500);
        
        return data;
    } catch (error) {
        console.error("Failed to fetch catalog:", error);
        throw new Error("Unable to load the catalog at this time.");
    }
}