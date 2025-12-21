// Product Data organized by categories
// To add a product image: Replace the placeholder image path with your actual image path
// Example: image: "/products/whey-protein.jpg" or image: "https://example.com/image.jpg"

export const productCategories = {
  wheyProtein: {
    name: "Whey Protein",
    slug: "whey-protein",
    description: "Premium quality whey protein supplements for muscle building and recovery",
    products: [
      { id: 1, name: "Optimum Nutrition", weight: "2LB/907GM", flavors: "Double Rich Chocolate / Vanilla Ice Cream", price: 2499, image: "", route: "/Product" },
      { id: 2, name: "Optimum Nutrition", weight: "5LB/2.27KG", flavors: "Double Rich Chocolate / Vanilla Ice Cream", price: 5299, image: "", route: "/Product" },
      { id: 3, name: "Dymatize Elite", weight: "5LB/2.27KG", flavors: "Rich Chocolate", price: 4899, image: "", route: "/Product" },
      { id: 4, name: "Labrada Whey", weight: "500G", flavors: "Chocolate / Vanilla / Mocha", price: 1299, image: "", route: "/Product" },
      { id: 5, name: "Labrada Whey", weight: "1KG", flavors: "Chocolate / Vanilla / Mocha", price: 2399, image: "", route: "/Product" },
      { id: 6, name: "Labrada Whey", weight: "1.8KG", flavors: "Chocolate / Vanilla / Mocha", price: 3999, image: "", route: "/Product" },
      { id: 7, name: "MuscleTech Nitro Tech Whey", weight: "450GM", flavors: "Double Rich Chocolate / Cookies & Cream", price: 1599, image: "", route: "/Product" },
      { id: 8, name: "MuscleTech Nitro Tech Whey", weight: "907GM", flavors: "Double Rich Chocolate / Cookies & Cream", price: 2899, image: "", route: "/Product" },
      { id: 9, name: "MuscleTech Nitro Tech Whey", weight: "1.8KG", flavors: "Double Rich Chocolate / Cookies & Cream", price: 5299, image: "", route: "/Product" },
      { id: 10, name: "GNC Whey Pro Performance", weight: "2LB/907GM", flavors: "Chocolate Fudge / Vanilla / Chocolate", price: 2799, image: "", route: "/Product" },
      { id: 11, name: "GNC Whey Pro Performance", weight: "4LB/1.8KG", flavors: "Chocolate Fudge / Vanilla / Chocolate", price: 4999, image: "", route: "/Product" },
      { id: 12, name: "GNC Puro Isolate", weight: "1KG/2KG", flavors: "Chocolate Fudge / Vanilla / Chocolate", price: 3599, image: "", route: "/Product" },
      { id: 13, name: "GNC Select", weight: "1KG", flavors: "Chocolate", price: 2199, image: "", route: "/Product"   },
      { id: 15, name: "BPI Whey HD", weight: "1KG", flavors: "Chocolate Delight", price: 2499, image: "", route: "/Product"   },
      { id: 16, name: "BPI Whey HD", weight: "2KG", flavors: "Chocolate Delight", price: 4299, image: "", route: "/Product"   },
      { id: 17, name: "One Science Whey Protein", weight: "1LB", flavors: "Chocolate Charge", price: 1299, image: "", route: "/Product"   },
      { id: 18, name: "One Science Whey Protein", weight: "2LB/907GM", flavors: "Chocolate Charge", price: 2399, image: "", route: "/Product"   },
      { id: 19, name: "One Science Whey Protein", weight: "4LB/1.8KG", flavors: "Chocolate Charge", price: 4299, image: "", route: "/Product"   },
      { id: 20, name: "Isopure Whey Protein", weight: "1KG", flavors: "Chocolate", price: 2699, image: "", route: "/Product"   },
      { id: 21, name: "Isopure Whey Protein", weight: "2KG", flavors: "Chocolate", price: 4899, image: "",route: "/Product"   },
      { id: 22, name: "MB Biozyme Whey Performance", weight: "1KG/2KG", flavors: "Rich Chocolate / Chocolate Hazelnut / Choco Crispie / Kesar Thandai / Magical Mango", price: 3299, image: "", route: "/Product"   },
      { id: 23, name: "MB Biozyme Whey Isozero", weight: "1KG/2KG", flavors: "Chocolate Fudge / Cookies & Cream", price: 3799, image: "", route: "/Product"   },
      { id: 24, name: "MB Biozyme Whey PR", weight: "1KG/2KG", flavors: "Low Carbs Ice Cream Chocolate / Low Carbs Cookies & Cream", price: 3499, image: "", route: "/Product"   },
      { id: 25, name: "Avvatar Whey Protein", weight: "1KG/2KG", flavors: "Belgian Chocolate / Malai Kulfi / Chocolate Hazelnut", price: 2899, image: "", route: "/Product"   },
      { id: 26, name: "Avvatar 100% Performance Whey", weight: "1KG/2KG", flavors: "Belgian Chocolate / Malai Kulfi / Chocolate Hazelnut", price: 2699, image: "", route: "/Product"   },
      { id: 27, name: "Avvatar Isorich", weight: "1KG/2KG", flavors: "Belgian Chocolate / Malai Kulfi / Chocolate Hazelnut", price: 3199, image: "", route: "/Product"   },
      { id: 28, name: "Fuelone Whey", weight: "1KG/2KG", flavors: "Chocolate", price: 1999, image: "", route: "/Product"   },
      { id: 29, name: "Attom Whey", weight: "1KG/2KG", flavors: "Double Rich Chocolate / French Vanilla", price: 2299, image: "", route: "/Product"   },
      { id: 30, name: "Morphenlab Turbo Whey", weight: "1KG", flavors: "Butter Scotch", price: 1899, image: "", route: "/Product"   },
      { id: 31, name: "Morphenlab Whey Protein", weight: "2KG", flavors: "Chocolate", price: 3299, image: "", route: "/Product"   },
      { id: 32, name: "Absolute Whey Legender", weight: "1KG/2KG", flavors: "Chocolate / Cashew Saffron Pistachio", price: 2599, image: "", route: "/Product"   },
    ]
  },
  creatine: {
    name: "Creatine",
    slug: "creatine",
    description: "High-quality creatine supplements for strength and performance",
    products: [
      { id: 33, name: "MB Creapro", weight: "100GM", flavors: "Unflavoured", price: 599, image: "" },
      { id: 34, name: "MB Creapro", weight: "250GM", flavors: "Unflavoured", price: 1199, image: "" },
      { id: 35, name: "MB Creamp", weight: "120GM", flavors: "Citrus Blast / Water Melon Kool Aid", price: 699, image: "" },
      { id: 36, name: "MB Creamp", weight: "320GM", flavors: "Citrus Blast / Water Melon Kool Aid / Juicy Berries / Candy Rush", price: 1499, image: "" },
      { id: 37, name: "Wellcore", weight: "100GM", flavors: "Unflavoured", price: 549, image: "" },
      { id: 38, name: "Wellcore", weight: "250GM", flavors: "Unflavoured", price: 1099, image: "" },
      { id: 39, name: "Wellcore", weight: "123GM", flavors: "Tropical Tango / Fruit Fussion / Kiwi Kick", price: 749, image: "" },
      { id: 40, name: "Wellcore", weight: "307GM", flavors: "Tropical Tango / Fruit Fussion / Kiwi Kick", price: 1599, image: "" },
      { id: 41, name: "GNC", weight: "100GM", flavors: "Unflavoured / Orange / Blueberry / Cranberry / Lemon", price: 699, image: "" },
      { id: 42, name: "GNC", weight: "250GM", flavors: "Unflavoured / Orange / Blueberry / Cranberry / Lemon", price: 1399, image: "" },
      { id: 43, name: "GNC", weight: "400GM", flavors: "Unflavoured / Orange / Blueberry / Cranberry / Lemon", price: 1999, image: "" },
      { id: 44, name: "GNC Creatine + Electrolytes", weight: "100GM", flavors: "Unflavoured / Orange / Lemon", price: 799, image: "" },
      { id: 45, name: "GNC Creatine + Electrolytes", weight: "250GM", flavors: "Unflavoured / Orange / Lemon", price: 1599, image: "" },
      { id: 46, name: "GNC Creatine + Electrolytes", weight: "400GM", flavors: "Unflavoured / Orange / Lemon", price: 2299, image: "" },
      { id: 47, name: "Fast & Up Electrolytes", weight: "20N", flavors: "Orange", price: 899, image: "" },
      { id: 48, name: "Muscle Tech", weight: "100GM", flavors: "Unflavoured", price: 649, image: "" },
      { id: 49, name: "Muscle Tech", weight: "250GM", flavors: "Unflavoured", price: 1299, image: "" },
      { id: 50, name: "Muscle Tech", weight: "400GM", flavors: "Unflavoured", price: 1899, image: "" },
      { id: 51, name: "Labrada Creatine", weight: "100G/250G", flavors: "Unflavoured", price: 999, image: "" },
      { id: 52, name: "ON Creatine", weight: "100GM", flavors: "Unflavoured", price: 599, image: "" },
      { id: 53, name: "ON Creatine", weight: "250GM", flavors: "Unflavoured", price: 1199, image: "" },
    ]
  },
  massGainer: {
    name: "Mass Gainer",
    slug: "mass-gainer",
    description: "High-calorie mass gainers for muscle building and weight gain",
    products: [
      { id: 54, name: "MB Mass Gainer", weight: "1KG/3KG/5KG", flavors: "Chocolate", price: 1799, image: "" },
      { id: 55, name: "GNC Mass Gainer", weight: "2KG", flavors: "Chocolate", price: 2499, image: "" },
      { id: 56, name: "Labrada Mass Gainer", weight: "1KG/3KG", flavors: "Chocolate / Cafe Mocha", price: 1899, image: "" },
      { id: 57, name: "MuscleTech Mass", weight: "3KG", flavors: "Chocolate / Vanilla", price: 2999, image: "" },
      { id: 58, name: "On Mass Gainer", weight: "1KG/3KG", flavors: "Dutch Chocolate / Vanilla", price: 2199, image: "" },
      { id: 59, name: "Morphen Mass Gainer", weight: "3KG", flavors: "Butter Scotch / Chocolate", price: 1699, image: "" },
      { id: 60, name: "Absolute Mass Gainer", weight: "1KG/3KG", flavors: "Chocolate / Vanilla", price: 1599, image: "" },
      { id: 61, name: "Avvatar Mass Gainer", weight: "2KG/4KG", flavors: "Belgian Chocolate", price: 2399, image: "" },
    ]
  },
  multivitamin: {
    name: "Multivitamin",
    slug: "multivitamin",
    description: "Essential multivitamins for overall health and wellness",
    products: [
      { id: 62, name: "MB-Vite Daily Multivitamin", weight: "60N/90N", flavors: "Unflavoured", price: 599, image: "" },
      { id: 63, name: "MB 5in1 Multivitamin", weight: "90N", flavors: "Unflavoured", price: 799, image: "" },
      { id: 64, name: "GNC Mega Men Daily Multivitamin", weight: "30N/60N", flavors: "Unflavoured", price: 899, image: "" },
      { id: 65, name: "MuscleTech Multivitamin", weight: "60N", flavors: "Unflavoured", price: 749, image: "" },
      { id: 66, name: "On Multivitamine For Men", weight: "60N", flavors: "Unflavoured", price: 699, image: "" },
      { id: 67, name: "BigMuscle Multivitamine", weight: "60N", flavors: "Unflavoured", price: 549, image: "" },
      { id: 68, name: "C4 Multivitamin", weight: "180N", flavors: "Unflavoured", price: 1299, image: "" },
    ]
  },
  fishOil: {
    name: "Fish Oil",
    slug: "fish-oil",
    description: "Omega-3 fish oil supplements for heart and brain health",
    products: [
      { id: 69, name: "MB Omega3 FishOil 1000mg", weight: "60N/90N", flavors: "Unflavoured", price: 599, image: "" },
      { id: 70, name: "MB Omega3 FishOil Gold", weight: "60N", flavors: "Unflavoured", price: 899, image: "" },
      { id: 71, name: "GNC Omega3 Fish Oil", weight: "60N/90N", flavors: "Unflavoured", price: 749, image: "" },
      { id: 72, name: "GNC Triple Strength Fish Oil", weight: "60N", flavors: "Unflavoured", price: 1199, image: "" },
      { id: 73, name: "On FishOil", weight: "60N", flavors: "Unflavoured", price: 649, image: "" },
      { id: 74, name: "Alaska Omega3 Fish Oil", weight: "100N", flavors: "Unflavoured", price: 799, image: "" },
      { id: 75, name: "MuscleTech Omega3 Fish Oil", weight: "100N", flavors: "Unflavoured", price: 899, image: "" },
      { id: 76, name: "Neuherbs Deep Sea Fish Oil 2500mg", weight: "60N", flavors: "Unflavoured", price: 699, image: "" },
    ]
  },
  preWorkout: {
    name: "Pre Workout",
    slug: "pre-workout",
    description: "Energy-boosting pre-workout supplements for intense training",
    products: [
      { id: 77, name: "MB Pre Workout 200 XTreme", weight: "100G/200G", flavors: "Fruit Punch / Tangy Orange", price: 899, image: "" },
      { id: 78, name: "MB Pre Workout IMPAktix", weight: "340G/510G", flavors: "Fruit Fury / Cola Frost", price: 1499, image: "" },
      { id: 79, name: "The Big Daddy Inferno", weight: "300GM", flavors: "Fruit Punch", price: 1299, image: "" },
      { id: 80, name: "GNC Pro Performance Pre Workout", weight: "360GM", flavors: "Fruit Punch", price: 1699, image: "" },
      { id: 81, name: "BigMuscle Karnage Pre Workout", weight: "300GM", flavors: "Watermelon Lime / Arctic Blast / Sex On The Beach", price: 1199, image: "" },
      { id: 82, name: "Wellversed Dynamite", weight: "420GM", flavors: "Fruit Blast / Berry Burst / Watermelon Ice", price: 1399, image: "" },
      { id: 83, name: "Fast & Up Citirun", weight: "200GM", flavors: "Unflavoured", price: 799, image: "" },
      { id: 84, name: "GNC L-Arginine", weight: "90N", flavors: "Unflavoured", price: 1099, image: "" },
    ]
  },
  weightLoss: {
    name: "Weight Loss",
    slug: "weight-loss",
    description: "Fat burners and weight loss supplements for achieving your fitness goals",
    products: [
      { id: 85, name: "MB L-Carnitine 1100mg", weight: "450ML", flavors: "Key Lime / Tangy Orange", price: 799, image: "" },
      { id: 86, name: "MB L-Carnitine 1000mg", weight: "450ML", flavors: "Key Lime / Tangy Orange", price: 749, image: "" },
      { id: 87, name: "GNC L-Carnitine 3000mg", weight: "450ML", flavors: "Orange", price: 1199, image: "" },
      { id: 88, name: "Fast And Up L-Carnitine 3000mg", weight: "30N", flavors: "Lemon / Orange", price: 899, image: "" },
      { id: 89, name: "MB Fat Burner Pro", weight: "60N", flavors: "Unflavoured", price: 699, image: "" },
      { id: 90, name: "Apple Cider Vinegar", weight: "500ml", flavors: "Natural", price: 399, image: "" },
    ]
  },
  recovery: {
    name: "Recovery",
    slug: "recovery",
    description: "Post-workout recovery supplements for muscle repair",
    products: [
      { id: 91, name: "MB L-Glutamine", weight: "250GM", flavors: "Unflavoured", price: 899, image: "" },
      { id: 92, name: "GNC L-Glutamine", weight: "250GM", flavors: "Unflavoured", price: 999, image: "" },
    ]
  },
  intraWorkout: {
    name: "Intra Workout",
    slug: "intra-workout",
    description: "BCAA and intra-workout supplements for endurance",
    products: [
      { id: 93, name: "MB BCAA Pro", weight: "450G", flavors: "Green Apple / Watermelon", price: 1299, image: "" },
      { id: 94, name: "MB BCAA Pro", weight: "245GM", flavors: "Green Apple / Watermelon", price: 799, image: "" },
    ]
  },
  minerals: {
    name: "Minerals & Health",
    slug: "minerals-health",
    description: "Essential minerals and health supplements",
    products: [
      { id: 95, name: "GNC Calcium Plus", weight: "60N", flavors: "Unflavoured", price: 499, image: "" },
      { id: 96, name: "GNC Zinc Magnesium", weight: "60N", flavors: "Unflavoured", price: 599, image: "" },
      { id: 97, name: "GNC Collagen", weight: "200G", flavors: "Lemon / Orange", price: 1499, image: "" },
    ]
  },
  peanutButter: {
    name: "Peanut Butter & Oats",
    slug: "peanut-butter-oats",
    description: "Healthy peanut butter and oats for nutrition",
    products: [
      { id: 98, name: "MyFitness Peanut Butter Smooth", weight: "1.25KG", flavors: "Chocolate", price: 599, image: "" },
      { id: 99, name: "MyFitness Peanut Butter Crunchy", weight: "1KG", flavors: "Dark Chocolate", price: 549, image: "" },
      { id: 100, name: "MyFitness Peanut Butter Smooth", weight: "510G", flavors: "Dark Chocolate", price: 349, image: "" },
      { id: 101, name: "MyFitness Peanut Butter Crunchy", weight: "510G", flavors: "Dark Chocolate", price: 349, image: "" },
      { id: 102, name: "MyFitness Peanut Butter Smooth", weight: "227G", flavors: "Chocolate", price: 199, image: "" },
      { id: 103, name: "MyFitness Peanut Butter Crunchy", weight: "227G", flavors: "Chocolate", price: 199, image: "" },
      { id: 104, name: "MyFitness Peanut Butter Crispy", weight: "227G", flavors: "Chocolate", price: 219, image: "" },
      { id: 105, name: "Pintola Peanut Butter", weight: "1KG", flavors: "Classic / Chocolate", price: 449, image: "" },
      { id: 106, name: "Pintola Peanut Butter", weight: "510G", flavors: "Classic / Chocolate", price: 279, image: "" },
    ]
  },
  ayurvedic: {
    name: "Ayurvedic Products",
    slug: "ayurvedic",
    description: "Natural ayurvedic supplements for holistic health",
    products: [
      { id: 107, name: "Kapiva Shilajit", weight: "20G", flavors: "Natural", price: 799, image: "" },
      { id: 108, name: "Kapiva Shilajit Gold", weight: "20G", flavors: "Natural", price: 999, image: "" },
      { id: 109, name: "Kapiva Ashwagandha Gold", weight: "90N", flavors: "Natural", price: 699, image: "" },
      { id: 110, name: "Kapiva Shilajit Gold Capsul", weight: "60N", flavors: "Natural", price: 899, image: "" },
    ]
  },
  proteinBars: {
    name: "Protein Bars & Snacks",
    slug: "protein-bars",
    description: "Healthy protein bars, cookies and chips",
    products: [
      { id: 111, name: "Max Protein Bar", weight: "10GM/Each", flavors: "Choco Berry / Choco Almond / Date Almond", price: 50, image: "" },
      { id: 112, name: "Max Protein Bar", weight: "20GM/Each", flavors: "Choco Berry / Choco Almond / Date Almond", price: 80, image: "" },
      { id: 113, name: "Avvatar Wafer", weight: "10GM/Each", flavors: "Chocolate Coffee", price: 45, image: "" },
      { id: 114, name: "MB Protein Bar", weight: "10GM/Each", flavors: "Choco Almond", price: 55, image: "" },
      { id: 115, name: "MB Protein Bar", weight: "20GM/Each", flavors: "Choco Almond", price: 90, image: "" },
      { id: 116, name: "Max Protein Chips", weight: "10GM", flavors: "Spanish Tomato / Cream & Onion / Desi Masala / Chinese Manchurian", price: 40, image: "" },
    ]
  },
  accessories: {
    name: "Accessories",
    slug: "accessories",
    description: "Gym accessories and fitness gear",
    products: [
      { id: 117, name: "Gym Bag", weight: "Standard", flavors: "Average Quality", price: 499, image: "" },
      { id: 118, name: "Gym Bag Premium", weight: "Standard", flavors: "Good Quality", price: 799, image: "" },
      { id: 119, name: "Shaker Bottle", weight: "700ML", flavors: "Various Colors", price: 299, image: "" },
      { id: 120, name: "Shaker Bottle Premium", weight: "700ML", flavors: "Various Colors", price: 499, image: "" },
      { id: 121, name: "Gym Gloves", weight: "M/L/XL", flavors: "Black", price: 399, image: "" },
      { id: 122, name: "Wrist Wraps", weight: "Standard", flavors: "Black/Red", price: 299, image: "" },
    ]
  }
};

