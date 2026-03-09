// src/mocks/db.ts

const BASE_PATH = `${import.meta.env.BASE_URL}mock-images/products/`;

// --- INTERFACES (TypeScript) ---
export interface Brand {
    id_brand: string;
    name: string;
    descr: string;
    logo: string;
}

export interface Location {
    id_loc: string;
    iata: string;
    airport: string;
    city: string;
    country: string;
}

export interface ClothingCategory {
    id_type: string;
    label: string;
    parent_id: string | null;
}

export interface Product {
    id_prod: string;
    id_brand: string;
    name: string;
    type: string; 
    descr: string;
    daily: number;
    main_img: string;
    imgs: string[];
    available_sizes: string[];  // <-- ADICIONADO
    available_colors: string[]; // <-- ADICIONADO
}

export interface Item {
    id_item: string;
    id_prod: string;
    size: string;  // A regra de negócio ditará que tem de estar em Product.available_sizes
    color: string; // A regra de negócio ditará que tem de estar em Product.available_colors
    id_loc: string;
    state: string;
    avail: string;
}

export interface Bundle {
    id_bundle: string;
    name: string;
    descr: string;
    daily: number;
}

export type PositionClass = 
    | "alt-head-l" | "alt-head-r" 
    | "alt-outer-top-l-2" | "alt-outer-top-l-1" | "alt-outer-top-r-1" | "alt-outer-top-r-2" 
    | "alt-base-top-l-2" | "alt-base-top-l-1" | "alt-base-top-r-1" | "alt-base-top-r-2"
    | "alt-bottom-l-2" | "alt-bottom-l-1" | "alt-bottom-r-1" | "alt-bottom-r-2";

export type BundleProduct = {
    id_bundle: string;
    id_prod: string;
} & (
    | { is_display: true; position_class?:never }
    | { is_display: false; position_class: PositionClass }
);

// --- DATA ---

export const brands: Brand[] = [
    { id_brand: "m_alpine", name: "AlpineGear", descr: "Performance de Inverno.", logo: "/assets/logo.png" },
    { id_brand: "m_sky", name: "SkyWear", descr: "Essenciais de viagem e Verão.", logo: "/assets/logo.png" }
];

export const locations: Location[] = [
    { id_loc: "loc_lis", iata: "LIS", airport: "Humberto Delgado", city: "Lisboa", country: "Portugal" }
];

export const clothingTypes: ClothingCategory[] = [
    // ROOTS
    { id_type: "headwear",  label: "Headwear",  parent_id: null },
    { id_type: "tops",      label: "Tops",      parent_id: null },
    { id_type: "bottoms",   label: "Bottoms",   parent_id: null },
    { id_type: "full_body", label: "Full Body", parent_id: null },

    // HEADWEAR
    { id_type: "hat",    label: "Hat",     parent_id: "headwear" },
    { id_type: "beanie", label: "Beanie", parent_id: "headwear" },
    
    // TOP
    { id_type: "tank_top", label: "Tank Top",   parent_id: "tops" },
    { id_type: "tshirt",   label: "T-Shirt",    parent_id: "tops" },
    { id_type: "polo",     label: "Polo Shirt", parent_id: "tops" },
    { id_type: "shirt",    label: "Shirt",      parent_id: "tops" },
    { id_type: "sweater",  label: "Sweater",    parent_id: "tops" },
    { id_type: "hoodie",   label: "Hoodie",     parent_id: "tops" },
    { id_type: "vest",     label: "Vest",       parent_id: "tops" },
    { id_type: "jacket",   label: "Jacket",     parent_id: "tops" },
    { id_type: "coat",     label: "Coat",       parent_id: "tops" },

    // BOTTOMS
    { id_type: "pants",  label: "Pants",  parent_id: "bottoms" },
    { id_type: "shorts", label: "Shorts", parent_id: "bottoms" },
    { id_type: "skirt",  label: "Skirt",  parent_id: "bottoms" },

    // FULL-BODY
    { id_type: "dress",    label: "Dress",    parent_id: "full_body" },
    { id_type: "jumpsuit", label: "Jumpsuit", parent_id: "full_body" },
    { id_type: "overalls", label: "Overalls", parent_id: "full_body" }
];

