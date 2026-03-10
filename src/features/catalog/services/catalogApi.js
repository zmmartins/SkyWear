import { apiClient } from "@/services/apiClient";
import { clothingTypes, products } from "@/mock/db"; 

export async function getCatalogData() {
    try {
        // 1. Get ONLY root categories (parent_id is null) for the filter tabs
        const rootCategories = [
            "all items",
            ...clothingTypes
                .filter(c => c.parent_id === null)
                .map(c => c.label.toLowerCase())
        ];

        // 2. Create a quick lookup map to easily find a child's parent
        // Result looks like: { hat: "headwear", tshirt: "tops", ...}
        const childToParentMap = {};
        clothingTypes.forEach(c => {
            if (c.parent_id !== null){
                childToParentMap[c.id_type] = c.parent_id;
            }
        });

        // 3. Map products to the old shape, but attach a 'rootType' for filtering
        const mappedProducts = products.map(p => {
            const parentId = childToParentMap[p.type];
            const parentCategory = clothingTypes.find(c => c.id_type === parentId);
            const rootTypeLabel = parentCategory ? parentCategory.label.toLowerCase() : p.type;

            return {
                id: p.id_prod,
                type: p.type,
                rootType: rootTypeLabel,
                name: p.name,
                price: p.daily,
                mainImage: p.main_img
            };
        });

        // 4. Return teh assembled payload
        const data = await apiClient.getMock({
            categories: rootCategories,
            products: mappedProducts
        }, 500);

        return data;
    } catch (error) {
        console.error("Failed to fetch catalog:", error);
        throw new Error("Unable to load the catalog at this time.");
    }
}