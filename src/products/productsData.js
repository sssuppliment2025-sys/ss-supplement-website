// Product Data organized by categories
// To add a product image: Replace the placeholder image path with your actual image path
// Example: image: "/products/whey-protein.jpg" or image: "https://example.com/image.jpg"

export const productCategories = {
  wheyProtein: {
    name: "Whey Protein",
    slug: "whey-protein",
    description: "Premium quality whey protein supplements for muscle building and recovery",
    products: [
      { id: 1, name: "Optimum Nutrition", weight: "2LB/907GM", flavors: "Double Rich Chocolate", price: 2499, image: "/image/Whey_protien/Optimum/Optimum_Double_Rich_2lb.webp", route: "/Product" },
      { id: 2, name: "Optimum Nutrition", weight: "2LB/907GM", flavors: "Vanilla Ice Cream", price: 2499, image: "/image/Whey_protien/Optimum/Optimum_Vanilla_2lb.webp", route: "/Product" },
      { id: 3, name: "Optimum Nutrition", weight: "5LB/2.27KG", flavors: "Double Rich Chocolate", price: 5299, image: "/image/Whey_protien/Optimum/double_rich_5lb.webp", route: "/Product" },
      { id: 4, name: "Optimum Nutrition", weight: "5LB/2.27KG", flavors: "Vanilla Ice Cream", price: 5299, image: "/image/Whey_protien/Optimum/vanilla_5lb.png", route: "/Product" },

      { id: 5, name: "Dymatize Elite", weight: "5LB/2.27KG", flavors: "Rich Chocolate", price: 4899, image: "/image/Whey_protien/Dymatize/rich_choclate_5lb.webp", route: "/Product" },

      { id: 6, name: "Labrada Whey", weight: "500G", flavors: "Chocolate", price: 1299, image: "/image/Whey_protien/Labrada/labrada_chocolate_500gm.webp", route: "/Product" },
      { id: 7, name: "Labrada Whey", weight: "500G", flavors: "Vanilla", price: 1299, image: "/image/Whey_protien/Labrada/labrada_vanilla_500gm.webp", route: "/Product" },
      { id: 8, name: "Labrada Whey", weight: "500G", flavors: "Mocha", price: 1299, image: "/image/Whey_protien/Labrada/labrada_mocha_500gm.jpg", route: "/Product" },
      { id: 9, name: "Labrada Whey", weight: "1KG", flavors: "Chocolate", price: 2399, image: "/image/Whey_protien/Labrada/labrada_chocolate_1kg.webp", route: "/Product" },
      { id: 10, name: "Labrada Whey", weight: "1KG", flavors: "Vanilla", price: 2399, image: "/image/Whey_protien/Labrada/labrada_vanilla_1kg.webp", route: "/Product" },
      { id: 11, name: "Labrada Whey", weight: "1KG", flavors: "Mocha", price: 2399, image: "/image/Whey_protien/Labrada/labrada_mocha_1kg.webp", route: "/Product" },
      { id: 12, name: "Labrada Whey", weight: "1.8KG", flavors: "Chocolate", price: 3999, image: "/image/Whey_protien/Labrada/labrada_chocolate_1.8kg.webp", route: "/Product" },
      { id: 13, name: "Labrada Whey", weight: "1.8KG", flavors: "Vanilla", price: 3999, image: "/image/Whey_protien/Labrada/labrada_vanilla_1.8kg.webp", route: "/Product" },
      { id: 14, name: "Labrada Whey", weight: "1.8KG", flavors: "Mocha", price: 3999, image: "/image/Whey_protien/Labrada/labrada_mocha_1.8kg.webp", route: "/Product" },

      { id: 15, name: "MuscleTech Nitro Tech Whey", weight: "450GM", flavors: "Double Rich Chocolate", price: 1599, image: "/image/Whey_protien/MuscleTech/MuscleTech_double_rich_chocolate_450gm.webp", route: "/Product" },
      { id: 16, name: "MuscleTech Nitro Tech Whey", weight: "450GM", flavors: "Cookies & Cream", price: 1599, image: "/image/Whey_protien/MuscleTech/MuscleTech_cookies&cream_450gm.webp", route: "/Product" },
      { id: 17, name: "MuscleTech Nitro Tech Whey", weight: "907GM", flavors: "Double Rich Chocolate", price: 1599, image: "/image/Whey_protien/MuscleTech/MuscleTech_double_rich_chocolate_907gm.jpg", route: "/Product" },
      { id: 18, name: "MuscleTech Nitro Tech Whey", weight: "907GM", flavors: "Cookies & Cream", price: 2899, image: "/image/Whey_protien/MuscleTech/MuscleTech_cookies_&_cream_907gm.webp", route: "/Product" },
      { id: 19, name: "MuscleTech Nitro Tech Whey", weight: "1.8KG", flavors: "Double Rich Chocolate", price: 5299, image: "/image/Whey_protien/MuscleTech/MuscleTech_double_rich_chocolate_1.8kg.webp", route: "/Product" },
      { id: 20, name: "MuscleTech Nitro Tech Whey", weight: "1.8KG", flavors: "Cookies & Cream", price: 5299, image: "/image/Whey_protien/MuscleTech/MuscleTech_cookies&cream_1.8kg.webp", route: "/Product" },

      { id: 21, name: "GNC Whey Pro Performance", weight: "2LB/907GM", flavors: "Chocolate Fudge", price: 2799, image: "", route: "/Product" },
      { id: 22, name: "GNC Whey Pro Performance", weight: "2LB/907GM", flavors: "Vanilla", price: 2799, image: "", route: "/Product" },
      { id: 23, name: "GNC Whey Pro Performance", weight: "2LB/907GM", flavors: "Chocolate", price: 2799, image: "", route: "/Product" },
      { id: 24, name: "GNC Whey Pro Performance", weight: "4LB/1.8KG", flavors: "Chocolate Fudge", price: 4999, image: "/image/Whey_protien/GNC/gnc_chocolate_fudge_1.8kg.webp", route: "/Product" },
      { id: 25, name: "GNC Whey Pro Performance", weight: "4LB/1.8KG", flavors: "Vanilla", price: 4999, image: "/image/Whey_protien/GNC/gnc_vanilla_1.8kg.webp", route: "/Product" },
      { id: 26, name: "GNC Whey Pro Performance", weight: "4LB/1.8KG", flavors: "Chocolate", price: 4999, image: "/image/Whey_protien/GNC/gnc_chocolate_1.8kg.webp", route: "/Product" },

      { id: 27, name: "GNC Pure Isolate", weight: "2LB", flavors: "Chocolate Fudge", price: 3599, image: "/image/Whey_protien/GNC/puro_chocolate_fudge.webp", route: "/Product" },
      { id: 28, name: "GNC Pure Isolate", weight: "4LB", flavors: "Chocolate Fudge", price: 3599, image: "/image/Whey_protien/GNC/puro_chocolate_fudge.webp", route: "/Product" },
      { id: 29, name: "GNC Pure Isolate", weight: "2LB", flavors: "Vanilla", price: 3599, image: "/image/Whey_protien/GNC/puro_vanilla.webp", route: "/Product" },
      { id: 29, name: "GNC Pure Isolate", weight: "4LB", flavors: "Vanilla", price: 3599, image: "/image/Whey_protien/GNC/puro_vanilla.webp", route: "/Product" },
      { id: 29, name: "GNC Pure Isolate", weight: "2LB", flavors: "Chocolate", price: 3599, image: "/image/Whey_protien/GNC/puro_chocolate.webp", route: "/Product" },
      { id: 29, name: "GNC Pure Isolate", weight: "4LB", flavors: "Chocolate", price: 3599, image: "/image/Whey_protien/GNC/puro_chocolate.webp", route: "/Product" },


      { id: 30, name: "GNC Select", weight: "1KG", flavors: "Chocolate", price: 2199, image: "", route: "/Product" },
      { id: 31, name: "BPI Whey HD", weight: "1KG", flavors: "Chocolate Delight", price: 2499, image: "", route: "/Product" },
      { id: 32, name: "BPI Whey HD", weight: "2KG", flavors: "Chocolate Delight", price: 4299, image: "", route: "/Product" },
      { id: 33, name: "One Science Whey Protein", weight: "1LB", flavors: "Chocolate Charge", price: 1299, image: "", route: "/Product" },
      { id: 34, name: "One Science Whey Protein", weight: "2LB/907GM", flavors: "Chocolate Charge", price: 2399, image: "", route: "/Product" },
      { id: 35, name: "One Science Whey Protein", weight: "4LB/1.8KG", flavors: "Chocolate Charge", price: 4299, image: "", route: "/Product" },
      { id: 36, name: "Isopure Whey Protein", weight: "1KG", flavors: "Chocolate", price: 2699, image: "", route: "/Product" },
      { id: 37, name: "Isopure Whey Protein", weight: "2KG", flavors: "Chocolate", price: 4899, image: "", route: "/Product" },
      { id: 38, name: "MB Biozyme Whey Performance", weight: "1KG/2KG", flavors: "Rich Chocolate", price: 3299, image: "/image/Whey_protien/MB/biozyme_rich_chocolate.webp", route: "/Product" },
      { id: 39, name: "MB Biozyme Whey Performance", weight: "1KG/2KG", flavors: "Chocolate Hazelnut", price: 3299, image: "/image/Whey_protien/MB/biozyme_choco_hazelnut.webp", route: "/Product" },
      { id: 40, name: "MB Biozyme Whey Performance", weight: "1KG/2KG", flavors: "Choco Crispie", price: 3299, image: "/image/Whey_protien/MB/biozyme_choco_crispie.webp", route: "/Product" },
      { id: 41, name: "MB Biozyme Whey Performance", weight: "1KG/2KG", flavors: "Kesar Thandai", price: 3299, image: "/image/Whey_protien/MB/biozyme_kesar_thandai.webp", route: "/Product" },
      { id: 42, name: "MB Biozyme Whey Performance", weight: "1KG/2KG", flavors: "Magical Mango", price: 3299, image: "/image/Whey_protien/MB/biozyme_magical_mango.webp", route: "/Product" },

      { id: 43, name: "MB Biozyme Whey Isozero", weight: "1KG/2KG", flavors: "Chocolate Fudge", price: 3799, image: "/image/Whey_protien/MB/isozero_chocolate_fudge.webp", route: "/Product" },
      { id: 44, name: "MB Biozyme Whey Isozero", weight: "1KG/2KG", flavors: "Cookies & Cream", price: 3799, image: "/image/Whey_protien/MB/isozero_cookies_cream.webp", route: "/Product" },

      { id: 45, name: "MB Biozyme Whey PR", weight: "1KG/2KG", flavors: "Low Carbs Ice Cream Chocolate", price: 3499, image: "", route: "/Product" },
      { id: 45, name: "MB Biozyme Whey PR", weight: "1KG/2KG", flavors: "Low Carbs Cookies & Cream", price: 3499, image: "", route: "/Product" },


      { id: 47, name: "Avvatar Whey Protein", weight: "1KG/2KG", flavors: "Belgian Chocolate", price: 2899, image: "/image/Whey_protien/Avvatar/belgian_chocolate.webp", route: "/Product" },
      { id: 48, name: "Avvatar Whey Protein", weight: "1KG/2KG", flavors: "Malai Kulfi", price: 2899, image: "/image/Whey_protien/Avvatar/malai_kulfi.webp", route: "/Product" },
      { id: 49, name: "Avvatar Whey Protein", weight: "1KG/2KG", flavors: "Chocolate Hazelnut", price: 2899, image: "/image/Whey_protien/Avvatar/choco_hazelnut.webp", route: "/Product" },

      { id: 51, name: "Avvatar 100% Performance Whey", weight: "1KG/2KG", flavors: "Belgian Chocolate", price: 2699, image: "", route: "/Product" },
      { id: 52, name: "Avvatar 100% Performance Whey", weight: "1KG/2KG", flavors: "Malai Kulfi", price: 2699, image: "", route: "/Product" },
      { id: 53, name: "Avvatar 100% Performance Whey", weight: "1KG/2KG", flavors: "Chocolate Hazelnut", price: 2699, image: "", route: "/Product" },

      { id: 54, name: "Avvatar Isorich", weight: "1KG/2KG", flavors: "Belgian Chocolate", price: 3199, image: "", route: "/Product" },
      { id: 55, name: "Avvatar Isorich", weight: "1KG/2KG", flavors: " Malai Kulfi", price: 3199, image: "", route: "/Product" },
      { id: 56, name: "Avvatar Isorich", weight: "1KG/2KG", flavors: "Chocolate Hazelnut", price: 3199, image: "", route: "/Product" },

      { id: 57, name: "Fuelone Whey", weight: "1KG/2KG", flavors: "Chocolate", price: 1999, image: "", route: "/Product" },

      { id: 58, name: "Attom Whey", weight: "1KG/2KG", flavors: "Double Rich Chocolate ", price: 2299, image: "", route: "/Product" },
      { id: 59, name: "Attom Whey", weight: "1KG/2KG", flavors: "French Vanilla", price: 2299, image: "", route: "/Product" },

      { id: 60, name: "Morphenlab Turbo Whey", weight: "1KG", flavors: "Butter Scotch", price: 1899, image: "", route: "/Product" },
      { id: 61, name: "Morphenlab Whey Protein", weight: "2KG", flavors: "Chocolate", price: 3299, image: "", route: "/Product" },

      { id: 62, name: "Absolute Whey Legender", weight: "1KG/2KG", flavors: "Chocolate", price: 2599, image: "", route: "/Product" },
      { id: 63, name: "Absolute Whey Legender", weight: "1KG/2KG", flavors: "Cashew Saffron Pistachio", price: 2599, image: "", route: "/Product" },
    ]
  },
  creatine: {
    name: "Creatine",
    slug: "creatine",
    description: "High-quality creatine supplements for strength and performance",
    products: [
      { id: 33, name: "MB Creapro", weight: "100GM", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 34, name: "MB Creapro", weight: "250GM", flavors: "Unflavoured", price: 1199, image: "", route: "/Product" },

      { id: 35, name: "MB Creamp", weight: "120GM", flavors: "Citrus Blast", price: 699, image: "", route: "/Product" },
      { id: 35, name: "MB Creamp", weight: "120GM", flavors: "Water Melon Kool Aid", price: 699, image: "", route: "/Product" },

      { id: 36, name: "MB Creamp", weight: "320GM", flavors: "Citrus Blast", price: 1499, image: "", route: "/Product" },
      { id: 36, name: "MB Creamp", weight: "320GM", flavors: "Water Melon Kool Aid", price: 1499, image: "", route: "/Product" },
      { id: 36, name: "MB Creamp", weight: "320GM", flavors: "Juicy Berries", price: 1499, image: "", route: "/Product" },
      { id: 36, name: "MB Creamp", weight: "320GM", flavors: "Candy Rush", price: 1499, image: "", route: "/Product" },

      { id: 37, name: "Wellcore", weight: "100GM", flavors: "Unflavoured", price: 549, image: "", route: "/Product" },
      { id: 38, name: "Wellcore", weight: "250GM", flavors: "Unflavoured", price: 1099, image: "", route: "/Product" },
      
      { id: 39, name: "Wellcore", weight: "123GM", flavors: "Tropical Tango / Fruit Fussion / Kiwi Kick", price: 749, image: "", route: "/Product" },
      { id: 40, name: "Wellcore", weight: "307GM", flavors: "Tropical Tango / Fruit Fussion / Kiwi Kick", price: 1599, image: "", route: "/Product" },
      { id: 41, name: "GNC", weight: "100GM", flavors: "Unflavoured / Orange / Blueberry / Cranberry / Lemon", price: 699, image: "", route: "/Product" },
      { id: 42, name: "GNC", weight: "250GM", flavors: "Unflavoured / Orange / Blueberry / Cranberry / Lemon", price: 1399, image: "", route: "/Product" },
      { id: 43, name: "GNC", weight: "400GM", flavors: "Unflavoured / Orange / Blueberry / Cranberry / Lemon", price: 1999, image: "", route: "/Product" },
      { id: 44, name: "GNC Creatine + Electrolytes", weight: "100GM", flavors: "Unflavoured / Orange / Lemon", price: 799, image: "", route: "/Product" },
      { id: 45, name: "GNC Creatine + Electrolytes", weight: "250GM", flavors: "Unflavoured / Orange / Lemon", price: 1599, image: "", route: "/Product" },
      { id: 46, name: "GNC Creatine + Electrolytes", weight: "400GM", flavors: "Unflavoured / Orange / Lemon", price: 2299, image: "", route: "/Product" },
      { id: 47, name: "Fast & Up Electrolytes", weight: "20N", flavors: "Orange", price: 899, image: "", route: "/Product" },
      { id: 48, name: "Muscle Tech", weight: "100GM", flavors: "Unflavoured", price: 649, image: "", route: "/Product" },
      { id: 49, name: "Muscle Tech", weight: "250GM", flavors: "Unflavoured", price: 1299, image: "", route: "/Product" },
      { id: 50, name: "Muscle Tech", weight: "400GM", flavors: "Unflavoured", price: 1899, image: "", route: "/Product" },
      { id: 51, name: "Labrada Creatine", weight: "100G/250G", flavors: "Unflavoured", price: 999, image: "", route: "/Product" },
      { id: 52, name: "ON Creatine", weight: "100GM", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 53, name: "ON Creatine", weight: "250GM", flavors: "Unflavoured", price: 1199, image: "", route: "/Product" },
    ]
  },
  massGainer: {
    name: "Mass Gainer",
    slug: "mass-gainer",
    description: "High-calorie mass gainers for muscle building and weight gain",
    products: [
      { id: 54, name: "MB Mass Gainer", weight: "1KG/3KG/5KG", flavors: "Chocolate", price: 1799, image: "", route: "/Product" },
      { id: 55, name: "GNC Mass Gainer", weight: "2KG", flavors: "Chocolate", price: 2499, image: "", route: "/Product" },
      { id: 56, name: "Labrada Mass Gainer", weight: "1KG/3KG", flavors: "Chocolate / Cafe Mocha", price: 1899, image: "", route: "/Product" },
      { id: 57, name: "MuscleTech Mass", weight: "3KG", flavors: "Chocolate / Vanilla", price: 2999, image: "", route: "/Product" },
      { id: 58, name: "On Mass Gainer", weight: "1KG/3KG", flavors: "Dutch Chocolate / Vanilla", price: 2199, image: "", route: "/Product" },
      { id: 59, name: "Morphen Mass Gainer", weight: "3KG", flavors: "Butter Scotch / Chocolate", price: 1699, image: "", route: "/Product" },
      { id: 60, name: "Absolute Mass Gainer", weight: "1KG/3KG", flavors: "Chocolate / Vanilla", price: 1599, image: "", route: "/Product" },
      { id: 61, name: "Avvatar Mass Gainer", weight: "2KG/4KG", flavors: "Belgian Chocolate", price: 2399, image: "", route: "/Product" },
    ]
  },
  multivitamin: {
    name: "Multivitamin",
    slug: "multivitamin",
    description: "Essential multivitamins for overall health and wellness",
    products: [
      { id: 62, name: "MB-Vite Daily Multivitamin", weight: "60N/90N", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 63, name: "MB 5in1 Multivitamin", weight: "90N", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 64, name: "GNC Mega Men Daily Multivitamin", weight: "30N/60N", flavors: "Unflavoured", price: 899, image: "", route: "/Product" },
      { id: 65, name: "MuscleTech Multivitamin", weight: "60N", flavors: "Unflavoured", price: 749, image: "", route: "/Product" },
      { id: 66, name: "On Multivitamine For Men", weight: "60N", flavors: "Unflavoured", price: 699, image: "", route: "/Product" },
      { id: 67, name: "BigMuscle Multivitamine", weight: "60N", flavors: "Unflavoured", price: 549, image: "", route: "/Product" },
      { id: 68, name: "C4 Multivitamin", weight: "180N", flavors: "Unflavoured", price: 1299, image: "", route: "/Product" },
    ]
  },
  fishOil: {
    name: "Fish Oil",
    slug: "fish-oil",
    description: "Omega-3 fish oil supplements for heart and brain health",
    products: [
      { id: 69, name: "MB Omega3 FishOil 1000mg", weight: "60N/90N", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 70, name: "MB Omega3 FishOil Gold", weight: "60N", flavors: "Unflavoured", price: 899, image: "", route: "/Product" },
      { id: 71, name: "GNC Omega3 Fish Oil", weight: "60N/90N", flavors: "Unflavoured", price: 749, image: "", route: "/Product" },
      { id: 72, name: "GNC Triple Strength Fish Oil", weight: "60N", flavors: "Unflavoured", price: 1199, image: "", route: "/Product" },
      { id: 73, name: "On FishOil", weight: "60N", flavors: "Unflavoured", price: 649, image: "", route: "/Product" },
      { id: 74, name: "Alaska Omega3 Fish Oil", weight: "100N", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 75, name: "MuscleTech Omega3 Fish Oil", weight: "100N", flavors: "Unflavoured", price: 899, image: "", route: "/Product" },
      { id: 76, name: "Neuherbs Deep Sea Fish Oil 2500mg", weight: "60N", flavors: "Unflavoured", price: 699, image: "", route: "/Product" },
    ]
  },
  preWorkout: {
    name: "Pre Workout",
    slug: "pre-workout",
    description: "Energy-boosting pre-workout supplements for intense training",
    products: [
      { id: 77, name: "MB Pre Workout 200 XTreme", weight: "100G/200G", flavors: "Fruit Punch / Tangy Orange", price: 899, image: "", route: "/Product" },
      { id: 78, name: "MB Pre Workout IMPAktix", weight: "340G/510G", flavors: "Fruit Fury / Cola Frost", price: 1499, image: "", route: "/Product" },
      { id: 79, name: "The Big Daddy Inferno", weight: "300GM", flavors: "Fruit Punch", price: 1299, image: "", route: "/Product" },
      { id: 80, name: "GNC Pro Performance Pre Workout", weight: "360GM", flavors: "Fruit Punch", price: 1699, image: "", route: "/Product" },
      { id: 81, name: "BigMuscle Karnage Pre Workout", weight: "300GM", flavors: "Watermelon Lime / Arctic Blast / Sex On The Beach", price: 1199, image: "", route: "/Product" },
      { id: 82, name: "Wellversed Dynamite", weight: "420GM", flavors: "Fruit Blast / Berry Burst / Watermelon Ice", price: 1399, image: "", route: "/Product" },
      { id: 83, name: "Fast & Up Citirun", weight: "200GM", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 84, name: "GNC L-Arginine", weight: "90N", flavors: "Unflavoured", price: 1099, image: "", route: "/Product" },
    ]
  },
  weightLoss: {
    name: "Weight Loss",
    slug: "weight-loss",
    description: "Fat burners and weight loss supplements for achieving your fitness goals",
    products: [
      { id: 85, name: "MB L-Carnitine 1100mg", weight: "450ML", flavors: "Key Lime / Tangy Orange", price: 799, image: "", route: "/Product" },
      { id: 86, name: "MB L-Carnitine 1000mg", weight: "450ML", flavors: "Key Lime / Tangy Orange", price: 749, image: "", route: "/Product" },
      { id: 87, name: "GNC L-Carnitine 3000mg", weight: "450ML", flavors: "Orange", price: 1199, image: "" },
      { id: 88, name: "Fast And Up L-Carnitine 3000mg", weight: "30N", flavors: "Lemon / Orange", price: 899, image: "", route: "/Product" },
      { id: 89, name: "MB Fat Burner Pro", weight: "60N", flavors: "Unflavoured", price: 699, image: "", route: "/Product" },
      { id: 90, name: "Apple Cider Vinegar", weight: "500ml", flavors: "Natural", price: 399, image: "", route: "/Product" },
    ]
  },
  recovery: {
    name: "Recovery",
    slug: "recovery",
    description: "Post-workout recovery supplements for muscle repair",
    products: [
      { id: 91, name: "MB L-Glutamine", weight: "250GM", flavors: "Unflavoured", price: 899, image: "", route: "/Product" },
      { id: 92, name: "GNC L-Glutamine", weight: "250GM", flavors: "Unflavoured", price: 999, image: "", route: "/Product" },
    ]
  },
  intraWorkout: {
    name: "Intra Workout",
    slug: "intra-workout",
    description: "BCAA and intra-workout supplements for endurance",
    products: [
      { id: 93, name: "MB BCAA Pro", weight: "450G", flavors: "Green Apple / Watermelon", price: 1299, image: "", route: "/Product" },
      { id: 94, name: "MB BCAA Pro", weight: "245GM", flavors: "Green Apple / Watermelon", price: 799, image: "", route: "/Product" },
    ]
  },
  minerals: {
    name: "Minerals & Health",
    slug: "minerals-health",
    description: "Essential minerals and health supplements",
    products: [
      { id: 95, name: "GNC Calcium Plus", weight: "60N", flavors: "Unflavoured", price: 499, image: "", route: "/Product" },
      { id: 96, name: "GNC Zinc Magnesium", weight: "60N", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 97, name: "GNC Collagen", weight: "200G", flavors: "Lemon / Orange", price: 1499, image: "", route: "/Product" },
    ]
  },
  peanutButter: {
    name: "Peanut Butter & Oats",
    slug: "peanut-butter-oats",
    description: "Healthy peanut butter and oats for nutrition",
    products: [
      { id: 98, name: "MyFitness Peanut Butter Smooth", weight: "1.25KG", flavors: "Chocolate", price: 599, image: "", route: "/Product" },
      { id: 99, name: "MyFitness Peanut Butter Crunchy", weight: "1KG", flavors: "Dark Chocolate", price: 549, image: "", route: "/Product" },
      { id: 100, name: "MyFitness Peanut Butter Smooth", weight: "510G", flavors: "Dark Chocolate", price: 349, image: "", route: "/Product" },
      { id: 101, name: "MyFitness Peanut Butter Crunchy", weight: "510G", flavors: "Dark Chocolate", price: 349, image: "", route: "/Product" },
      { id: 102, name: "MyFitness Peanut Butter Smooth", weight: "227G", flavors: "Chocolate", price: 199, image: "", route: "/Product" },
      { id: 103, name: "MyFitness Peanut Butter Crunchy", weight: "227G", flavors: "Chocolate", price: 199, image: "", route: "/Product" },
      { id: 104, name: "MyFitness Peanut Butter Crispy", weight: "227G", flavors: "Chocolate", price: 219, image: "", route: "/Product" },
      { id: 105, name: "Pintola Peanut Butter", weight: "1KG", flavors: "Classic / Chocolate", price: 449, image: "", route: "/Product" },
      { id: 106, name: "Pintola Peanut Butter", weight: "510G", flavors: "Classic / Chocolate", price: 279, image: "", route: "/Product" },
    ]
  },
  ayurvedic: {
    name: "Ayurvedic Products",
    slug: "ayurvedic",
    description: "Natural ayurvedic supplements for holistic health",
    products: [
      { id: 107, name: "Kapiva Shilajit", weight: "20G", flavors: "Natural", price: 799, image: "", route: "/Product" },
      { id: 108, name: "Kapiva Shilajit Gold", weight: "20G", flavors: "Natural", price: 999, image: "", route: "/Product" },
      { id: 109, name: "Kapiva Ashwagandha Gold", weight: "90N", flavors: "Natural", price: 699, image: "", route: "/Product" },
      { id: 110, name: "Kapiva Shilajit Gold Capsul", weight: "60N", flavors: "Natural", price: 899, image: "", route: "/Product" },
    ]
  },
  proteinBars: {
    name: "Protein Bars & Snacks",
    slug: "protein-bars",
    description: "Healthy protein bars, cookies and chips",
    products: [
      { id: 111, name: "Max Protein Bar", weight: "10GM/Each", flavors: "Choco Berry / Choco Almond / Date Almond", price: 50, image: "", route: "/Product" },
      { id: 112, name: "Max Protein Bar", weight: "20GM/Each", flavors: "Choco Berry / Choco Almond / Date Almond", price: 80, image: "", route: "/Product" },
      { id: 113, name: "Avvatar Wafer", weight: "10GM/Each", flavors: "Chocolate Coffee", price: 45, image: "", route: "/Product" },
      { id: 114, name: "MB Protein Bar", weight: "10GM/Each", flavors: "Choco Almond", price: 55, image: "", route: "/Product" },
      { id: 115, name: "MB Protein Bar", weight: "20GM/Each", flavors: "Choco Almond", price: 90, image: "", route: "/Product" },
      { id: 116, name: "Max Protein Chips", weight: "10GM", flavors: "Spanish Tomato / Cream & Onion / Desi Masala / Chinese Manchurian", price: 40, image: "", route: "/Product" },
    ]
  },
  accessories: {
    name: "Accessories",
    slug: "accessories",
    description: "Gym accessories and fitness gear",
    products: [
      { id: 117, name: "Gym Bag", weight: "Standard", flavors: "Average Quality", price: 499, image: "", route: "/Product" },
      { id: 118, name: "Gym Bag Premium", weight: "Standard", flavors: "Good Quality", price: 799, image: "", route: "/Product" },
      { id: 119, name: "Shaker Bottle", weight: "700ML", flavors: "Various Colors", price: 299, image: "", route: "/Product" },
      { id: 120, name: "Shaker Bottle Premium", weight: "700ML", flavors: "Various Colors", price: 499, image: "", route: "/Product" },
      { id: 121, name: "Gym Gloves", weight: "M/L/XL", flavors: "Black", price: 399, image: "", route: "/Product" },
      { id: 122, name: "Wrist Wraps", weight: "Standard", flavors: "Black/Red", price: 299, image: "", route: "/Product" },
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
