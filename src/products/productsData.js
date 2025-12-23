// Product Data organized by categories
// To add a product image: Replace the placeholder image path with your actual image path
// Example: image: "/products/whey-protein.jpg" or image: "https://example.com/image.jpg"


 // Product Data organized by categories
// Each product now has a unique ID - weights and flavors separated

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
      { id: 17, name: "MuscleTech Nitro Tech Whey", weight: "907GM", flavors: "Double Rich Chocolate", price: 2899, image: "/image/Whey_protien/MuscleTech/MuscleTech_double_rich_chocolate_907gm.jpg", route: "/Product" },
      { id: 18, name: "MuscleTech Nitro Tech Whey", weight: "907GM", flavors: "Cookies & Cream", price: 2899, image: "/image/Whey_protien/MuscleTech/MuscleTech_cookies_&_cream_907gm.webp", route: "/Product" },
      { id: 19, name: "MuscleTech Nitro Tech Whey", weight: "1.8KG", flavors: "Double Rich Chocolate", price: 5299, image: "/image/Whey_protien/MuscleTech/MuscleTech_double_rich_chocolate_1.8kg.webp", route: "/Product" },
      { id: 20, name: "MuscleTech Nitro Tech Whey", weight: "1.8KG", flavors: "Cookies & Cream", price: 5299, image: "/image/Whey_protien/MuscleTech/MuscleTech_cookies&cream_1.8kg.webp", route: "/Product" },

      { id: 21, name: "GNC Whey Pro Performance", weight: "2LB/907GM", flavors: "Chocolate Fudge", price: 2799, image: "/image/Whey_protien/GncProPerform/gnc_pro_perfm_chocolate_fudge_2Lb.webp", route: "/Product" },
      { id: 22, name: "GNC Whey Pro Performance", weight: "2LB/907GM", flavors: "Vanilla", price: 2799, image: "/image/Whey_protien/GncProPerform/gnc_pro_perfm_vanilla_2Lb.webp", route: "/Product" },
      { id: 23, name: "GNC Whey Pro Performance", weight: "2LB/907GM", flavors: "Chocolate", price: 2799, image: "/image/Whey_protien/GncProPerform/gnc_pro_perfm_chocolate_2Lb.webp", route: "/Product" },
      { id: 24, name: "GNC Whey Pro Performance", weight: "4LB/1.8KG", flavors: "Chocolate Fudge", price: 4999, image: "/image/Whey_protien/GncProPerform/gnc_pro_perfm_chocolate_fudge_4Lb.webp", route: "/Product" },
      { id: 25, name: "GNC Whey Pro Performance", weight: "4LB/1.8KG", flavors: "Vanilla", price: 4999, image: "/image/Whey_protien/GncProPerform/gnc_pro_perfm_vanilla_4Lb.webp", route: "/Product" },
      { id: 26, name: "GNC Whey Pro Performance", weight: "4LB/1.8KG", flavors: "Chocolate", price: 4999, image: "/image/Whey_protien/GncProPerform/gnc_pro_perfm_chocolate_4Lb.webp", route: "/Product" },


      { id: 27, name: "GNC Pure Isolate", weight: "2LB", flavors: "Chocolate Frosting", price: 3599, image: "/image/Whey_protien/GncPureIsolate/gnc_pure_isolate_chocolate_fudge_2Lb.jpg", route: "/Product" },
      { id: 28, name: "GNC Pure Isolate", weight: "4LB", flavors: "Chocolate Frosting", price: 6299, image: "/image/Whey_protien/GncPureIsolate/gnc_pure_isolate_chocolate_fudge_4Lb.jpg", route: "/Product" },
      { id: 29, name: "GNC Pure Isolate", weight: "2LB", flavors: "Vanilla", price: 3599, image: "/image/Whey_protien/GncPureIsolate/gnc_pure_isolate_vanilla_2Lb.jpg", route: "/Product" },
      { id: 30, name: "GNC Pure Isolate", weight: "4LB", flavors: "Vanilla", price: 6299, image: "/image/Whey_protien/GncPureIsolate/gnc_pure_isolate_vanilla_4Lb.webp", route: "/Product" },

      { id: 32, name: "GNC Select", weight: "1KG", flavors: "Chocolate", price: 2199, image: "/image/Whey_protien/GncSelect/gnc_select_choc_1kg.webp", route: "/Product" },
      { id: 33, name: "GNC Select", weight: "2KG", flavors: "Chocolate", price: 3999, image: "/image/Whey_protien/GncSelect/gnc_select_choc_2kg.webp", route: "/Product" },      
      { id: 34, name: "BPI Whey HD", weight: "1KG", flavors: "Chocolate Delight", price: 2499, image: "/image/Whey_protien/BPI/bpi_delight_1kg.webp", route: "/Product" },
      { id: 35, name: "BPI Whey HD", weight: "2KG", flavors: "Chocolate Delight", price: 4299, image: "/image/Whey_protien/BPI/bpi_delight_2kg.png", route: "/Product" },


      { id: 36, name: "One Science Whey Protein", weight: "1LB", flavors: "Chocolate Charge", price: 1299, image: "/image/Whey_protien/OneScience/OneScience_choc_1lb.jpg", route: "/Product" },
      { id: 37, name: "One Science Whey Protein", weight: "2LB/907GM", flavors: "Chocolate Charge", price: 2399, image: "/image/Whey_protien/OneScience/OneScience_choc_2lb.png", route: "/Product" },
      { id: 38, name: "One Science Whey Protein", weight: "4LB/1.8KG", flavors: "Chocolate Charge", price: 4299, image: "/image/Whey_protien/OneScience/OneScience_choc_4lb.png", route: "/Product" },
      { id: 39, name: "Isopure Whey Protein", weight: "1KG", flavors: "Chocolate", price: 2699, image: "/image/Whey_protien/Isopure/isopure_choc_1kg.png", route: "/Product" },
      { id: 40, name: "Isopure Whey Protein", weight: "2KG", flavors: "Chocolate", price: 4899, image: "/image/Whey_protien/Isopure/isopure_choc_2kg.webp", route: "/Product" },

      { id: 41, name: "MB Biozyme Whey Performance", weight: "1KG", flavors: "Rich Chocolate", price: 3299, image: "/image/Whey_protien/MB_performance/mb_rich_choc_1kg.webp", route: "/Product" },
      { id: 42, name: "MB Biozyme Whey Performance", weight: "2KG", flavors: "Rich Chocolate", price: 5999, image: "/image/Whey_protien/MB_performance/mb_rich_choc_2kg.avif", route: "/Product" },
      { id: 43, name: "MB Biozyme Whey Performance", weight: "1KG", flavors: "Chocolate Hazelnut", price: 3299, image: "/image/Whey_protien/MB_performance/mb_choc_hazlenut_1kg.webp", route: "/Product" },
      { id: 44, name: "MB Biozyme Whey Performance", weight: "2KG", flavors: "Chocolate Hazelnut", price: 5999, image: "/image/Whey_protien/MB_performance/mb_choc_hazlenut_2kg.jpg", route: "/Product" },
      { id: 45, name: "MB Biozyme Whey Performance", weight: "1KG", flavors: "Choco Crispie", price: 3299, image: "/image/Whey_protien/MB_performance/mb_choc_crispe_1kg.jpg", route: "/Product" },
      { id: 46, name: "MB Biozyme Whey Performance", weight: "2KG", flavors: "Choco Crispie", price: 5999, image: "/image/Whey_protien/MB_performance/mb_choc_crispe_2kg.webp", route: "/Product" },
      { id: 47, name: "MB Biozyme Whey Performance", weight: "1KG", flavors: "Kesar Thandai", price: 3299, image: "/image/Whey_protien/MB_performance/mb_kesar_1kg.png", route: "/Product" },
      { id: 48, name: "MB Biozyme Whey Performance", weight: "2KG", flavors: "Kesar Thandai", price: 5999, image: "/image/Whey_protien/MB_performance/mb_kesar_2kg.jpg", route: "/Product" },
      { id: 49, name: "MB Biozyme Whey Performance", weight: "1KG", flavors: "Magical Mango", price: 3299, image: "/image/Whey_protien/MB_performance/mb_magical_mango_1kg.jpg", route: "/Product" },
      { id: 50, name: "MB Biozyme Whey Performance", weight: "2KG", flavors: "Magical Mango", price: 5999, image: "/image/Whey_protien/MB_performance/mb_magical_mango_2kg.jpg", route: "/Product" },


      { id: 51, name: "MB Biozyme Whey Isozero", weight: "1KG", flavors: "Ice Cream Chocolate", price: 3799, image: "/image/Whey_protien/MB_Isozero/Isozero_choc_1kg.jpg", route: "/Product" },
      { id: 52, name: "MB Biozyme Whey Isozero", weight: "2KG", flavors: "Ice Cream Chocolate", price: 6899, image: "/image/Whey_protien/MB_Isozero/Isozero_choc_2kg.jpg", route: "/Product" },
      { id: 53, name: "MB Biozyme Whey Isozero", weight: "1KG", flavors: "Cookies & Cream", price: 3799, image: "/image/Whey_protien/MB_Isozero/Isozero_cookies&cream_1kg.jpg", route: "/Product" },
      { id: 54, name: "MB Biozyme Whey Isozero", weight: "2KG", flavors: "Cookies & Cream", price: 6899, image: "/image/Whey_protien/MB_Isozero/Isozero_cookies&cream_2kg.jpg", route: "/Product" },
     
      { id: 55, name: "MB Biozyme Whey PR", weight: "1KG", flavors: "Chocolate Fudge", price: 3499, image: "/image/Whey_protien/MB_pr/mb_pr_choc_fudge_1kg.jpg", route: "/Product" },
      { id: 56, name: "MB Biozyme Whey PR", weight: "2KG", flavors: "Chocolate Fudge", price: 6399, image: "/image/Whey_protien/MB_pr/mb_pr_choc_fudge_2kg.jpg", route: "/Product" },
      { id: 57, name: "MB Biozyme Whey PR", weight: "1KG", flavors: "Cookies & Cream", price: 3499, image: "/image/Whey_protien/MB_pr/mb_pr_cokies&cream_1kg.jpg", route: "/Product" },
      { id: 58, name: "MB Biozyme Whey PR", weight: "2KG", flavors: "Cookies & Cream", price: 6399, image: "/image/Whey_protien/MB_pr/mb_pr_cokies&cream_2kg.jpg", route: "/Product" },
     
      { id: 59, name: "Avvatar Whey Protein", weight: "1KG", flavors: "Belgian Chocolate", price: 2899, image: "/image/Whey_protien/Avvatar_Whey/Avvatar_belgain_1kg.jpg", route: "/Product" },
      { id: 60, name: "Avvatar Whey Protein", weight: "2KG", flavors: "Belgian Chocolate", price: 5299, image: "/image/Whey_protien/Avvatar_Whey/Avvatar_belgain_2kg.jpg", route: "/Product" },
      { id: 61, name: "Avvatar Whey Protein", weight: "1KG", flavors: "Malai Kulfi", price: 2899, image: "/image/Whey_protien/Avvatar_Whey/Avvatar_malai_kulfi_1kg.avif", route: "/Product" },
      { id: 62, name: "Avvatar Whey Protein", weight: "2KG", flavors: "Malai Kulfi", price: 5299, image: "/image/Whey_protien/Avvatar_Whey/Avvatar_malai_kulfi_2kg.jpg", route: "/Product" },
      { id: 63, name: "Avvatar Whey Protein", weight: "1KG", flavors: "Chocolate Hazelnut", price: 2899, image: "/image/Whey_protien/Avvatar_Whey/Avvatar_hazlenut_1kg.jpg", route: "/Product" },
      { id: 64, name: "Avvatar Whey Protein", weight: "2KG", flavors: "Chocolate Hazelnut", price: 5299, image: "/image/Whey_protien/Avvatar_Whey/Avvatar_hazlenut_2kg.jpg", route: "/Product" },
     
      { id: 65, name: "Avvatar 100% Performance Whey", weight: "1KG", flavors: "Belgian Chocolate", price: 2699, image: "/image/Whey_protien/Avvatar_performance/Avvatar_belgain_1kg.jpg", route: "/Product" },
      { id: 66, name: "Avvatar 100% Performance Whey", weight: "2KG", flavors: "Belgian Chocolate", price: 4999, image: "/image/Whey_protien/Avvatar_performance/Avvatar_belgain_2kg.jpg", route: "/Product" },
      { id: 67, name: "Avvatar 100% Performance Whey", weight: "1KG", flavors: "Malai Kulfi", price: 2699, image: "/image/Whey_protien/Avvatar_performance/Avvatar_malai_kulfi_1kg.jpg", route: "/Product" },
      { id: 68, name: "Avvatar 100% Performance Whey", weight: "2KG", flavors: "Malai Kulfi", price: 4999, image: "/image/Whey_protien/Avvatar_performance/Avvatar_malai_kulfi_2kg.jpg", route: "/Product" },
      { id: 69, name: "Avvatar 100% Performance Whey", weight: "1KG", flavors: "Chocolate Hazelnut", price: 2699, image: "/image/Whey_protien/Avvatar_performance/Avvatar_hazlenut_1kg.jpg", route: "/Product" },
      { id: 70, name: "Avvatar 100% Performance Whey", weight: "2KG", flavors: "Chocolate Hazelnut", price: 4999, image: "/image/Whey_protien/Avvatar_performance/Avvatar_hazlenut_2kg.jpg", route: "/Product" },
     
      { id: 71, name: "Avvatar Isorich", weight: "1KG", flavors: "Belgian Chocolate", price: 3199, image: "/image/Whey_protien/Avvatar_Isorich/Avvatar_iso_belgain_1kg.jpg", route: "/Product" },
      { id: 72, name: "Avvatar Isorich", weight: "2KG", flavors: "Belgian Chocolate", price: 5899, image: "/image/Whey_protien/Avvatar_Isorich/Avvatar_iso_belgain_2kg.jpg", route: "/Product" },
      { id: 73, name: "Avvatar Isorich", weight: "1KG", flavors: "Malai Kulfi", price: 3199, image: "/image/Whey_protien/Avvatar_Isorich/Avvatar_iso_malai_kulfi_1kg.jpg", route: "/Product" },
      { id: 74, name: "Avvatar Isorich", weight: "2KG", flavors: "Malai Kulfi", price: 5899, image: "/image/Whey_protien/Avvatar_Isorich/Avvatar_iso_malai_kulfi_2kg.jpg", route: "/Product" },
      { id: 75, name: "Avvatar Isorich", weight: "1KG", flavors: "Chocolate Hazelnut", price: 3199, image: "/image/Whey_protien/Avvatar_Isorich/Avvatar_iso_hazelnut_1kg.jpg", route: "/Product" },
      { id: 76, name: "Avvatar Isorich", weight: "2KG", flavors: "Chocolate Hazelnut", price: 5899, image: "/image/Whey_protien/Avvatar_Isorich/Avvatar_iso_hazelnut_2kg.jpg", route: "/Product" },
     
      { id: 77, name: "Fuelone Whey", weight: "1KG", flavors: "Chocolate", price: 1999, image: "/image/Whey_protien/Fuelone/Fuelone_choc_1kg.jpg", route: "/Product" },
      { id: 78, name: "Fuelone Whey", weight: "2KG", flavors: "Chocolate", price: 3699, image: "/image/Whey_protien/Fuelone/Fuelone_choc_2kg.jpg", route: "/Product" },
     
      { id: 79, name: "Attom Whey", weight: "1KG", flavors: "Double Rich Chocolate", price: 2299, image: "/image/Whey_protien/Atom/Atom_doble_rich_1kg.jpg", route: "/Product" },
      { id: 80, name: "Attom Whey", weight: "2KG", flavors: "Double Rich Chocolate", price: 4199, image: "/image/Whey_protien/Atom/Atom_doble_rich_2kg.webp", route: "/Product" },
      { id: 81, name: "Attom Whey", weight: "1KG", flavors: "French Vanilla", price: 2299, image: "/image/Whey_protien/Atom/Atom_vanilla_1kg.jpg", route: "/Product" },
      { id: 82, name: "Attom Whey", weight: "2KG", flavors: "French Vanilla", price: 4199, image: "/image/Whey_protien/Atom/Atom_vanilla_2kg.jpg", route: "/Product" },
      
      { id: 83, name: "Morphenlab Turbo Whey", weight: "1KG", flavors: "Butter Scotch", price: 1899, image: "/image/Whey_protien/Morphen_turbo/Turbo_butterscotch_1kg.webp", route: "/Product" },
      { id: 84, name: "Morphenlab Whey Protein", weight: "2KG", flavors: "Chocolate", price: 3299, image: "/image/Whey_protien/Morphen_whey/Whey_choc_2kg.jpg", route: "/Product" },
      
      { id: 85, name: "Absolute Whey Legender", weight: "1KG", flavors: "Chocolate", price: 2599, image: "/image/Whey_protien/Absolute_Whey/Absolute_choc_1kg.jpg", route: "/Product" },
      { id: 86, name: "Absolute Whey Legender", weight: "2KG", flavors: "Chocolate", price: 4799, image: "/image/Whey_protien/Absolute_Whey/Absolute_choc_2kg.webp", route: "/Product" },
      { id: 87, name: "Absolute Whey Legender", weight: "1KG", flavors: "Cashew Saffron Pistachio", price: 2599, image: "/image/Whey_protien/Absolute_Whey/Absolute_saffron_1kg.jpg", route: "/Product" },
      { id: 88, name: "Absolute Whey Legender", weight: "2KG", flavors: "Cashew Saffron Pistachio", price: 4799, image: "/image/Whey_protien/Absolute_Whey/Absolute_saffron_2kg.jpg", route: "/Product" },
    ]
  }
