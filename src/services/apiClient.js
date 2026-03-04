/**
 * SERVICE: apiClient (Global HTTP Wrapper)
 * ------------------------------------------------------------------
 * Centralized network client. All feature APIs route through this.
 * Future: Add Authorization headers, interceptors, and error logging here.
 */

// Helper to mimic network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = {
    /**
     * Simulates a GET request to a database.
     * @param {any} mockPayload - The data to return after the delay
     * @param {number} latency - Simulated ping
     */
    async getMock(mockPayload, latency = 600) {
        await delay(latency);
        
        // Randomly simulate a 5% network failure rate if you want to test your error boundaries!
        // if (Math.random() < 0.05) throw new Error("Network timeout");

        return mockPayload;
    }

    // FUTURE IMPLEMENTATION:
    // async get(endpoint) {
    //     const token = localStorage.getItem('token');
    //     const res = await fetch(`https://api.skywear.com${endpoint}`, {
    //         headers: { Authorization: `Bearer ${token}` }
    //     });
    //     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    //     return await res.json();
    // }
};