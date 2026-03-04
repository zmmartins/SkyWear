import { apiClient } from "@/services/apiClient";
import { MOCK_SLIDES } from "@/services/mockData";

export async function getBundleSlides() {
    try {
        // Future: const data = await apiClient.get('/api/bundle-slides');
        const data = await apiClient.getMock(MOCK_SLIDES, 600);
        return data;
    } catch (error) {
        console.error("Failed to fetch bundle slides:", error);
        return []; // Graceful degradation
    }
}