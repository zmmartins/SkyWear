export const SLIDES = [
    {
        id: 0,
        theme: "winter",
        badge: "Bundle 1",
        title: "Winter Bundle",
        pieces: 8,
        price: "$150",
        stack: [
            {
                key:"pants",
                className: "clothing-piece clothing-piece--pants",
                images: [
                    { src: "/assets/img/winter bundle/pants1.png", className: "main", alt: "Pants", eager: true },
                    { src: "/assets/img/winter bundle/pants2.png", className: "alt-item alt-item--pants1", alt: "Alt pants" },
                ],
            },
            {
                key: "hoodie",
                className: "clothing-piece clothing-piece--hoodie",
                images: [
                    { src: "/assets/img/winter bundle/hoodie1.png", className: "alt-item alt-item--hoodie1", alt: "Hoodie 1" },
                    { src: "/assets/img/winter bundle/hoodie2.png", className: "alt-item alt-item--hoodie2", alt: "Hoodie 2" },
                ],
            },
            {
                key: "tshirt",
                className: "clothing-piece clothing-piece--tshirt",
                images: [
                    { src: "/assets/img/winter bundle/tshirt1.png", className: "alt-item alt-item--tshirt1", alt: "Tshirt 1" },
                    { src: "/assets/img/winter bundle/tshirt2.png", className: "alt-item alt-item--tshirt2", alt: "Tshirt 2" },
                ],
            },
            {
                key: "jacket",
                className: "clothing-piece clothing-piece--jacket",
                images: [{ src: "/assets/img/winter bundle/jacket.png", className: "main", alt: "Jacket", eager: true }],
            },
            {
                key: "beanie",
                className: "clothing-piece clothing-piece--beanie",
                images: [{ src: "/assets/img/winter bundle/beanie.png", className: "main", alt: "Beanie", eager: true }],
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
                images: [{ src: "/assets/img/summer bundle/pants.png", className: "alt-item alt-item--pants2", alt: "Pants" }],
            },
            {
                key: "shorts",
                className: "clothing-piece clothing-piece--shorts",
                images: [
                    { src: "/assets/img/summer bundle/shorts1.png", className: "main", alt: "Shorts", eager: true },
                    { src: "/assets/img/summer bundle/shorts2.png", className: "alt-item alt-item--shorts1", alt: "Alt shorts" },
                ],
            },
            {
                key: "sweater",
                className: "clothing-piece clothing-piece--sweater",
                images: [{ src: "/assets/img/summer bundle/sweater.png", className: "alt-item alt-item--sweater1", alt: "Sweater" }],
            },
            {
                key: "tshirt",
                className: "clothing-piece clothing-piece--tshirt",
                images: [
                    { src: "/assets/img/summer bundle/tshirt1.png", className: "alt-item alt-item--tshirt1", alt: "Tshirt" },
                    { src: "/assets/img/summer bundle/tshirt2.png", className: "alt-item alt-item--tshirt2", alt: "Tshirt" },
                ],
            },
            {
                key: "shirt",
                className: "clothing-piece clothing-piece--shirt",
                images: [{ src: "/assets/img/summer bundle/shirt.png", className: "main", alt: "Shirt", eager: true }],
            },
            {
                key: "hat",
                className: "clothing-piece clothing-piece--hat",
                images: [
                    { src: "/assets/img/summer bundle/hat1.png", className: "alt-item alt-item--hat1", alt: "Hat 1" },
                    { src: "/assets/img/summer bundle/hat2.png", className: "main", alt: "Hat", eager: true },
                ],
            },
        ],
    },
]