export const products: Product[] = [
    // --- INVERNO ---
    { 
        id_prod: "w_jacket", 
        id_brand: "m_alpine", 
        name: "Expedition Shell", 
        type: "jacket", 
        descr: "", 
        daily: 12.0, 
        main_img: `${BASE_PATH}tops/yellow_jacket.png`, 
        imgs: [`${BASE_PATH}tops/yellow_jacket.png`], 
        available_sizes: ["S", "M", "L", "XL"], 
        available_colors: ["Yellow"] 
    },
    { 
        id_prod: "w_hoodie1", 
        id_brand: "m_alpine", 
        name: "C.S. Hoodie", 
        type: "hoodie", 
        descr: "", 
        daily: 5.0, 
        main_img: `${BASE_PATH}tops/grey_hoodie.png`, 
        imgs: [`${BASE_PATH}tops/grey_hoodie.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Gray"] 
    },
    { 
        id_prod: "w_hoodie2", 
        id_brand: "m_alpine", 
        name: "Wilson Hoodie", 
        type: "hoodie", 
        descr: "", 
        daily: 5.0, 
        main_img: `${BASE_PATH}tops/green_hoodie.png`, 
        imgs: [`${BASE_PATH}tops/green_hoodie.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Green"] 
    },
    { 
        id_prod: "w_beanie", 
        id_brand: "m_alpine", 
        name: "Alpine Knit Beanie", 
        type: "beanie", 
        descr: "", 
        daily: 2.0, 
        main_img: `${BASE_PATH}headwear/beanie.png`, 
        imgs: [`${BASE_PATH}headwear/beanie.png`], 
        available_sizes: ["One Size"], 
        available_colors: ["Red"] 
    },
    { 
        id_prod: "w_pants1", 
        id_brand: "m_alpine", 
        name: "Snow Pants", 
        type: "pants", 
        descr: "", 
        daily: 6.0, 
        main_img: `${BASE_PATH}bottoms/snow_pants.png`, 
        imgs: [`${BASE_PATH}bottoms/snow_pants.png`], 
        available_sizes: ["30", "32", "34", "36"], 
        available_colors: ["Black"] 
    },
    { 
        id_prod: "w_pants2", 
        id_brand: "m_alpine", 
        name: "Baggy Jeans", 
        type: "pants", 
        descr: "", 
        daily: 5.0, 
        main_img: `${BASE_PATH}bottoms/black_jeans.png`, 
        imgs: [`${BASE_PATH}bottoms/black_jeans.png`], 
        available_sizes: ["M", "L", "XL"], 
        available_colors: ["Black"] 
    },
    { 
        id_prod: "w_tshirt1", 
        id_brand: "m_alpine", 
        name: "ATM A.C. T-Shirt", 
        type: "tshirt", 
        descr: "", 
        daily: 3.0, 
        main_img: `${BASE_PATH}tops/white_blue_tshirt.png`, 
        imgs: [`${BASE_PATH}tops/white_blue_tshirt.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["White"] 
    },
    { 
        id_prod: "w_tshirt2", 
        id_brand: "m_apline", 
        name: "Alpine Logo T-Shirt", 
        type: "tshirt", 
        descr: "", 
        daily: 3.0, 
        main_img: `${BASE_PATH}tops/black_tshirt.png`, 
        imgs: [`${BASE_PATH}tops/black_tshirt.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Black"] 
    },
    // --- VERÃO ---
    { 
        id_prod: "s_hat1", 
        id_brand: "m_sky", 
        name: "Surfer Cap", 
        type: "hat", 
        descr: "", 
        daily: 2.0, 
        main_img: `${BASE_PATH}headwear/cream_cap.png`, 
        imgs: [`${BASE_PATH}headwear/cream_cap.png`], 
        available_sizes: ["One Size"], 
        available_colors: ["Cream"] 
    },
    { 
        id_prod: "s_hat2", 
        id_brand: "m_sky", 
        name: "Trucker Hat", 
        type: "hat", 
        descr: "", 
        daily: 2.0, 
        main_img: `${BASE_PATH}headwear/white_green_cap.png`, 
        imgs: [`${BASE_PATH}headwear/white_green_cap.png`], 
        available_sizes: ["One Size"], 
        available_colors: ["White"] 
    },
    { 
        id_prod: "s_shirt", 
        id_brand: "m_sky", 
        name: "Cropped Shirt", 
        type: "shirt", 
        descr: "", 
        daily: 2.0, 
        main_img: `${BASE_PATH}tops/shirt.png`, 
        imgs: [`${BASE_PATH}tops/shirt.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Red"] 
    },
    { 
        id_prod: "s_tshirt1", 
        id_brand: "m_sky", 
        name: "N.Y.Y. T-Shirt", 
        type: "tshirt", 
        descr: "", 
        daily: 2.0, 
        main_img: `${BASE_PATH}tops/blue_tshirt.png`, 
        imgs: [`${BASE_PATH}tops/blue_tshirt.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Blue"] 
    },
    { 
        id_prod: "s_tshirt2", 
        id_brand: "m_sky", 
        name: "Essential T-Shirt", 
        type: "tshirt", 
        descr: "", 
        daily: 2.0, 
        main_img: `${BASE_PATH}tops/all_white_tshirt.png`, 
        imgs: [`${BASE_PATH}tops/all_white_tshirt.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["White"] 
    },
    { 
        id_prod: "s_sweater", 
        id_brand: "m_sky", 
        name: "Fisherman Sweater", 
        type: "sweater", 
        descr: "", 
        daily: 5.0, 
        main_img: `${BASE_PATH}tops/sweater.png`, 
        imgs: [`${BASE_PATH}tops/sweater.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Bordeaux"] 
    },
    { 
        id_prod: "s_shorts1", 
        id_brand: "m_sky", 
        name: "Jean Shorts", 
        type: "shorts", 
        descr: "", 
        daily: 4.0, 
        main_img: `${BASE_PATH}bottoms/jean_shorts.png`, 
        imgs: [`${BASE_PATH}bottoms/jean_shorts.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Blue"] 
    },
    { 
        id_prod: "s_shorts2", 
        id_brand: "m_sky", 
        name: "Sport's Shorts", 
        type: "shorts", 
        descr: "", 
        daily: 4.0, 
        main_img: `${BASE_PATH}bottoms/sport_shorts.png`, 
        imgs: [`${BASE_PATH}bottoms/sport_shorts.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Navy"] 
    },
    { 
        id_prod: "s_pants", 
        id_brand: "m_sky", 
        name: "Linen Pants", 
        type: "pants", 
        descr: "", 
        daily: 4.0, 
        main_img: `${BASE_PATH}bottoms/linen_pants.png`, 
        imgs: [`${BASE_PATH}bottoms/linen_pants.png`], 
        available_sizes: ["S", "M", "L"], 
        available_colors: ["Cream"] 
    }
];

// O .map() agora acede dinamicamente ao catálogo para garantir que os items físicos
// têm um tamanho e cor válidos (o primeiro do array disponível para esse produto).
export const items: Item[] = products.map((p, index) => ({
    id_item: `item_${index}`,
    id_prod: p.id_prod,
    size: p.available_sizes[1] || "Standard", 
    color: p.available_colors[1] || "Standard",
    id_loc: "loc_lis",
    state: "New",
    avail: "Available"
}));

export const bundles: Bundle[] = [
    { id_bundle: "b_winter", name: "Winter Bundle", descr: "8 essentials to keep you warm.", daily: 15.0 },
    { id_bundle: "b_summer", name: "Summer Bundle", descr: "9 essentials to keep you cool under the sun.", daily: 15.0 }
];

export const bundleProducts: BundleProduct[] = [
    // Winter Bundle Items
    { id_bundle: "b_winter", id_prod: "w_pants1", is_display: true },
    { id_bundle: "b_winter", id_prod: "w_pants2", is_display: false, position_class: "alt-bottom-r-1" },
    { id_bundle: "b_winter", id_prod: "w_hoodie1", is_display: false, position_class: "alt-outer-top-l-1"},
    { id_bundle: "b_winter", id_prod: "w_hoodie2", is_display: false, position_class: "alt-outer-top-r-1"},
    { id_bundle: "b_winter", id_prod: "w_tshirt2", is_display: false, position_class: "alt-base-top-l-1" },
    { id_bundle: "b_winter", id_prod: "w_tshirt1", is_display: false, position_class: "alt-base-top-r-1" },    
    { id_bundle: "b_winter", id_prod: "w_jacket", is_display: true },
    { id_bundle: "b_winter", id_prod: "w_beanie", is_display: true },

    // Summer Bundle Items
    { id_bundle: "b_summer", id_prod: "s_pants", is_display: false, position_class: "alt-bottom-l-1" },
    { id_bundle: "b_summer", id_prod: "s_shorts2", is_display: false, position_class: "alt-bottom-r-1" },
    { id_bundle: "b_summer", id_prod: "s_shorts1", is_display: true },
    { id_bundle: "b_summer", id_prod: "s_sweater", is_display: false, position_class: "alt-outer-top-r-1" },
    { id_bundle: "b_summer", id_prod: "s_tshirt1", is_display: false, position_class: "alt-base-top-r-1" },
    { id_bundle: "b_summer", id_prod: "s_tshirt2", is_display: false, position_class: "alt-base-top-l-1" },
    { id_bundle: "b_summer", id_prod: "s_shirt", is_display: true },
    { id_bundle: "b_summer", id_prod: "s_hat1", is_display: true },
    { id_bundle: "b_summer", id_prod: "s_hat2", is_display: false, position_class: "alt-head-l" },
];