,
creatine: {
    name: "Creatine",
    slug: "creatine",
    description: "High-quality creatine supplements for strength and performance",
    products: [
      { id: 89, name: "MB Creapro", weight: "100GM", flavors: "Unflavoured", price: 599, image: "/image/Creatine/MB_Creamp/mb_unflavoured_100gm.jpg", route: "/Product" },
      { id: 90, name: "MB Creapro", weight: "250GM", flavors: "Unflavoured", price: 1199, image: "/image/Creatine/MB_Creamp/mb_unflavoured_250gm.jpg", route: "/Product" },
      { id: 91, name: "MB Creamp", weight: "120GM", flavors: "Citrus Blast", price: 699, image: "/image/Creatine/MB_Creamp/mb_citrus_blast_120gm.jpg", route: "/Product" },
      { id: 92, name: "MB Creamp", weight: "120GM", flavors: "Water Melon Kool Aid", price: 699, image: "/image/Creatine/MB_Creamp/mb_watermelon_120gm.jpg", route: "/Product" },
      { id: 93, name: "MB Creamp", weight: "320GM", flavors: "Citrus Blast", price: 1499, image: "/image/Creatine/MB_Creamp/mb_citrus_blast_320gm.jpg", route: "/Product" },
      { id: 94, name: "MB Creamp", weight: "320GM", flavors: "Water Melon Kool Aid", price: 1499, image: "/image/Creatine/MB_Creamp/mb_watermelon_320gm.jpg", route: "/Product" },
      { id: 95, name: "MB Creamp", weight: "320GM", flavors: "Juicy Berries", price: 1499, image: "/image/Creatine/MB_Creamp/mb_juicy_berry_320gm.jpg", route: "/Product" },
      { id: 96, name: "MB Creamp", weight: "320GM", flavors: "Candy Rush", price: 1499, image: "/image/Creatine/MB_Creamp/mb_candy_320gm.webp", route: "/Product" },
      
      { id: 97, name: "Wellcore", weight: "100GM", flavors: "Unflavoured", price: 549, image: "/image/Creatine/Wellcore/Wellcore_unflavoured_100gm.jpg", route: "/Product" },
      { id: 98, name: "Wellcore", weight: "250GM", flavors: "Unflavoured", price: 1099, image: "/image/Creatine/Wellcore/Wellcore_unflavoured_250gm.jpg", route: "/Product" },
      { id: 99, name: "Wellcore", weight: "122GM", flavors: "Tropical Tango", price: 749, image: "/image/Creatine/Wellcore/Wellcore_tropical_122gm.jpg", route: "/Product" },
      { id: 100, name: "Wellcore", weight: "121GM", flavors: "Fruit Fussion", price: 749, image: "/image/Creatine/Wellcore/Wellcore_fruit_fussion_122gm.jpg", route: "/Product" },
      { id: 101, name: "Wellcore", weight: "122GM", flavors: "Kiwi Kick", price: 749, image: "/image/Creatine/Wellcore/Wellcore_kiwi_122gm.jpg", route: "/Product" },
      { id: 102, name: "Wellcore", weight: "307GM", flavors: "Tropical Tango", price: 1599, image:"/image/Creatine/Wellcore/Wellcore_tropical_307gm.webp" , route:"/Product"},
      { id : 103, name : " Wellcore ", weight : "307GM ", flavors : "Fruit Fussion ", price : 1599 , image :"/image/Creatine/Wellcore/Wellcore_fruit_fussion_307gm.jpg", route :"/Product"},
      { id: 104, name: "Wellcore", weight: "307GM", flavors: "Kiwi Kick", price: 1599, image: "/image/Creatine/Wellcore/Wellcore_kiwi_307gm.jpg", route: "/Product" },
      
      { id: 105, name: "GNC", weight: "100GM", flavors: "Unflavoured", price: 699, image: "", route: "/Product" },
      { id: 106, name: "GNC", weight: "100GM", flavors: "Orange", price: 699, image: "", route: "/Product" },
      { id: 107, name: "GNC", weight: "100GM", flavors: "Blueberry", price: 699, image: "", route: "/Product" },
      { id: 108, name: "GNC", weight: "100GM", flavors: "Cranberry", price: 699, image: "", route: "/Product" },
      { id: 109, name: "GNC", weight: "100GM", flavors: "Lemon", price: 699, image: "", route: "/Product" },
      { id: 110, name: "GNC", weight: "250GM", flavors: "Unflavoured", price: 1399, image: "", route: "/Product" },
      { id: 111, name: "GNC", weight: "250GM", flavors: "Orange", price: 1399, image: "", route: "/Product" },
      { id: 112, name: "GNC", weight: "250GM", flavors: "Blueberry", price: 1399, image: "", route: "/Product" },
      { id: 113, name: "GNC", weight: "250GM", flavors: "Cranberry", price: 1399, image: "", route: "/Product" },
      { id: 114, name: "GNC", weight: "250GM", flavors: "Lemon", price: 1399, image: "", route: "/Product" },
      { id: 115, name: "GNC", weight: "400GM", flavors: "Unflavoured", price: 1999, image: "", route: "/Product" },
      { id: 116, name: "GNC", weight: "400GM", flavors: "Orange", price: 1999, image: "", route: "/Product" },
      { id: 117, name: "GNC", weight: "400GM", flavors: "Blueberry", price: 1999, image: "", route: "/Product" },
      { id: 118, name: "GNC", weight: "400GM", flavors: "Cranberry", price: 1999, image: "", route: "/Product" },
      { id: 119, name: "GNC", weight: "400GM", flavors: "Lemon", price: 1999, image: "", route: "/Product" },
      { id: 120, name: "GNC Creatine + Electrolytes", weight: "100GM", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 121, name: "GNC Creatine + Electrolytes", weight: "100GM", flavors: "Orange", price: 799, image: "", route: "/Product" },
      { id: 122, name: "GNC Creatine + Electrolytes", weight: "100GM", flavors: "Lemon", price: 799, image: "", route: "/Product" },
      { id: 123, name: "GNC Creatine + Electrolytes", weight: "250GM", flavors: "Unflavoured", price: 1599, image: "", route: "/Product" },
      { id: 124, name: "GNC Creatine + Electrolytes", weight: "250GM", flavors: "Orange", price: 1599, image: "", route: "/Product" },
      { id: 125, name: "GNC Creatine + Electrolytes", weight: "250GM", flavors: "Lemon", price: 1599, image: "", route: "/Product" },
      { id: 126, name: "GNC Creatine + Electrolytes", weight: "400GM", flavors: "Unflavoured", price: 2299, image: "", route: "/Product" },
      { id: 127, name: "GNC Creatine + Electrolytes", weight: "400GM", flavors: "Orange", price: 2299, image: "", route: "/Product" },
      { id: 128, name: "GNC Creatine + Electrolytes", weight: "400GM", flavors: "Lemon", price: 2299, image: "", route: "/Product" },
      { id: 129, name: "Fast & Up Electrolytes", weight: "20N", flavors: "Orange", price: 899, image: "", route: "/Product" },
      { id: 130, name: "Muscle Tech", weight: "100GM", flavors: "Unflavoured", price: 649, image: "", route: "/Product" },
      { id: 131, name: "Muscle Tech", weight: "250GM", flavors: "Unflavoured", price: 1299, image: "", route: "/Product" },
      { id: 132, name: "Muscle Tech", weight: "400GM", flavors: "Unflavoured", price: 1899, image: "", route: "/Product" },
      { id: 133, name: "Labrada Creatine", weight: "100G", flavors: "Unflavoured", price: 999, image: "", route: "/Product" },
      { id: 134, name: "Labrada Creatine", weight: "250G", flavors: "Unflavoured", price: 999, image: "", route: "/Product" },
      { id: 135, name: "ON Creatine", weight: "100GM", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 136, name: "ON Creatine", weight: "250GM", flavors: "Unflavoured", price: 1199, image: "", route: "/Product" },
    ]
  },
  massGainer: {
    name: "Mass Gainer",
    slug: "mass-gainer",
    description: "High-calorie mass gainers for muscle building and weight gain",
    products: [
      { id: 137, name: "MB Mass Gainer", weight: "1KG", flavors: "Chocolate", price: 1799, image: "", route: "/Product" },
      { id: 138, name: "MB Mass Gainer", weight: "3KG", flavors: "Chocolate", price: 4299, image: "", route: "/Product" },
      { id: 139, name: "MB Mass Gainer", weight: "5KG", flavors: "Chocolate", price: 6799, image: "", route: "/Product" },
      { id: 140, name: "GNC Mass Gainer", weight: "2KG", flavors: "Chocolate", price: 2499, image: "", route: "/Product" },
      { id: 141, name: "Labrada Mass Gainer", weight: "1KG", flavors: "Chocolate", price: 1899, image: "", route: "/Product" },
      { id: 142, name: "Labrada Mass Gainer", weight: "3KG", flavors: "Chocolate", price: 4699, image: "", route: "/Product" },
      { id: 143, name: "Labrada Mass Gainer", weight: "1KG", flavors: "Cafe Mocha", price: 1899, image: "", route: "/Product" },
      { id: 144, name: "Labrada Mass Gainer", weight: "3KG", flavors: "Cafe Mocha", price: 4699, image: "", route: "/Product" },
      { id: 145, name: "MuscleTech Mass", weight: "3KG", flavors: "Chocolate", price: 2999, image: "", route: "/Product" },
      { id: 146, name: "MuscleTech Mass", weight: "3KG", flavors: "Vanilla", price: 2999, image: "", route: "/Product" },
      { id: 147, name: "On Mass Gainer", weight: "1KG", flavors: "Dutch Chocolate", price: 2199, image: "", route: "/Product" },
      { id: 148, name: "On Mass Gainer", weight: "3KG", flavors: "Dutch Chocolate", price: 5299, image: "", route: "/Product" },
      { id: 149, name: "On Mass Gainer", weight: "1KG", flavors: "Vanilla", price: 2199, image: "", route: "/Product" },
      { id: 150, name: "On Mass Gainer", weight: "3KG", flavors: "Vanilla", price: 5299, image: "", route: "/Product" },
      { id: 151, name: "Morphen Mass Gainer", weight: "3KG", flavors: "Butter Scotch", price: 1699, image: "", route: "/Product" },
      { id: 152, name: "Morphen Mass Gainer", weight: "3KG", flavors: "Chocolate", price: 1699, image: "", route: "/Product" },
      { id: 153, name: "Absolute Mass Gainer", weight: "1KG", flavors: "Chocolate", price: 1599, image: "", route: "/Product" },
      { id: 154, name: "Absolute Mass Gainer", weight: "3KG", flavors: "Chocolate", price: 3999, image: "", route: "/Product" },
      { id: 155, name: "Absolute Mass Gainer", weight: "1KG", flavors: "Vanilla", price: 1599, image: "", route: "/Product" },
      { id: 156, name: "Absolute Mass Gainer", weight: "3KG", flavors: "Vanilla", price: 3999, image: "", route: "/Product" },
      { id: 157, name: "Avvatar Mass Gainer", weight: "2KG", flavors: "Belgian Chocolate", price: 2399, image: "", route: "/Product" },
      { id: 158, name: "Avvatar Mass Gainer", weight: "4KG", flavors: "Belgian Chocolate", price: 4299, image: "", route: "/Product" },
    ]
  },
  multivitamin: {
    name: "Multivitamin",
    slug: "multivitamin",
    description: "Essential multivitamins for overall health and wellness",
    products: [
      { id: 159, name: "MB-Vite Daily Multivitamin", weight: "60N", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 160, name: "MB-Vite Daily Multivitamin", weight: "90N", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 161, name: "MB 5in1 Multivitamin", weight: "90N", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 162, name: "GNC Mega Men Daily Multivitamin", weight: "30N", flavors: "Unflavoured", price: 899, image: "", route: "/Product" },
      { id: 163, name: "GNC Mega Men Daily Multivitamin", weight: "60N", flavors: "Unflavoured", price: 1599, image: "", route: "/Product" },
      { id: 164, name: "MuscleTech Multivitamin", weight: "60N", flavors: "Unflavoured", price: 749, image: "", route: "/Product" },
      { id: 165, name: "On Multivitamine For Men", weight: "60N", flavors: "Unflavoured", price: 699, image: "", route: "/Product" },
      { id: 166, name: "BigMuscle Multivitamine", weight: "60N", flavors: "Unflavoured", price: 549, image: "", route: "/Product" },
      { id: 167, name: "C4 Multivitamin", weight: "180N", flavors: "Unflavoured", price: 1299, image: "", route: "/Product" },
    ]
  },
  fishOil: {
    name: "Fish Oil",
    slug: "fish-oil",
    description: "Omega-3 fish oil supplements for heart and brain health",
    products: [
      { id: 168, name: "MB Omega3 FishOil 1000mg", weight: "60N", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 169, name: "MB Omega3 FishOil 1000mg", weight: "90N", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 170, name: "MB Omega3 FishOil Gold", weight: "60N", flavors: "Unflavoured", price: 899, image: "", route: "/Product" },
      { id: 171, name: "GNC Omega3 Fish Oil", weight: "60N", flavors: "Unflavoured", price: 749, image: "", route: "/Product" },
      { id: 172, name: "GNC Omega3 Fish Oil", weight: "90N", flavors: "Unflavoured", price: 1049, image: "", route: "/Product" },
      { id: 173, name: "GNC Triple Strength Fish Oil", weight: "60N", flavors: "Unflavoured", price: 1199, image: "", route: "/Product" },
      { id: 174, name: "On FishOil", weight: "60N", flavors: "Unflavoured", price: 649, image: "", route: "/Product" },
      { id: 175, name: "Alaska Omega3 Fish Oil", weight: "100N", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 176, name: "MuscleTech Omega3 Fish Oil", weight: "100N", flavors: "Unflavoured", price: 899, image: "", route: "/Product" },
      { id: 177, name: "Neuherbs Deep Sea Fish Oil 2500mg", weight: "60N", flavors: "Unflavoured", price: 699, image: "", route: "/Product" },
    ]
  },
  preWorkout: {
    name: "Pre Workout",
    slug: "pre-workout",
    description: "Energy-boosting pre-workout supplements for intense training",
    products: [
      { id: 178, name: "MB Pre Workout 200 XTreme", weight: "100G", flavors: "Fruit Punch", price: 899, image: "", route: "/Product" },
      { id: 179, name: "MB Pre Workout 200 XTreme", weight: "200G", flavors: "Fruit Punch", price: 1599, image: "", route: "/Product" },
      { id: 180, name: "MB Pre Workout 200 XTreme", weight: "100G", flavors: "Tangy Orange", price: 899, image: "", route: "/Product" },
      { id: 181, name: "MB Pre Workout 200 XTreme", weight: "200G", flavors: "Tangy Orange", price: 1599, image: "", route: "/Product" },
      { id: 182, name: "MB Pre Workout IMPAktix", weight: "340G", flavors: "Fruit Fury", price: 1499, image: "", route: "/Product" },
      { id: 183, name: "MB Pre Workout IMPAktix", weight: "510G", flavors: "Fruit Fury", price: 2099, image: "", route: "/Product" },
      { id: 184, name: "MB Pre Workout IMPAktix", weight: "340G", flavors: "Cola Frost", price: 1499, image: "", route: "/Product" },
      { id: 185, name: "MB Pre Workout IMPAktix", weight: "510G", flavors: "Cola Frost", price: 2099, image: "", route: "/Product" },
      { id: 186, name: "The Big Daddy Inferno", weight: "300GM", flavors: "Fruit Punch", price: 1299, image: "", route: "/Product" },
      { id: 187, name: "GNC Pro Performance Pre Workout", weight: "360GM", flavors: "Fruit Punch", price: 1699, image: "", route: "/Product" },
      { id: 188, name: "BigMuscle Karnage Pre Workout", weight: "300GM", flavors: "Watermelon Lime", price: 1199, image: "", route: "/Product" },
      { id: 189, name: "BigMuscle Karnage Pre Workout", weight: "300GM", flavors: "Arctic Blast", price: 1199, image: "", route: "/Product" },
      { id: 190, name: "BigMuscle Karnage Pre Workout", weight: "300GM", flavors: "Sex On The Beach", price: 1199, image: "", route: "/Product" },
      { id: 191, name: "Wellversed Dynamite", weight: "420GM", flavors: "Fruit Blast", price: 1399, image: "", route: "/Product" },
      { id: 192, name: "Wellversed Dynamite", weight: "420GM", flavors: "Berry Burst", price: 1399, image: "", route: "/Product" },
      { id: 193, name: "Wellversed Dynamite", weight: "420GM", flavors: "Watermelon Ice", price: 1399, image: "", route: "/Product" },
      { id: 194, name: "Fast & Up Citirun", weight: "200GM", flavors: "Unflavoured", price: 799, image: "", route: "/Product" },
      { id: 195, name: "GNC L-Arginine", weight: "90N", flavors: "Unflavoured", price: 1099, image: "", route: "/Product" },
    ]
  },
  weightLoss: {
    name: "Weight Loss",
    slug: "weight-loss",
    description: "Fat burners and weight loss supplements for achieving your fitness goals",
    products: [
      { id: 196, name: "MB L-Carnitine 1100mg", weight: "450ML", flavors: "Key Lime", price: 799, image: "", route: "/Product" },
      { id: 197, name: "MB L-Carnitine 1100mg", weight: "450ML", flavors: "Tangy Orange", price: 799, image: "", route: "/Product" },
      { id: 198, name: "MB L-Carnitine 1000mg", weight: "450ML", flavors: "Key Lime", price: 749, image: "", route: "/Product" },
      { id: 199, name: "MB L-Carnitine 1000mg", weight: "450ML", flavors: "Tangy Orange", price: 749, image: "", route: "/Product" },
      { id: 200, name: "GNC L-Carnitine 3000mg", weight: "450ML", flavors: "Orange", price: 1199, image: "", route: "/Product" },
      { id: 201, name: "Fast And Up L-Carnitine 3000mg", weight: "30N", flavors: "Lemon", price: 899, image: "", route: "/Product" },
      { id: 202, name: "Fast And Up L-Carnitine 3000mg", weight: "30N", flavors: "Orange", price: 899, image: "", route: "/Product" },
      { id: 203, name: "MB Fat Burner Pro", weight: "60N", flavors: "Unflavoured", price: 699, image: "", route: "/Product" },
      { id: 204, name: "Apple Cider Vinegar", weight: "500ml", flavors: "Natural", price: 399, image: "", route: "/Product" },
    ]
  },
  recovery: {
    name: "Recovery",
    slug: "recovery",
    description: "Post-workout recovery supplements for muscle repair",
    products: [
      { id: 205, name: "MB L-Glutamine", weight: "250GM", flavors: "Unflavoured", price: 899, image: "", route: "/Product" },
      { id: 206, name: "GNC L-Glutamine", weight: "250GM", flavors: "Unflavoured", price: 999, image: "", route: "/Product" },
    ]
  },
  intraWorkout: {
    name: "Intra Workout",
    slug: "intra-workout",
    description: "BCAA and intra-workout supplements for endurance",
    products: [
      { id: 207, name: "MB BCAA Pro", weight: "450G", flavors: "Green Apple", price: 1299, image: "", route: "/Product" },
      { id: 208, name: "MB BCAA Pro", weight: "450G", flavors: "Watermelon", price: 1299, image: "", route: "/Product" },
      { id: 209, name: "MB BCAA Pro", weight: "245GM", flavors: "Green Apple", price: 799, image: "", route: "/Product" },
      { id: 210, name: "MB BCAA Pro", weight: "245GM", flavors: "Watermelon", price: 799, image: "", route: "/Product" },
    ]
  },
  minerals: {
    name: "Minerals & Health",
    slug: "minerals-health",
    description: "Essential minerals and health supplements",
    products: [
      { id: 211, name: "GNC Calcium Plus", weight: "60N", flavors: "Unflavoured", price: 499, image: "", route: "/Product" },
      { id: 212, name: "GNC Zinc Magnesium", weight: "60N", flavors: "Unflavoured", price: 599, image: "", route: "/Product" },
      { id: 213, name: "GNC Collagen", weight: "200G", flavors: "Lemon", price: 1499, image: "", route: "/Product" },
      { id: 214, name: "GNC Collagen", weight: "200G", flavors: "Orange", price: 1499, image: "", route: "/Product" },
    ]
  },
  peanutButter: {
    name: "Peanut Butter & Oats",
    slug: "peanut-butter-oats",
    description: "Healthy peanut butter and oats for nutrition",
    products: [
      { id: 215, name: "MyFitness Peanut Butter Smooth", weight: "1.25KG", flavors: "Chocolate", price: 599, image: "", route: "/Product" },
      { id: 216, name: "MyFitness Peanut Butter Crunchy", weight: "1KG", flavors: "Dark Chocolate", price: 549, image: "", route: "/Product" },
      { id: 217, name: "MyFitness Peanut Butter Smooth", weight: "510G", flavors: "Dark Chocolate", price: 349, image: "", route: "/Product" },
      { id: 218, name: "MyFitness Peanut Butter Crunchy", weight: "510G", flavors: "Dark Chocolate", price: 349, image: "", route: "/Product" },
      { id: 219, name: "MyFitness Peanut Butter Smooth", weight: "227G", flavors: "Chocolate", price: 199, image: "", route: "/Product" },
      { id: 220, name: "MyFitness Peanut Butter Crunchy", weight: "227G", flavors: "Chocolate", price: 199, image: "", route: "/Product" },
      { id: 221, name: "MyFitness Peanut Butter Crispy", weight: "227G", flavors: "Chocolate", price: 219, image: "", route: "/Product" },
      { id: 222, name: "Pintola Peanut Butter", weight: "1KG", flavors: "Classic", price: 449, image: "", route: "/Product" },
      { id: 223, name: "Pintola Peanut Butter", weight: "1KG", flavors: "Chocolate", price: 449, image: "", route: "/Product" },
      { id: 224, name: "Pintola Peanut Butter", weight: "510G", flavors: "Classic", price: 279, image: "", route: "/Product" },
      { id: 225, name: "Pintola Peanut Butter", weight: "510G", flavors: "Chocolate", price: 279, image: "", route: "/Product" },
    ]
  },
  ayurvedic: {
    name: "Ayurvedic Products",
    slug: "ayurvedic",
    description: "Natural ayurvedic supplements for holistic health",
    products: [
      { id: 226, name: "Kapiva Shilajit", weight: "20G", flavors: "Natural", price: 799, image: "", route: "/Product" },
      { id: 227, name: "Kapiva Shilajit Gold", weight: "20G", flavors: "Natural", price: 999, image: "", route: "/Product" },
      { id: 228, name: "Kapiva Ashwagandha Gold", weight: "90N", flavors: "Natural", price: 699, image: "", route: "/Product" },
      { id: 229, name: "Kapiva Shilajit Gold Capsul", weight: "60N", flavors: "Natural", price: 899, image: "", route: "/Product" },
    ]
  },
  proteinBars: {
    name: "Protein Bars & Snacks",
    slug: "protein-bars",
    description: "Healthy protein bars, cookies and chips",
    products: [
      { id: 230, name: "Max Protein Bar", weight: "10GM/Each", flavors: "Choco Berry", price: 50, image: "", route: "/Product" },
      { id: 231, name: "Max Protein Bar", weight: "10GM/Each", flavors: "Choco Almond", price: 50, image: "", route: "/Product" },
      { id: 232, name: "Max Protein Bar", weight: "10GM/Each", flavors: "Date Almond", price: 50, image: "", route: "/Product" },
      { id: 233, name: "Max Protein Bar", weight: "20GM/Each", flavors: "Choco Berry", price: 80, image: "", route: "/Product" },
      { id: 234, name: "Max Protein Bar", weight: "20GM/Each", flavors: "Choco Almond", price: 80, image: "", route: "/Product" },
      { id: 235, name: "Max Protein Bar", weight: "20GM/Each", flavors: "Date Almond", price: 80, image: "", route: "/Product" },
      { id: 236, name: "Avvatar Wafer", weight: "10GM/Each", flavors: "Chocolate Coffee", price: 45, image: "", route: "/Product" },
      { id: 237, name: "MB Protein Bar", weight: "10GM/Each", flavors: "Choco Almond", price: 55, image: "", route: "/Product" },
      { id: 238, name: "MB Protein Bar", weight: "20GM/Each", flavors: "Choco Almond", price: 90, image: "", route: "/Product" },
      { id: 239, name: "Max Protein Chips", weight: "10GM", flavors: "Spanish Tomato", price: 40, image: "", route: "/Product" },
      { id: 240, name: "Max Protein Chips", weight: "10GM", flavors: "Cream & Onion", price: 40, image: "", route: "/Product" },
      { id: 241, name: "Max Protein Chips", weight: "10GM", flavors: "Desi Masala", price: 40, image: "", route: "/Product" },
      { id: 242, name: "Max Protein Chips", weight: "10GM", flavors: "Chinese Manchurian", price: 40, image: "", route: "/Product" },
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