// Get all products as a flat array
export const getAllProducts = () => {
  const allProducts = [];
  Object.values(productCategories).forEach(category => {
    category.products.forEach(product => {
      allProducts.push({ ...product, category: category.name, categorySlug: category.slug });
    });
  });
  return allProducts;
};

// Search products by query
export const searchProducts = (query) => {
  if (!query || query.trim().length < 2) return [];
  
  const allProducts = getAllProducts();
  const searchTerm = query.toLowerCase().trim();
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.flavors?.toLowerCase().includes(searchTerm) ||
    product.weight?.toLowerCase().includes(searchTerm) ||
    product.category?.toLowerCase().includes(searchTerm)
  );
};

// Get random products for home page
export const getRandomProducts = (count = 8) => {
  const allProducts = getAllProducts();
  const shuffled = allProducts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get products by category key
export const getProductsByCategory = (categoryKey) => {
  return productCategories[categoryKey]?.products || [];
};

// Get category by slug
export const getCategoryBySlug = (slug) => {
  return Object.entries(productCategories).find(([key, cat]) => cat.slug === slug);
};

// Get category names for navigation
export const getCategoryNames = () => {
  return Object.entries(productCategories).map(([key, value]) => ({
    key,
    name: value.name,
    slug: value.slug
  }));
};
