import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * STORE: useCartStore
 * ------------------------------------------------------------------
 * Global state management for the user's rental Suitcase and Trip Details.
 * Uses the 'persist' middleware to automatically save to localStorage.
 */
export const useCartStore = create(
    persist(
        (set, get) => ({
            
            // ==========================================================
            // 1. STATE (The Data)
            // ==========================================================
            tripDetails: {
                destination: null, // e.g., "JFK Airport"
                startDate: null,
                endDate: null,
            },
            
            suitcase: [], // Array to hold the selected clothing items

            // ==========================================================
            // 2. ACTIONS (The Functions that modify the data)
            // ==========================================================
            
            // Set or update the travel details
            setTripDetails: (details) => set((state) => ({
                tripDetails: { ...state.tripDetails, ...details }
            })),

            // Add an item to the suitcase
            addItem: (product, size = 'M') => set((state) => {
                // Check if this exact item (and size) is already in the suitcase
                const existingItem = state.suitcase.find(
                    (item) => item.id === product.id && item.size === size
                );

                if (existingItem) {
                    // If it exists, just increase the quantity
                    return {
                        suitcase: state.suitcase.map((item) =>
                            item.id === product.id && item.size === size
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                }

                // If it's new, add it to the array with a starting quantity of 1
                return {
                    suitcase: [...state.suitcase, { ...product, size, quantity: 1 }],
                };
            }),

            // Remove an item entirely from the suitcase
            removeItem: (productId, size) => set((state) => ({
                suitcase: state.suitcase.filter(
                    (item) => !(item.id === productId && item.size === size)
                ),
            })),

            // Wipe the slate clean (used after a successful checkout)
            clearSuitcase: () => set({ 
                suitcase: [], 
                tripDetails: { destination: null, startDate: null, endDate: null } 
            }),
            
            // A handy derived selector to get the total number of physical items
            getTotalItems: () => {
                const state = get();
                return state.suitcase.reduce((total, item) => total + item.quantity, 0);
            }
        }),
        {
            name: 'skywear-suitcase-storage', // The unique key used in localStorage
        }
    )
);