export type ProductVariant = {
  id: string;
  name: string;
  size?: string;
  price?: number;
  mrp?: number;
  image?: string;
  swatch?: string;
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  categoryId: string;
  description: string;
  details?: string;
  ingredients?: string;
  size: string;
  image: string;
  /** MRP in INR. Null when price is enquiry-only. */
  mrp: number | null;
  /** Selling price in INR. Null = contact for price. */
  price: number | null;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  offerIds: string[];
  rating: number;
  reviewCount: number;
  relatedIds: string[];
  variants?: ProductVariant[];
  gallery: { label: string; url?: string; tone: string }[];
};

export const products: Product[] = [
  {
    id: "p-mamaearth-rosemary-oil",
    slug: "mamaearth-rosemary-hair-growth-oil",
    name: "Mamaearth Rosemary Hair Growth Oil",
    brandId: "br-mamaearth",
    categoryId: "cat-hair",
    description: "Stimulates scalp micro-circulation and revitalizes dormant follicles for thicker, stronger hair.",
    details: "Enriched with pure Rosemary Oil and Methi Dana seeds. Clinically tested anti-hair fall formulation.",
    ingredients: "Rosemary Leaf Extract, Methi Dana (Fenugreek), Bhringraj, Amla, Almond Oil.",
    size: "150 ml",
    image: "/products/mamaearth-rosemary-oil.png",
    mrp: 499,
    price: 449,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 310,
    relatedIds: ["p-plix-rosemary-oil","p-mamaearth-onion-oil","p-mamaearth-onion-shampoo"],
    gallery: [
      {
            "label": "Rosemary Oil",
            "url": "/products/mamaearth-rosemary-oil.png",
            "tone": "#f2f7f1"
      }
],
  },
  {
    id: "p-plix-rosemary-oil",
    slug: "plix-rosemary-hair-growth-oil",
    name: "Plix Rosemary Hair Growth Oil",
    brandId: "br-plix",
    categoryId: "cat-hair",
    description: "Plant-powered botanical infusion with Rosemary extract and Redensyl to prevent shedding and deeply nourish roots.",
    details: "Ultra-absorbing scalp elixir designed for hair fall control and scalp nourishment.",
    ingredients: "Rosemary Extract, Redensyl, Castor Seed Oil, Jojoba Oil, Vitamin E.",
    size: "100 ml",
    image: "/products/plix-rosemary-oil.jpg",
    mrp: 400,
    price: 349,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 220,
    relatedIds: ["p-mamaearth-rosemary-oil","p-pilgrim-korean-mist","p-plix-flaxseed-shampoo"],
    gallery: [
      {
            "label": "Plix Rosemary Oil",
            "url": "/products/plix-rosemary-oil.jpg",
            "tone": "#f0f8ef"
      }
],
  },
  {
    id: "p-mamaearth-onion-shampoo",
    slug: "mamaearth-onion-hair-fall-control-shampoo",
    name: "Mamaearth Onion Hair Fall Control Shampoo",
    brandId: "br-mamaearth",
    categoryId: "cat-hair",
    description: "Reduces hair fall up to 8x. Enriched with sulfur-rich red onion extract and plant keratin to make hair softer and stronger.",
    details: "Gentle sulfate-free daily shampoo safe for color-treated hair.",
    ingredients: "Red Onion Seed Oil Extract, Plant Keratin, Wheat Amino Acids, D-Panthenol.",
    size: "250 ml",
    image: "/products/mamaearth-onion-shampoo.png",
    mrp: 349,
    price: 299,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 420,
    relatedIds: ["p-mamaearth-onion-oil","p-mamaearth-rosemary-oil"],
    gallery: [
      {
            "label": "Onion Shampoo",
            "url": "/products/mamaearth-onion-shampoo.png",
            "tone": "#fdf3f4"
      }
],
  },
  {
    id: "p-mamaearth-onion-oil",
    slug: "mamaearth-onion-hair-oil",
    name: "Mamaearth Onion Hair Oil",
    brandId: "br-mamaearth",
    categoryId: "cat-hair",
    description: "India's favorite onion hair oil enriched with Redensyl and Onion Seed Oil to nourish roots and boost scalp vitality.",
    details: "Non-sticky, lightweight oil crafted to reduce hair fall and promote shine.",
    ingredients: "Onion Seed Oil, Redensyl, Almond Oil, Castor Oil, Bhringraj, Amla.",
    size: "100 ml",
    image: "/products/mamaearth-onion-oil.png",
    mrp: 199,
    price: 179,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 380,
    relatedIds: ["p-mamaearth-onion-shampoo","p-mamaearth-rosemary-oil"],
    gallery: [
      {
            "label": "Onion Oil",
            "url": "/products/mamaearth-onion-oil.png",
            "tone": "#fcf0f2"
      }
],
  },
  {
    id: "p-lakme-peach-milk-gel",
    slug: "lakme-peach-milk-gel-moisturiser",
    name: "Lakmé Peach Milk Gel Moisturiser",
    brandId: "br-lakme",
    categoryId: "cat-skincare",
    description: "Infused with juicy peaches & vitamin B3, this ultra-lightweight watery gel moisturiser melts immediately into skin.",
    details: "Non-greasy, non-sticky gel texture ideal for hot and humid weather.",
    ingredients: "Peach Extracts, Vitamin B3, Hyaluronic Acid, Aqua Gel Base.",
    size: "150 g",
    image: "/products/lakme-peach-milk-gel.jpg",
    mrp: 585,
    price: 499,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 310,
    relatedIds: ["p-dotkey-vitc-moisturizer","p-dotkey-oilfree-moisturizer"],
    gallery: [
      {
            "label": "Peach Milk Gel",
            "url": "/products/lakme-peach-milk-gel.jpg",
            "tone": "#fef3ee"
      }
],
  },
  {
    id: "p-mcaffeine-sweet-escape-lotion",
    slug: "mcaffeine-sweet-escape-perfume-body-lotion",
    name: "mCaffeine Sweet Escape Perfume Body Lotion",
    brandId: "br-mcaffeine",
    categoryId: "cat-bath",
    description: "Enchanting gourmand scent notes of warm vanilla, caramel, and coffee bean butter for 48H deep hydration.",
    details: "Silky lotion enriched with pure caffeine to tone and firm skin while wrapping you in an alluring luxury fragrance.",
    ingredients: "Pure Arabica Coffee, Shea Butter, Sweet Almond Oil, Gourmand Fragrance Elixir.",
    size: "200 ml",
    image: "/products/mcaffeine-sweet-escape-lotion.jpg",
    mrp: 499,
    price: 449,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 195,
    relatedIds: ["p-wishcare-sunscreen-body-lotion","p-chemistatplay-exfoliating-body-wash"],
    gallery: [
      {
            "label": "Sweet Escape Body Lotion",
            "url": "/products/mcaffeine-sweet-escape-lotion.jpg",
            "tone": "#faf0ea"
      }
],
  },
  {
    id: "p-dotkey-vitc-moisturizer",
    slug: "dot-and-key-vitamin-c-plus-e-super-bright-moisturizer",
    name: "Dot & Key Vitamin C + E Super Bright Moisturizer",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Kakadu Plum Vitamin C & Vitamin E sorbet cream that fades hyperpigmentation and unleashes instant radiant glow.",
    details: "Lightweight cream-gel formulation with three active Vitamin C sources.",
    ingredients: "Kakadu Plum, Ethyl Ascorbic Acid, Vitamin E, Blood Orange, Hyaluronic Acid.",
    size: "60 ml",
    image: "/products/dotkey-vitc-moisturizer.jpg",
    mrp: 495,
    price: 445,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 410,
    relatedIds: ["p-dotkey-oilfree-moisturizer","p-dotkey-barrier-repair-sunscreen"],
    gallery: [
      {
            "label": "Vitamin C Moisturizer",
            "url": "/products/dotkey-vitc-moisturizer.jpg",
            "tone": "#fef6eb"
      }
],
  },
  {
    id: "p-dotkey-oilfree-moisturizer",
    slug: "dot-and-key-oil-free-moisturizer",
    name: "Dot & Key Oil Free Moisturizer",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Probiotic and Japanese rice water gel that quenches oily and acne-prone skin with 72-hour moisture with zero oil shine.",
    details: "Ultra-refreshing, non-comedogenic water gel that balances sebum.",
    ingredients: "Hyaluronic Acid, Japanese Rice Water, Kombucha Probiotics, Panthenol.",
    size: "60 ml",
    image: "/products/dotkey-oilfree-moisturizer.jpg",
    mrp: 495,
    price: 445,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 350,
    relatedIds: ["p-dotkey-vitc-moisturizer","p-lakme-peach-milk-gel"],
    gallery: [
      {
            "label": "Oil Free Moisturizer",
            "url": "/products/dotkey-oilfree-moisturizer.jpg",
            "tone": "#edf5fa"
      }
],
  },
  {
    id: "p-bellavita-white-oud",
    slug: "bellavita-white-oud-perfume",
    name: "Bella Vita White Oud Perfume 100ml",
    brandId: "br-bellavita",
    categoryId: "cat-fragrance",
    description: "An ethereal and pristine blend of subtle sweet agarwood, fresh aquatic notes, musk, and soft amber.",
    details: "Long-lasting French perfume oil concentration crafted for modern luxury.",
    ingredients: "Artemisia, Orange Blossom, Amber, White Agarwood, Musk.",
    size: "100 ml",
    image: "/products/bellavita-white-oud.jpg",
    mrp: 599,
    price: 549,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 460,
    relatedIds: ["p-bellavita-date-woman","p-bellavita-skai-shower-gel"],
    gallery: [
      {
            "label": "White Oud EDP",
            "url": "/products/bellavita-white-oud.jpg",
            "tone": "#f8f5f0"
      }
],
  },
  {
    id: "p-bellavita-date-woman",
    slug: "bellavita-date-woman-perfume",
    name: "Bella Vita Date Woman Perfume 100ml",
    brandId: "br-bellavita",
    categoryId: "cat-fragrance",
    description: "A passionate blend of pink pepper, red fruits, floral jasmine, and intoxicating vanilla.",
    details: "High-grade French formulation designed for evening wear and romantic occasions.",
    ingredients: "Pink Pepper, Red Berries, Jasmine, Turkish Rose, Vanilla Bean, Cedarwood.",
    size: "100 ml",
    image: "/products/bellavita-date-woman.jpg",
    mrp: 599,
    price: 549,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 490,
    relatedIds: ["p-bellavita-white-oud","p-bellavita-skai-shower-gel"],
    gallery: [
      {
            "label": "Date Woman EDP",
            "url": "/products/bellavita-date-woman.jpg",
            "tone": "#fdf2f4"
      }
],
  },
  {
    id: "p-nykaa-wanderlust-cherry",
    slug: "nykaa-wanderlust-japanese-cherry-blossom-body-wash",
    name: "Nykaa Wanderlust Japanese Cherry Blossom Body Wash",
    brandId: "br-nykaa",
    categoryId: "cat-bath",
    description: "Refreshing body cleanser infused with Aloe Vera & sweet Japanese Cherry Blossom.",
    details: "Soap-free, non-drying lather that leaves skin lightly scented and soft.",
    ingredients: "Aloe Barbadensis Leaf Extract, Vitamin E, Cherry Blossom Floral Notes.",
    size: "300 ml",
    image: "/products/nykaa-wanderlust-cherry.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 280,
    relatedIds: ["p-plix-pineapple-body-wash","p-chemistatplay-exfoliating-body-wash"],
    gallery: [
      {
            "label": "Nykaa Wanderlust Cherry Blossom",
            "url": "/products/nykaa-wanderlust-cherry.jpg",
            "tone": "#fdf1f4"
      }
],
  },
  {
    id: "p-nykaa-wanderlust-sea-salt",
    slug: "nykaa-wanderlust-mediterranean-sea-salt-body-wash",
    name: "Nykaa Wanderlust Mediterranean Sea Salt Body Wash",
    brandId: "br-nykaa",
    categoryId: "cat-bath",
    description: "Crisp aquatic body cleanser with ocean minerals and soothing Aloe Vera.",
    details: "Energizing morning shower gel with fresh Mediterranean breeze notes.",
    ingredients: "Sea Minerals, Aloe Vera, Vitamin E, Crisp Aquatic Notes.",
    size: "300 ml",
    image: "/products/nykaa-wanderlust-sea-salt.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.7,
    reviewCount: 180,
    relatedIds: ["p-nykaa-wanderlust-cherry","p-plix-pineapple-body-wash"],
    gallery: [
      {
            "label": "Nykaa Wanderlust Sea Salt",
            "url": "/products/nykaa-wanderlust-sea-salt.jpg",
            "tone": "#eef6f9"
      }
],
  },
  {
    id: "p-nykaa-wanderlust-macadamia",
    slug: "nykaa-wanderlust-hawaiian-macadamia-body-wash",
    name: "Nykaa Wanderlust Hawaiian Macadamia Body Wash",
    brandId: "br-nykaa",
    categoryId: "cat-bath",
    description: "Nourishing nutty body wash packed with cold-pressed Hawaiian macadamia extract.",
    details: "Deeply moisturizing creamy lather for dry skin.",
    ingredients: "Macadamia Oil, Aloe Vera, Botanical Glycerin.",
    size: "300 ml",
    image: "/products/nykaa-wanderlust-macadamia.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.8,
    reviewCount: 165,
    relatedIds: ["p-nykaa-wanderlust-cherry"],
    gallery: [
      {
            "label": "Nykaa Wanderlust Macadamia",
            "url": "/products/nykaa-wanderlust-macadamia.jpg",
            "tone": "#f8f3ed"
      }
],
  },
  {
    id: "p-nykaa-wanderlust-green-apple",
    slug: "nykaa-wanderlust-sicilian-green-apple-body-wash",
    name: "Nykaa Wanderlust Sicilian Green Apple Body Wash",
    brandId: "br-nykaa",
    categoryId: "cat-bath",
    description: "Zesty, crisp green apple scented body cleanser that revives tired skin.",
    details: "Bright and invigorating daily lather.",
    ingredients: "Green Apple Extract, Aloe Vera, Vitamin E.",
    size: "300 ml",
    image: "/products/nykaa-wanderlust-green-apple.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.7,
    reviewCount: 140,
    relatedIds: ["p-nykaa-wanderlust-cherry"],
    gallery: [
      {
            "label": "Nykaa Wanderlust Green Apple",
            "url": "/products/nykaa-wanderlust-green-apple.jpg",
            "tone": "#f2f9f1"
      }
],
  },
  {
    id: "p-plix-pineapple-body-wash",
    slug: "plix-pineapple-smooth-skin-juicy-body-wash",
    name: "Plix Pineapple Smooth Skin Juicy Body Wash",
    brandId: "br-plix",
    categoryId: "cat-bath",
    description: "Gentle fruit AHA body cleanser with Bromelain Pineapple extract to buff away bumps.",
    details: "Tropical foaming lather with real fruit aromas that clears strawberry skin.",
    ingredients: "Pineapple Fruit Extract, Bromelain, Lactic Acid, Betaine.",
    size: "250 ml",
    image: "/products/plix-pineapple-body-wash.jpg",
    mrp: 400,
    price: 369,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 210,
    relatedIds: ["p-chemistatplay-exfoliating-body-wash","p-lux-radiant-glow-body-wash"],
    gallery: [
      {
            "label": "Plix Pineapple Body Wash",
            "url": "/products/plix-pineapple-body-wash.jpg",
            "tone": "#fef9e7"
      }
],
  },
  {
    id: "p-lux-radiant-glow-body-wash",
    slug: "lux-radiant-body-wash",
    name: "Lux Radiant Body Wash",
    brandId: "br-lux",
    categoryId: "cat-bath",
    description: "Formulated with precious French Rose extract and Vitamin C glow pearls for soft, radiant skin.",
    details: "Budget luxury body wash with an intoxicating rose perfume aroma.",
    ingredients: "French Rose Extracts, Vitamin C Glow Essence, Honey Nectar.",
    size: "100 ml",
    image: "/products/lux-radiant-glow-body-wash.jpg",
    mrp: 99,
    price: 89,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 540,
    relatedIds: ["p-plix-pineapple-body-wash","p-mcaffeine-sweet-escape-lotion"],
    gallery: [
      {
            "label": "Lux Radiant Body Wash",
            "url": "/products/lux-radiant-glow-body-wash.jpg",
            "tone": "#fdf1f2"
      }
],
  },
  {
    id: "p-chemistatplay-exfoliating-body-wash",
    slug: "chemist-at-play-daily-exfoliating-body-wash",
    name: "Chemist at Play Daily Exfoliating Body Wash",
    brandId: "br-chemistatplay",
    categoryId: "cat-bath",
    description: "India's #1 ceramide-based body wash with Lactic Acid that gently removes rough bumps and dead skin.",
    details: "Formulated with 3 essential skin-identical ceramides to repair the skin barrier.",
    ingredients: "Ceramide NP, Lactic Acid, Zemea Propanediol, Vitamin E.",
    size: "236 ml",
    image: "/products/chemistatplay-exfoliating-body-wash.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 410,
    relatedIds: ["p-chemistatplay-brightening-body-wash","p-wishcare-sunscreen-body-lotion"],
    gallery: [
      {
            "label": "Exfoliating Body Wash",
            "url": "/products/chemistatplay-exfoliating-body-wash.jpg",
            "tone": "#f2f8f5"
      }
],
  },
  {
    id: "p-chemistatplay-brightening-body-wash",
    slug: "chemist-at-play-brightening-body-wash",
    name: "Chemist at Play Brightening Body Wash",
    brandId: "br-chemistatplay",
    categoryId: "cat-bath",
    description: "Ceramide-infused body cleanser powered by Vitamin C & Niacinamide to fade body tan and dark spots.",
    details: "Gentle daily cleanser that evens out skin tone without drying.",
    ingredients: "Ceramide NP, 2% Niacinamide, Vitamin C, Glycerin.",
    size: "236 ml",
    image: "/products/chemistatplay-brightening-body-wash.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 390,
    relatedIds: ["p-chemistatplay-exfoliating-body-wash","p-wishcare-sunscreen-body-lotion"],
    gallery: [
      {
            "label": "Brightening Body Wash",
            "url": "/products/chemistatplay-brightening-body-wash.jpg",
            "tone": "#fdf8ee"
      }
],
  },
  {
    id: "p-bellavita-skai-shower-gel",
    slug: "bellavita-skai-shower-gel",
    name: "Bella Vita SKAI Shower Gel",
    brandId: "br-bellavita",
    categoryId: "cat-bath",
    description: "Invigorating aquatic fine-fragrance shower gel formulated with Aloe Vera and fresh French perfume oils.",
    details: "Energizing crisp aquatic morning awakening shower wash.",
    ingredients: "Aloe Barbadensis Leaf Juice, Aquatic Fragrance Elixir, Vitamin E.",
    size: "250 ml",
    image: "/products/bellavita-skai-shower-gel.jpg",
    mrp: 499,
    price: 399,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 290,
    relatedIds: ["p-bellavita-white-oud","p-chemistatplay-exfoliating-body-wash"],
    gallery: [
      {
            "label": "SKAI Shower Gel",
            "url": "/products/bellavita-skai-shower-gel.jpg",
            "tone": "#edf5fa"
      }
],
  },
  {
    id: "p-plix-pineapple-depigmentation-serum-30",
    slug: "plix-pineapple-de-pigmentation-serum-30ml",
    name: "Plix Pineapple De-Pigmentation Serum 30ml",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Concentrated plant-active face elixir targeting dark spots and hyperpigmentation with 2% Alpha Arbutin.",
    details: "Lightweight, non-sticky serum that boosts clarity and fades sun tan.",
    ingredients: "Pineapple Fruit Extract, 2% Alpha Arbutin, Niacinamide, Hyaluronic Acid.",
    size: "30 ml",
    image: "/products/plix-pineapple-depigmentation-serum.jpg",
    mrp: 599,
    price: 525,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 380,
    relatedIds: ["p-plix-pineapple-depigmentation-serum-50","p-plix-guava-glow-serum-30"],
    gallery: [
      {
            "label": "Pineapple Serum 30ml",
            "url": "/products/plix-pineapple-depigmentation-serum.jpg",
            "tone": "#fef9e8"
      }
],
  },
  {
    id: "p-plix-pineapple-depigmentation-serum-50",
    slug: "plix-pineapple-de-pigmentation-serum-50ml",
    name: "Plix Pineapple De-Pigmentation Serum 50ml",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Value 50ml pack of Plix's bestselling Alpha Arbutin & Pineapple de-pigmentation active serum.",
    details: "Daily glow elixir for stubborn pigmentation and uneven tone.",
    ingredients: "Pineapple Fruit Extract, 2% Alpha Arbutin, Niacinamide, Hyaluronic Acid.",
    size: "50 ml",
    image: "/products/plix-pineapple-depigmentation-serum-50.jpg",
    mrp: 699,
    price: 575,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 290,
    relatedIds: ["p-plix-pineapple-depigmentation-serum-30"],
    gallery: [
      {
            "label": "Pineapple Serum 50ml",
            "url": "/products/plix-pineapple-depigmentation-serum-50.jpg",
            "tone": "#fef9e8"
      }
],
  },
  {
    id: "p-plix-guava-glow-serum-30",
    slug: "plix-guava-glow-serum-30ml",
    name: "Plix Guava Glow Serum 30ml",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Potent Vitamin C & Guava extract serum that restores natural glow and shields from free radicals.",
    details: "Fast-absorbing dewy formula for luminous morning brightness.",
    ingredients: "Guava Extract, Ethyl Ascorbic Acid, Sodium Hyaluronate.",
    size: "30 ml",
    image: "/products/plix-guava-glow-serum.jpg",
    mrp: 549,
    price: 475,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 310,
    relatedIds: ["p-plix-guava-glow-serum-50","p-dotkey-vitc-moisturizer"],
    gallery: [
      {
            "label": "Guava Glow Serum 30ml",
            "url": "/products/plix-guava-glow-serum.jpg",
            "tone": "#fef9e8"
      }
],
  },
  {
    id: "p-plix-guava-glow-serum-50",
    slug: "plix-guava-glow-serum-50ml",
    name: "Plix Guava Glow Serum 50ml",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Value 50ml size of Plix Guava Glow Vitamin C serum for continuous radiant hydration.",
    details: "Restores dull, sun-tired skin to full dewy bounce.",
    ingredients: "Guava Extract, Vitamin C, Hyaluronic Acid.",
    size: "50 ml",
    image: "/products/plix-guava-glow-serum-50.jpg",
    mrp: 650,
    price: 550,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 240,
    relatedIds: ["p-plix-guava-glow-serum-30"],
    gallery: [
      {
            "label": "Guava Glow Serum 50ml",
            "url": "/products/plix-guava-glow-serum-50.jpg",
            "tone": "#fef9e8"
      }
],
  },
  {
    id: "p-plix-pomegranate-serum",
    slug: "plix-pomegranate-youth-renewal-serum",
    name: "Plix Pomegranate Youth Renewal Serum",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Infused with antioxidant-rich Pomegranate extract and multi-peptides to firm skin and plump fine lines.",
    details: "Anti-aging botanical serum that rebuilds collagen elasticity.",
    ingredients: "Pomegranate Extract, Copper Peptide, Multi-Peptides, Hyaluronic Acid.",
    size: "30 ml",
    image: "/products/plix-pomegranate-serum.jpg",
    mrp: 650,
    price: 550,
    inStock: true,
    isNew: true,
    isBestseller: false,
    offerIds: [],
    rating: 4.8,
    reviewCount: 190,
    relatedIds: ["p-plix-pineapple-depigmentation-serum-30"],
    gallery: [
      {
            "label": "Pomegranate Serum",
            "url": "/products/plix-pomegranate-serum.jpg",
            "tone": "#fef9e8"
      }
],
  },
  {
    id: "p-plix-jamun-serum",
    slug: "plix-jamun-acne-control-serum",
    name: "Plix Jamun Acne Control Serum",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Active Jamun fruit extract and Salicylic Acid to treat active acne, unclog pores, and reduce excess sebum.",
    details: "Soothing clarifying serum for blemish-free skin.",
    ingredients: "Jamun Extract, 2% Salicylic Acid, Zinc PCA, Centella Asiatica.",
    size: "30 ml",
    image: "/products/plix-jamun-serum.jpg",
    mrp: 599,
    price: 525,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 220,
    relatedIds: ["p-plix-cleanser-jamun"],
    gallery: [
      {
            "label": "Jamun Acne Serum",
            "url": "/products/plix-jamun-serum.jpg",
            "tone": "#fef9e8"
      }
],
  },
  {
    id: "p-plix-cleanser-pineapple",
    slug: "plix-pineapple-de-pigmentation-juicy-cleanser-face-wash",
    name: "Plix Pineapple De-Pigmentation Juicy Cleanser Face Wash",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Juicy foaming cleanser with pineapple enzymes that clears grime and fades surface discoloration.",
    details: "Non-drying daily face cleanser for dewy brightness.",
    ingredients: "Pineapple Extract, Alpha Arbutin, Betaine.",
    size: "100 ml",
    image: "/products/plix-pineapple-cleanser.jpg",
    mrp: 375,
    price: 349,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 270,
    relatedIds: ["p-plix-pineapple-depigmentation-serum-30"],
    gallery: [
      {
            "label": "Pineapple Cleanser",
            "url": "/products/plix-pineapple-cleanser.jpg",
            "tone": "#fef8ea"
      }
],
  },
  {
    id: "p-plix-cleanser-pomegranate",
    slug: "plix-pomegranate-youth-renewal-cleanser-face-wash",
    name: "Plix Pomegranate Youth Renewal Cleanser Face Wash",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Gentle antioxidant face wash that removes impurities and promotes skin firmness.",
    details: "Rich lather with nourishing pomegranate nectars.",
    ingredients: "Pomegranate Extract, Peptides, Vitamin E.",
    size: "100 ml",
    image: "/products/plix-pomegranate-cleanser.jpg",
    mrp: 375,
    price: 349,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.7,
    reviewCount: 160,
    relatedIds: ["p-plix-pomegranate-serum"],
    gallery: [
      {
            "label": "Pomegranate Cleanser",
            "url": "/products/plix-pomegranate-cleanser.jpg",
            "tone": "#fef8ea"
      }
],
  },
  {
    id: "p-plix-cleanser-jamun",
    slug: "plix-jamun-active-acne-face-wash",
    name: "Plix Jamun Active Acne Face Wash",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Deep clarifying gel wash with Indian Jamun and Salicylic acid that cleanses oily pores.",
    details: "Reduces breakouts and keeps skin calm without flaking.",
    ingredients: "Jamun Fruit Extract, Salicylic Acid, Zinc.",
    size: "100 ml",
    image: "/products/plix-jamun-cleanser.jpg",
    mrp: 375,
    price: 349,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 240,
    relatedIds: ["p-plix-jamun-serum"],
    gallery: [
      {
            "label": "Jamun Face Wash",
            "url": "/products/plix-jamun-cleanser.jpg",
            "tone": "#fef8ea"
      }
],
  },
  {
    id: "p-plix-cleanser-guava",
    slug: "plix-guava-glow-cleanser-face-wash",
    name: "Plix Guava Glow Cleanser Face Wash",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Energizing vitamin-burst face wash that revives dull, tired complexion.",
    details: "Soft foaming face wash with fresh natural guava scent.",
    ingredients: "Guava Extract, Vitamin C, Glycerin.",
    size: "100 ml",
    image: "/products/plix-guava-cleanser.jpg",
    mrp: 375,
    price: 349,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.8,
    reviewCount: 190,
    relatedIds: ["p-plix-guava-glow-serum-30"],
    gallery: [
      {
            "label": "Guava Glow Cleanser",
            "url": "/products/plix-guava-cleanser.jpg",
            "tone": "#fef8ea"
      }
],
  },
  {
    id: "p-wishcare-sunscreen-body-lotion",
    slug: "wishcare-sunscreen-body-lotion",
    name: "WishCare Sunscreen Body Lotion",
    brandId: "br-wishcare",
    categoryId: "cat-bath",
    description: "Broad-spectrum UV body sunscreen lotion with zero white cast, non-sticky feel, and 5 ceramides.",
    details: "Water and sweat resistant formula infused with Niacinamide and Carrot Seed Extract.",
    ingredients: "Hybrid UV Filters, 5 Essential Ceramides, Niacinamide.",
    size: "200 ml",
    image: "/products/wishcare-sunscreen-body-lotion.jpg",
    mrp: 499,
    price: 449,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 390,
    relatedIds: ["p-wishcare-vitc-sunscreen","p-mcaffeine-sweet-escape-lotion"],
    gallery: [
      {
            "label": "WishCare Sunscreen Lotion",
            "url": "/products/wishcare-sunscreen-body-lotion.jpg",
            "tone": "#edf8f2"
      }
],
  },
  {
    id: "p-dermaco-1-kojic-acid-facewash",
    slug: "derma-co-1-percent-kojic-acid-daily-facewash",
    name: "The Derma Co 1% Kojic Acid Daily Face Wash",
    brandId: "br-dermaco",
    categoryId: "cat-skincare",
    description: "Dermatologist-designed cleanser with 1% Kojic Acid and Alpha Arbutin that reduces dark spots and sun tan.",
    details: "Gentle non-drying daily cleanser that lifts dull surface skin.",
    ingredients: "1% Kojic Acid, Alpha Arbutin, Niacinamide, Glycerin.",
    size: "100 ml",
    image: "/products/dermaco-1-kojic-acid-facewash.jpg",
    mrp: 299,
    price: 269,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 480,
    relatedIds: ["p-dotkey-facewash-hydrating","p-chemistatplay-fw-vitc"],
    gallery: [
      {
            "label": "1% Kojic Acid Face Wash",
            "url": "/products/dermaco-1-kojic-acid-facewash.jpg",
            "tone": "#edf5f0"
      }
],
  },
  {
    id: "p-nykaa-fw-ricewater",
    slug: "nykaa-naturals-rice-water-and-glycolic-acid-face-wash",
    name: "Nykaa Naturals Rice Water & Glycolic Acid Face Wash",
    brandId: "br-nykaa",
    categoryId: "cat-skincare",
    description: "Korean inspired glass-skin face cleanser with fermented rice water and gentle exfoliating glycolic acid.",
    details: "Soap-free, gentle daily cleanser that purifies skin and restores clarity.",
    ingredients: "Fermented Rice Water, Glycolic Acid, Glycerin.",
    size: "100 ml",
    image: "/products/nykaa-fw-ricewater.jpg",
    mrp: 249,
    price: 199,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 310,
    relatedIds: ["p-nykaa-fw-saffron","p-dotkey-facewash-hydrating"],
    gallery: [
      {
            "label": "Rice Water Face Wash",
            "url": "/products/nykaa-fw-ricewater.jpg",
            "tone": "#fcf3f5"
      }
],
  },
  {
    id: "p-nykaa-fw-saffron",
    slug: "nykaa-naturals-saffron-and-honey-face-wash",
    name: "Nykaa Naturals Saffron & Honey Face Wash",
    brandId: "br-nykaa",
    categoryId: "cat-skincare",
    description: "Ayurvedic brightening face cleanser with natural Kashmir saffron and wild honey.",
    details: "Imparts golden radiance while keeping skin soft.",
    ingredients: "Pure Saffron, Wild Forest Honey, Aloe Vera.",
    size: "100 ml",
    image: "/products/nykaa-fw-saffron.jpg",
    mrp: 249,
    price: 199,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.7,
    reviewCount: 240,
    relatedIds: ["p-nykaa-fw-ricewater"],
    gallery: [
      {
            "label": "Saffron & Honey Face Wash",
            "url": "/products/nykaa-fw-saffron.jpg",
            "tone": "#fcf3f5"
      }
],
  },
  {
    id: "p-nykaa-fw-berries",
    slug: "nykaa-naturals-superberries-and-peptide-face-wash",
    name: "Nykaa Naturals Superberries & Peptide Face Wash",
    brandId: "br-nykaa",
    categoryId: "cat-skincare",
    description: "Antioxidant superberry and peptide face cleanser that plumps and defends against pollution.",
    details: "Nourishing daily wash for youthful skin resilience.",
    ingredients: "Acai Berry, Blueberry Extract, Peptides.",
    size: "100 ml",
    image: "/products/nykaa-fw-berries.jpg",
    mrp: 249,
    price: 199,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.7,
    reviewCount: 180,
    relatedIds: ["p-nykaa-fw-ricewater"],
    gallery: [
      {
            "label": "Superberries Face Wash",
            "url": "/products/nykaa-fw-berries.jpg",
            "tone": "#fcf3f5"
      }
],
  },
  {
    id: "p-dotkey-facewash-hydrating",
    slug: "dot-and-key-hydrating-gentle-facewash",
    name: "Dot & Key Hydrating Gentle Face Wash",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Barrier repair face cleanser that deep-cleans without disrupting delicate moisture lipids.",
    details: "Free from harsh sulfates, parabens, or artificial fragrance.",
    ingredients: "Ceramides, Hyaluronic Acid, Probiotics.",
    size: "100 ml",
    image: "/products/dotkey-facewash-barrier.jpg",
    mrp: 295,
    price: 249,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 360,
    relatedIds: ["p-dotkey-facewash-niacinamide","p-dotkey-vitc-moisturizer"],
    gallery: [
      {
            "label": "Hydrating Gentle Face Wash",
            "url": "/products/dotkey-facewash-barrier.jpg",
            "tone": "#fcf1f4"
      }
],
  },
  {
    id: "p-dotkey-facewash-niacinamide",
    slug: "dot-and-key-niacinamide-gel-facewash",
    name: "Dot & Key Niacinamide Gel Face Wash",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Clarifying gel wash with Niacinamide & Cica to balance excess oil and calm inflammation.",
    details: "Light soothing daily lather for acne-prone skin.",
    ingredients: "2% Niacinamide, Cica (Centella Asiatica), Green Tea.",
    size: "100 ml",
    image: "/products/dotkey-facewash.jpg",
    mrp: 295,
    price: 249,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 310,
    relatedIds: ["p-dotkey-facewash-hydrating","p-dotkey-oilfree-moisturizer"],
    gallery: [
      {
            "label": "Niacinamide Face Wash",
            "url": "/products/dotkey-facewash.jpg",
            "tone": "#fcf1f4"
      }
],
  },
  {
    id: "p-dotkey-facewash-cooling",
    slug: "dot-and-key-cooling-gel-face-wash",
    name: "Dot & Key Cooling Gel Face Wash",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Refreshing watermelon and menthol face cleanser that cools flushed skin and removes grime.",
    details: "Instant cooling burst for hot sunny days.",
    ingredients: "Watermelon Extract, Hyaluronic Acid, Menthol Crystals.",
    size: "100 ml",
    image: "/products/dotkey-facewash-watermelon.jpg",
    mrp: 295,
    price: 249,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.7,
    reviewCount: 220,
    relatedIds: ["p-dotkey-facewash-hydrating"],
    gallery: [
      {
            "label": "Cooling Gel Face Wash",
            "url": "/products/dotkey-facewash-watermelon.jpg",
            "tone": "#fcf1f4"
      }
],
  },
  {
    id: "p-plum-fw-greentea",
    slug: "plum-green-tea-pore-cleansing-face-wash",
    name: "Plum Green Tea Pore Cleansing Face Wash",
    brandId: "br-plum",
    categoryId: "cat-skincare",
    description: "100% vegan soap-free cleanser with Green Tea extracts and gentle glycolic acid that clears oily pores.",
    details: "Gentle cellulose beads sweep away sebum without micro-tears.",
    ingredients: "Green Tea Extracts, Glycolic Acid, Cellulose Beads.",
    size: "100 ml",
    image: "/products/plum-greentea-facewash.jpg",
    mrp: 345,
    price: 299,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 450,
    relatedIds: ["p-plum-fw-saffron","p-dotkey-facewash-hydrating"],
    gallery: [
      {
            "label": "Plum Green Tea Face Wash",
            "url": "/products/plum-greentea-facewash.jpg",
            "tone": "#eef6f0"
      }
],
  },
  {
    id: "p-plum-fw-saffron",
    slug: "plum-saffron-and-papaya-glow-bright-face-wash",
    name: "Plum Saffron & Papaya Glow Bright Face Wash",
    brandId: "br-plum",
    categoryId: "cat-skincare",
    description: "Radiant botanical face cleanser with real saffron threads and papaya enzymes that buff away dead skin.",
    details: "Promotes an even, luminous complexion.",
    ingredients: "Saffron Extract, Papaya Enzyme (Papain), Vitamin B5.",
    size: "100 ml",
    image: "/products/plum-saffron-facewash.jpg",
    mrp: 345,
    price: 299,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 280,
    relatedIds: ["p-plum-fw-greentea"],
    gallery: [
      {
            "label": "Plum Saffron Face Wash",
            "url": "/products/plum-saffron-facewash.jpg",
            "tone": "#eef6f0"
      }
],
  },
  {
    id: "p-plum-fw-niacinamide",
    slug: "plum-niacinamide-simply-bright-face-wash",
    name: "Plum Niacinamide Simply Bright Face Wash",
    brandId: "br-plum",
    categoryId: "cat-skincare",
    description: "Formulated with pure Niacinamide to fade acne spots and strengthen skin barrier resilience.",
    details: "Gentle daily brightening cleanser.",
    ingredients: "Niacinamide, Fermented Rice Water, Oat Extract.",
    size: "100 ml",
    image: "/products/plum-niacinamide-facewash.jpg",
    mrp: 345,
    price: 299,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.7,
    reviewCount: 210,
    relatedIds: ["p-plum-fw-greentea"],
    gallery: [
      {
            "label": "Plum Niacinamide Face Wash",
            "url": "/products/plum-niacinamide-facewash.jpg",
            "tone": "#eef6f0"
      }
],
  },
  {
    id: "p-chemistatplay-fw-vitc",
    slug: "chemist-at-play-vitamin-c-brightening-boost-face-wash",
    name: "Chemist at Play Vitamin C Brightening Boost Face Wash",
    brandId: "br-chemistatplay",
    categoryId: "cat-skincare",
    description: "Ceramide-infused face wash with Vitamin C that revitalizes dull skin and fades discoloration.",
    details: "Maintains skin barrier health while clarifying pores.",
    ingredients: "Ceramide NP, Ethyl Ascorbic Acid, Glycerin.",
    size: "100 ml",
    image: "/products/chemistatplay-vitc-facewash.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 320,
    relatedIds: ["p-chemistatplay-fw-hyaluronic","p-chemistatplay-brightening-body-wash"],
    gallery: [
      {
            "label": "Vitamin C Face Wash",
            "url": "/products/chemistatplay-vitc-facewash.jpg",
            "tone": "#f0f6f2"
      }
],
  },
  {
    id: "p-chemistatplay-fw-hyaluronic",
    slug: "chemist-at-play-hyaluronic-acid-gentle-hydrating-face-wash",
    name: "Chemist at Play Hyaluronic Acid Gentle Hydrating Face Wash",
    brandId: "br-chemistatplay",
    categoryId: "cat-skincare",
    description: "Ultra-gentle hydrating cleanser packed with Hyaluronic Acid and 3 essential Ceramides.",
    details: "Does not strip moisture; ideal for dry, sensitive, or combination skin.",
    ingredients: "Hyaluronic Acid, Ceramide NP, Ceramide AP, Phytosphingosine.",
    size: "100 ml",
    image: "/products/chemistatplay-hydrating-facewash.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 260,
    relatedIds: ["p-chemistatplay-fw-vitc"],
    gallery: [
      {
            "label": "Hyaluronic Acid Face Wash",
            "url": "/products/chemistatplay-hydrating-facewash.jpg",
            "tone": "#f0f6f2"
      }
],
  },
  {
    id: "p-chemistatplay-fw-aha",
    slug: "chemist-at-play-4-percent-aha-gentle-exfoliating-face-wash",
    name: "Chemist at Play 4% AHA Gentle Exfoliating Face Wash",
    brandId: "br-chemistatplay",
    categoryId: "cat-skincare",
    description: "4% AHA blend of Glycolic and Lactic Acid to dissolve dead skin cells and clear congestion.",
    details: "Promotes refined texture and unclogged pores.",
    ingredients: "Glycolic Acid, Lactic Acid, Ceramides.",
    size: "100 ml",
    image: "/products/chemistatplay-aha-facewash.jpg",
    mrp: 399,
    price: 349,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.8,
    reviewCount: 230,
    relatedIds: ["p-chemistatplay-fw-vitc"],
    gallery: [
      {
            "label": "AHA Face Wash",
            "url": "/products/chemistatplay-aha-facewash.jpg",
            "tone": "#f0f6f2"
      }
],
  },
  {
    id: "p-dotkey-sun-barrier",
    slug: "dot-and-key-barrier-repair-sunscreen-spf-50",
    name: "Dot & Key Barrier Repair Sunscreen SPF 50+",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Ceramide barrier repair sunscreen offering broad spectrum SPF 50+ PA++++ with zero white cast.",
    details: "Protects against UVA, UVB, and blue light while locking in hydration.",
    ingredients: "Hybrid UV Filters, 5 Ceramides, Hyaluronic Acid.",
    size: "50 g",
    image: "/products/dotkey-sunscreen-barrier.jpg",
    mrp: 495,
    price: 445,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 450,
    relatedIds: ["p-dotkey-sun-superbright","p-dotkey-vitc-moisturizer"],
    gallery: [
      {
            "label": "Barrier Repair Sunscreen",
            "url": "/products/dotkey-sunscreen-barrier.jpg",
            "tone": "#edf6fa"
      }
],
  },
  {
    id: "p-dotkey-sun-superbright",
    slug: "dot-and-key-super-bright-sunscreen-spf-50",
    name: "Dot & Key Super Bright Sunscreen SPF 50+",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Vitamin C+E infused sunscreen that guards against sun damage and brightens dull complexion.",
    details: "Lightweight fluid texture that absorbs instantly.",
    ingredients: "Photostable Filters, Vitamin C, Vitamin E, Blood Orange.",
    size: "50 g",
    image: "/products/dotkey-sunscreen-vitc.jpg",
    mrp: 495,
    price: 445,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 390,
    relatedIds: ["p-dotkey-sun-barrier","p-dotkey-vitc-moisturizer"],
    gallery: [
      {
            "label": "Super Bright Sunscreen",
            "url": "/products/dotkey-sunscreen-vitc.jpg",
            "tone": "#edf6fa"
      }
],
  },
  {
    id: "p-dotkey-sun-cooling",
    slug: "dot-and-key-cooling-sunscreen-spf-50",
    name: "Dot & Key Cooling Sunscreen SPF 50+",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Watermelon cooling sunscreen with SPF 50+ PA++++ that calms overheated skin.",
    details: "Instantly refreshes and soothes without stickiness.",
    ingredients: "Watermelon Extract, Hyaluronic Acid, UV Filters.",
    size: "50 g",
    image: "/products/dotkey-sunscreen-cooling.jpg",
    mrp: 495,
    price: 445,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.8,
    reviewCount: 260,
    relatedIds: ["p-dotkey-sun-barrier"],
    gallery: [
      {
            "label": "Cooling Sunscreen",
            "url": "/products/dotkey-sunscreen-cooling.jpg",
            "tone": "#edf6fa"
      }
],
  },
  {
    id: "p-dotkey-sun-mattifying",
    slug: "dot-and-key-mattifying-sunscreen-spf-50",
    name: "Dot & Key Mattifying Sunscreen SPF 50+",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Cica mattifying oil-free sunscreen SPF 50+ designed for oily and acne-prone skin.",
    details: "Non-greasy powdery matte finish that controls midday shine.",
    ingredients: "Cica Extract, Zinc Oxide, Niacinamide, UV Filters.",
    size: "50 g",
    image: "/products/dotkey-sunscreen-mattifying.jpg",
    mrp: 495,
    price: 445,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 310,
    relatedIds: ["p-dotkey-sun-barrier","p-dotkey-oilfree-moisturizer"],
    gallery: [
      {
            "label": "Mattifying Sunscreen",
            "url": "/products/dotkey-sunscreen-mattifying.jpg",
            "tone": "#edf6fa"
      }
],
  },
  {
    id: "p-dotkey-micellar-facewash",
    slug: "dot-and-key-micellar-face-wash-120ml",
    name: "Dot & Key Micellar Face Wash 120ml",
    brandId: "br-dotkey",
    categoryId: "cat-skincare",
    description: "Micellar water infused foaming cleanser that dissolves makeup, sunscreen, and grime in one soothing wash.",
    details: "Gentle formula with 5 Ceramides and Hyaluronic Acid.",
    ingredients: "Micellar Technology, 5 Essential Ceramides, Hyaluronic Acid.",
    size: "120 ml",
    image: "/products/dotkey-micellar-facewash.jpg",
    mrp: 329,
    price: 289,
    inStock: true,
    isNew: true,
    isBestseller: false,
    offerIds: [],
    rating: 4.8,
    reviewCount: 220,
    relatedIds: ["p-dotkey-facewash-hydrating","p-dotkey-sun-barrier"],
    gallery: [
      {
            "label": "Micellar Face Wash",
            "url": "/products/dotkey-micellar-facewash.jpg",
            "tone": "#fdf3f4"
      }
],
  },
  {
    id: "p-plix-flaxseed-shampoo",
    slug: "plix-flax-seed-ultra-smooth-shampoo",
    name: "Plix Flax Seed Ultra Smooth Shampoo",
    brandId: "br-plix",
    categoryId: "cat-hair",
    description: "Cold-pressed flaxseed oil and plant protein shampoo that tames frizz and restores silky smoothness.",
    details: "Free of sulfates, parabens, and harsh silicones.",
    ingredients: "Flaxseed Oil, Pea Protein, D-Panthenol.",
    size: "300 ml",
    image: "/products/plix-flaxseed-shampoo.jpg",
    mrp: 450,
    price: 399,
    inStock: true,
    isNew: true,
    isBestseller: false,
    offerIds: [],
    rating: 4.7,
    reviewCount: 190,
    relatedIds: ["p-plix-flaxseed-conditioner","p-plix-rosemary-oil"],
    gallery: [
      {
            "label": "Flaxseed Shampoo",
            "url": "/products/plix-flaxseed-shampoo.jpg",
            "tone": "#f2f8f0"
      }
],
  },
  {
    id: "p-plix-flaxseed-conditioner",
    slug: "plix-ultra-smooth-flax-seed-conditioner",
    name: "Plix Ultra Smooth Flax Seed Conditioner",
    brandId: "br-plix",
    categoryId: "cat-hair",
    description: "Deep conditioning restorative cream with rich Omega 3 from flaxseed that locks in moisture.",
    details: "Eliminates frizz and tangles instantly.",
    ingredients: "Flaxseed Oil, Shea Butter, Argan Oil.",
    size: "200 ml",
    image: "/products/plix-flaxseed-conditioner.jpg",
    mrp: 450,
    price: 399,
    inStock: true,
    isNew: true,
    isBestseller: false,
    offerIds: [],
    rating: 4.7,
    reviewCount: 170,
    relatedIds: ["p-plix-flaxseed-shampoo"],
    gallery: [
      {
            "label": "Flaxseed Conditioner",
            "url": "/products/plix-flaxseed-conditioner.jpg",
            "tone": "#f2f8f0"
      }
],
  },
  {
    id: "p-plix-guava-sunscreen",
    slug: "plix-guava-glow-sunscreen",
    name: "Plix Guava Glow Sunscreen",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Fruit active SPF 50+ sunscreen powered by Vitamin C and Guava extract for an illuminating glass skin finish.",
    details: "Broad spectrum protection without white residue.",
    ingredients: "Guava Extract, Vitamin C, Hybrid UV Filters.",
    size: "50 g",
    image: "/products/plix-guava-sunscreen.jpg",
    mrp: 499,
    price: 449,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.8,
    reviewCount: 180,
    relatedIds: ["p-plix-pineapple-sunscreen","p-dotkey-sun-barrier"],
    gallery: [
      {
            "label": "Guava Glow Sunscreen",
            "url": "/products/plix-guava-sunscreen.jpg",
            "tone": "#fef9e8"
      }
],
  },
  {
    id: "p-plix-pineapple-sunscreen",
    slug: "plix-pineapple-advanced-de-pigmentation-sunscreen",
    name: "Plix Pineapple Advanced De-Pigmentation Sunscreen",
    brandId: "br-plix",
    categoryId: "cat-skincare",
    description: "Pineapple bromelain and alpha arbutin infused SPF 50+ sunscreen that fights pigmentation while shielding against UV rays.",
    details: "Non-comedogenic daily sun shield.",
    ingredients: "Pineapple Extract, Alpha Arbutin, UV Filters.",
    size: "50 g",
    image: "/products/plix-pineapple-sunscreen.jpg",
    mrp: 499,
    price: 449,
    inStock: true,
    isNew: false,
    isBestseller: false,
    offerIds: [],
    rating: 4.8,
    reviewCount: 175,
    relatedIds: ["p-plix-guava-sunscreen"],
    gallery: [
      {
            "label": "Pineapple Sunscreen",
            "url": "/products/plix-pineapple-sunscreen.jpg",
            "tone": "#fef9e8"
      }
],
  },
  {
    id: "p-nivea-men-deep-impact",
    slug: "nivea-men-deep-impact-deodorant",
    name: "Nivea Men Deep Impact Deodorant",
    brandId: "br-nivea",
    categoryId: "cat-bath",
    description: "Black Carbon infused antibacterial deodorant spray that protects against odor and delivers an intense woody scent.",
    details: "0% alcohol formula dermatologically approved for skin comfort.",
    ingredients: "Black Carbon, Premium Woody Parfum, Skin Conditioning Agents.",
    size: "150 ml",
    image: "/products/nivea-men-deep-impact.jpg",
    mrp: 249,
    price: 199,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 520,
    relatedIds: ["p-nivea-pearl-beauty","p-bellavita-white-oud"],
    gallery: [
      {
            "label": "Deep Impact Deodorant",
            "url": "/products/nivea-men-deep-impact.jpg",
            "tone": "#ececec"
      }
],
  },
  {
    id: "p-nivea-pearl-beauty",
    slug: "nivea-pearl-and-beauty-deodorant",
    name: "Nivea Pearl & Beauty Deodorant",
    brandId: "br-nivea",
    categoryId: "cat-bath",
    description: "Enriched with precious pearl extracts for smooth underarms while delivering 48 hours of reliable odor protection.",
    details: "Mild floral fine fragrance with gentle Nivea care. 0% alcohol.",
    ingredients: "Pearl Extracts, Avocado Oil, Floral Parfum.",
    size: "150 ml",
    image: "/products/nivea-pearl-beauty.jpg",
    mrp: 249,
    price: 199,
    inStock: true,
    isNew: false,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 480,
    relatedIds: ["p-nivea-men-deep-impact","p-mcaffeine-sweet-escape-lotion"],
    gallery: [
      {
            "label": "Pearl & Beauty Deodorant",
            "url": "/products/nivea-pearl-beauty.jpg",
            "tone": "#fbf2f4"
      }
],
  },
  {
    id: "p-pilgrim-korean-mist",
    slug: "pilgrim-korean-black-rice-and-rosemary-water-spray",
    name: "Pilgrim Korean Black Rice and Rosemary Water Spray",
    brandId: "br-pilgrim",
    categoryId: "cat-hair",
    description: "Fermented Korean Black Rice water & Rosemary mist that strengthens brittle strands and delivers brilliant glass-hair shine.",
    details: "Convenient daily leave-in spray. Lightweight, non-oily water texture.",
    ingredients: "Fermented Black Rice Water, Rosemary Extract, Biotin, Peptides.",
    size: "100 ml",
    image: "/products/pilgrim-korean-black-rice-mist.jpg",
    mrp: 225,
    price: 199,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.8,
    reviewCount: 290,
    relatedIds: ["p-mamaearth-rosemary-oil","p-plix-rosemary-oil"],
    gallery: [
      {
            "label": "Black Rice & Rosemary Mist",
            "url": "/products/pilgrim-korean-black-rice-mist.jpg",
            "tone": "#f5f0ec"
      }
],
  },
  {
    id: "p-wishcare-vitc-sunscreen",
    slug: "wishcare-vitamin-c-sunscreen-spf-50",
    name: "WishCare Vitamin C Sunscreen SPF 50+",
    brandId: "br-wishcare",
    categoryId: "cat-skincare",
    description: "Lightweight, ultra-invisible gel sunscreen formulated with stable Vitamin C and Hyaluronic Acid.",
    details: "Non-greasy fluid texture that absorbs instantly without stinging eyes or clogging pores.",
    ingredients: "Ethyl Ascorbic Acid (Vitamin C), Hyaluronic Acid, Niacinamide, Photostable UV Filters.",
    size: "50 g",
    image: "/products/wishcare-vitc-sunscreen.png",
    mrp: 499,
    price: 449,
    inStock: true,
    isNew: true,
    isBestseller: true,
    offerIds: [],
    rating: 4.9,
    reviewCount: 420,
    relatedIds: ["p-wishcare-sunscreen-body-lotion","p-dotkey-sun-barrier"],
    gallery: [
      {
            "label": "WishCare Vitamin C Sunscreen",
            "url": "/products/wishcare-vitc-sunscreen.png",
            "tone": "#edf7f1"
      }
],
  },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function isEnquiryPrice(p: Product): boolean {
  return p.price == null;
}

export function discountPercent(p: Product): number {
  if (p.mrp == null || p.price == null || p.mrp <= p.price) return 0;
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}
