/**
 * MOCK DATA: Bundle Slides
 * ------------------------------------------------------------------
 * This mimics the JSON response we expect from the backend.
 * * SCHEMA NOTE:
 * The 'stack' array represents the Z-index layering of clothing items.
 * The 'className' prop mixes data with presentation. ideally, a real 
 * backend would return "type": "pants" and the frontend would map 
 * that to "clothing-piece--pants".
 */

const BASE_PATH = "assets/img";

export const SLIDES = [
    {
        id: 0,
        theme: "winter", // triggers CSS theme variables
        badge: "Bundle 1",
        title: "Winter Bundle",
        pieces: 8,
        price: "$150",
        stack: [
            // Layer 1: Pants
            {
                key: "pants",
                className: "clothing-piece clothing-piece--pants",
                images: [
                    { 
                        src: `${BASE_PATH}/winter-bundle/pants1.png`, 
                        className: "main", 
                        alt: "Winter Pants", 
                        priority: true // Marks as Critical (LCP)
                    },
                    { 
                        src: `${BASE_PATH}/winter-bundle/pants2.png`, 
                        className: "alt-item alt-item--pants1", 
                        alt: "Secondary Pants" 
                    },
                ],
            },
            // Layer 2: Hoodie
            {
                key: "hoodie",
                className: "clothing-piece clothing-piece--hoodie",
                images: [
                    { src: `${BASE_PATH}/winter-bundle/hoodie1.png`, className: "alt-item alt-item--hoodie1", alt: "Hoodie Gray" },
                    { src: `${BASE_PATH}/winter-bundle/hoodie2.png`, className: "alt-item alt-item--hoodie2", alt: "Hoodie Blue" },
                ],
            },
            // Layer 3: Tshirt
            {
                key: "tshirt",
                className: "clothing-piece clothing-piece--tshirt",
                images: [
                    { src: `${BASE_PATH}/winter-bundle/tshirt1.png`, className: "alt-item alt-item--tshirt1", alt: "Tshirt White" },
                    { src: `${BASE_PATH}/winter-bundle/tshirt2.png`, className: "alt-item alt-item--tshirt2", alt: "Tshirt Black" },
                ],
            },
            // Layer 4: Jacket
            {
                key: "jacket",
                className: "clothing-piece clothing-piece--jacket",
                images: [{ 
                    src: `${BASE_PATH}/winter-bundle/jacket.png`, 
                    className: "main", 
                    alt: "Puffer Jacket", 
                    priority: true 
                }],
            },
            // Layer 5: Beanie
            {
                key: "beanie",
                className: "clothing-piece clothing-piece--beanie",
                images: [{ 
                    src: `${BASE_PATH}/winter-bundle/beanie.png`, 
                    className: "main", 
                    alt: "Beanie", 
                    priority: true 
                }],
            },
        ],
    },
    {
        id: 1,
        theme: "summer",
        badge: "Bundle 2",
        title: "Summer Bundle",
        pieces: 9,
        price: "$150",
        stack: [
            {
                key: "pants",
                className: "clothing-piece clothing-piece--pants",
                images: [{ src: `${BASE_PATH}/summer-bundle/pants.png`, className: "alt-item alt-item--pants2", alt: "Linen Pants" }],
            },
            {
                key: "shorts",
                className: "clothing-piece clothing-piece--shorts",
                images: [
                    { src: `${BASE_PATH}/summer-bundle/shorts1.png`, className: "main", alt: "Shorts", priority: true },
                    { src: `${BASE_PATH}/summer-bundle/shorts2.png`, className: "alt-item alt-item--shorts1", alt: "Swim Shorts" },
                ],
            },
            {
                key: "sweater",
                className: "clothing-piece clothing-piece--sweater",
                images: [{ src: `${BASE_PATH}/summer-bundle/sweater.png`, className: "alt-item alt-item--sweater1", alt: "Light Sweater" }],
            },
            {
                key: "tshirt",
                className: "clothing-piece clothing-piece--tshirt",
                images: [
                    { src: `${BASE_PATH}/summer-bundle/tshirt1.png`, className: "alt-item alt-item--tshirt1", alt: "Tshirt Graphic" },
                    { src: `${BASE_PATH}/summer-bundle/tshirt2.png`, className: "alt-item alt-item--tshirt2", alt: "Tshirt Plain" },
                ],
            },
            {
                key: "shirt",
                className: "clothing-piece clothing-piece--shirt",
                images: [{ src: `${BASE_PATH}/summer-bundle/shirt.png`, className: "main", alt: "Button Up", priority: true }],
            },
            {
                key: "hat",
                className: "clothing-piece clothing-piece--hat",
                images: [
                    { src: `${BASE_PATH}/summer-bundle/hat1.png`, className: "alt-item alt-item--hat1", alt: "Bucket Hat" },
                    { src: `${BASE_PATH}/summer-bundle/hat2.png`, className: "main", alt: "Cap", priority: true },
                ],
            },
        ],
    },
];