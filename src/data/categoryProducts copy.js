const cdn = "https://res.cloudinary.com/dflefzc57/image/upload";

const img = {
  samsungGamingTV:   `${cdn}/v1774587472/fdec19f8f124e46221abc2411849c15e103d34ed_sxbtzu.png`,
  echoDot:           `${cdn}/v1774587673/1148aceb6acdc0945c8e5efe6a66b493e543383e_odelbh.png`,
  fridge:            `${cdn}/v1774587673/d2dc22749142b22126444e400047b16f51e35cbd_yvf1ee.png`,
  washingMachine:    `${cdn}/v1774587674/cb8c439f9bd4d15c5d0ac756658fa291d4baa178_oen9wq.png`,
  laptop:            `${cdn}/v1774587675/0074881b5428490a865df14325eb545028167fca_sdtjzo.png`,
  colorfulTVs:       `${cdn}/v1774587675/9f8ab0b589219fb00050b05c1cf9d32f77427d5d_d0rvn3.png`,
  samsungSmartFridge:`${cdn}/v1774587890/02a8a5ed7426c01574092a80cdb934b5815d3913_iahp6w.jpg`,
  multiLaptops:      `${cdn}/v1774587891/2b1c905777ce8c29741d5c1d55b2c5865842b271_e6j3bs.png`,
  sonyBraviaOLED:    `${cdn}/v1774587892/6b3e52073616c1b4bda4d7088c2cf2de2d70c839_funxnf.png`,
  lgTV32:            `${cdn}/v1774587960/844ae7a7068c2f800606fc9951d69fd811b3c643_gplb34.jpg`,
  airConditioner:    `${cdn}/v1774588036/062de4c02e446631416d09ebbbfab115e6d8c871_pply7i.png`,
  airConditionerRoom:`${cdn}/v1774588036/c886feefa823fcc7e6f474cca5df8eb7306ef379_qbilzc.png`,
  airFryer:          `${cdn}/v1774588055/3733bb16da6968acac7890050bbd4a5d01284a90_uvsrlk.png`,
  xiaomiTV32:        `${cdn}/v1774588056/a50678b827474afa4736ddb6eda6a5aedadbc6df_njx2jr.png`,
  samsungHDTV:       `${cdn}/v1774588070/d7fedac8ba34584edeed245c4b94a70f691a7a3b_qjkv4k.jpg`,
  samsungNeoQLED:    `${cdn}/v1774588233/ebfa63ce1469980eb65464eb4b4da00c734e9a66_lbreho.png`,
  sonyBraviaCompact: `${cdn}/v1774588233/eef2aad2bcfbbe42a3f7bd634a3e8db1c2c247de_x4djmi.png`,
  lgQNED65:          `${cdn}/v1774588233/8bf6cceaf893eee9d64d105593a691ff4056fc8d_uodfd9.png`,
  galaxyPhones:      `${cdn}/v1774588238/386142ec1aa98dc6485801d3d5f9d71ac37ed417_e08c3r.png`,
  phoneBlue:         `${cdn}/v1774588502/8815dd269aebbe22a2b1cadc1e398df8aa59b326_pm94fc.png`,
  rangeHood:         `${cdn}/v1774587672/1e095c7904e952de575d6915a88b2be229675b5e_wo5zoo.png`,
};

export const categoryData = {
  "Televisions": {
    filters: [
      { label: "Display Type",   options: ["LED", "OLED", "QLED", "4K UHD"] },
      { label: "Screen Size",    options: ["32 inch", "43 inch", "55 inch", "65 inch", "75 inch"] },
      { label: "Smart OS",       options: ["Google TV", "Android TV", "WebOS", "Tizen"] },
      { label: "HDMI Ports",     options: ["2 Ports", "3 Ports", "4 Ports"] },
    ],
    products: [
      { id: 1, name: "Samsung 163cm 65in QLED 4K Smart LED TV",            brand: "Samsung", image: img.samsungGamingTV,   price: "₹59,999",   originalPrice: "₹89,800",  discount: "33% Off", rating: 4.5, reviews: 128, bg: "#f0f4ff" },
      { id: 2, name: "Sony Bravia2 139.7cm 55in 4K Ultra HD LED Google TV", brand: "Sony",    image: img.sonyBraviaOLED,   price: "₹62,590",   originalPrice: "₹91,900",  discount: "32% Off", rating: 4.4, reviews: 96,  bg: "#fff5f5" },
      { id: 3, name: "LG 80cm 32in HD Ready Smart WebOS TV",                brand: "LG",      image: img.lgTV32,           price: "₹13,990",   originalPrice: "₹21,340",  discount: "34% Off", rating: 4.2, reviews: 210, bg: "#f0fff4" },
      { id: 4, name: "Samsung 138cm 55in Neo QLED 4K Smart TV",             brand: "Samsung", image: img.samsungNeoQLED,   price: "₹79,990",   originalPrice: "₹1,09,900",discount: "27% Off", rating: 4.6, reviews: 88,  bg: "#f0f8ff" },
      { id: 5, name: "LG 164cm 65in QNED 4K Ultra HD Smart TV",             brand: "LG",      image: img.lgQNED65,         price: "₹69,990",   originalPrice: "₹99,990",  discount: "30% Off", rating: 4.3, reviews: 42,  bg: "#f8f0ff" },
      { id: 6, name: "Mi 108cm 43in Full HD Android Smart TV",              brand: "Mi",      image: img.xiaomiTV32,       price: "₹12,499",   originalPrice: "₹18,999",  discount: "34% Off", rating: 4.1, reviews: 310, bg: "#fff8f0" },
      { id: 7, name: "Sony Bravia2 108cm 43in 4K Ultra HD Google TV",       brand: "Sony",    image: img.sonyBraviaCompact,price: "₹43,990",   originalPrice: "₹64,900",  discount: "32% Off", rating: 4.3, reviews: 76,  bg: "#f5f0ff" },
      { id: 8, name: "Samsung 80cm 32in HD Smart TV",                       brand: "Samsung", image: img.samsungHDTV,      price: "₹16,490",   originalPrice: "₹22,900",  discount: "28% Off", rating: 4.0, reviews: 145, bg: "#f0f4ff" },
    ],
    editorial: {
      title: "Buy Televisions Online",
      intro: "Explore a wide range of Smart TVs from Samsung, Sony, LG, Mi, and more at Matru Kripa Enterprises. Find the perfect screen size, display technology, and smart features for your home.",
      sections: [
        { heading: "LED, QLED & OLED — Which TV is Right for You?", body: "LED TVs are energy-efficient and bright, ideal for well-lit rooms. QLED TVs deliver enhanced colour and brightness using quantum dot technology. OLED TVs offer pixel-level contrast, deep blacks, and wide viewing angles — perfect for home theatre setups." },
        { heading: "Smart TVs with Google TV & WebOS", body: "Modern Smart TVs give you instant access to Netflix, YouTube, Disney+, and Prime Video. Google TV provides personalised recommendations, while LG's WebOS offers an intuitive interface. Voice assistants such as Google Assistant and Alexa are built in for hands-free control." },
        { heading: "Why Shop at Matru Kripa Enterprises?", body: "We offer genuine products, competitive prices, flexible EMI options, and reliable after-sales support. All televisions come with manufacturer warranty coverage." },
      ],
    },
  },

  "Refrigerators": {
    filters: [
      { label: "Type",        options: ["Single Door", "Double Door", "Side-by-Side", "French Door"] },
      { label: "Capacity",    options: ["150–200 L", "200–300 L", "300–400 L", "400 L+"] },
      { label: "Star Rating", options: ["3 Star", "4 Star", "5 Star"] },
      { label: "Technology",  options: ["Frost Free", "Direct Cool", "Inverter"] },
    ],
    products: [
      { id: 1, name: "Samsung 236L 3 Star Inverter Direct Cool Single Door Refrigerator", brand: "Samsung", image: img.fridge,            price: "₹19,490", originalPrice: "₹27,900", discount: "30% Off", rating: 4.3, reviews: 186, bg: "#f0f4ff" },
      { id: 2, name: "Samsung 330L Frost Free Double Door Smart Refrigerator",             brand: "Samsung", image: img.samsungSmartFridge,price: "₹38,990", originalPrice: "₹50,990", discount: "24% Off", rating: 4.5, reviews: 94,  bg: "#f0f8ff" },
      { id: 3, name: "LG 260L 3 Star Frost Free Double Door Refrigerator",                brand: "LG",      image: img.fridge,            price: "₹26,490", originalPrice: "₹34,900", discount: "24% Off", rating: 4.2, reviews: 132, bg: "#f4fff0" },
      { id: 4, name: "Whirlpool 265L 3 Star Frost Free Double Door Refrigerator",         brand: "Whirlpool",image: img.samsungSmartFridge,price: "₹24,990", originalPrice: "₹33,500", discount: "25% Off", rating: 4.1, reviews: 78,  bg: "#fff8f0" },
      { id: 5, name: "Haier 320L 3 Star Double Door Bottom Mount Refrigerator",           brand: "Haier",   image: img.fridge,            price: "₹28,490", originalPrice: "₹37,990", discount: "25% Off", rating: 4.0, reviews: 56,  bg: "#f8f0ff" },
      { id: 6, name: "Bosch 288L 3 Star Inverter Frost Free Double Door Refrigerator",    brand: "Bosch",   image: img.samsungSmartFridge,price: "₹32,990", originalPrice: "₹44,000", discount: "25% Off", rating: 4.4, reviews: 62,  bg: "#fff5f5" },
    ],
    editorial: {
      title: "Buy Refrigerators Online",
      intro: "Discover the best refrigerators from Samsung, LG, Whirlpool, Bosch, and more. Whether you need a compact single-door fridge or a large French door model, we have the right cooling solution for your home.",
      sections: [
        { heading: "Single Door vs Double Door vs Side-by-Side", body: "Single door refrigerators are compact and energy-efficient, ideal for smaller households. Double door models offer separate freezer compartments and larger storage capacity. Side-by-side refrigerators are premium options with spacious layouts and advanced features." },
        { heading: "Frost Free vs Direct Cool", body: "Frost Free refrigerators prevent ice build-up automatically, saving maintenance time. Direct Cool models are more energy-efficient and affordable, though they require manual defrosting. Both types are available with inverter technology for energy savings." },
      ],
    },
  },

  "Washing Machines": {
    filters: [
      { label: "Type",          options: ["Front Load", "Top Load", "Semi Automatic"] },
      { label: "Capacity",      options: ["6 kg", "7 kg", "8 kg", "9 kg", "10 kg+"] },
      { label: "Star Rating",   options: ["3 Star", "4 Star", "5 Star"] },
      { label: "Technology",    options: ["Inverter Motor", "Direct Drive", "Steam Wash"] },
    ],
    products: [
      { id: 1, name: "Bosch 9kg Fully Automatic Front Load Washing Machine",        brand: "Bosch",   image: img.washingMachine,  price: "₹43,199", originalPrice: "₹58,990", discount: "27% Off", rating: 4.5, reviews: 108, bg: "#f0f4ff" },
      { id: 2, name: "Samsung 8kg Inverter 5 Star Fully Automatic Top Load",        brand: "Samsung", image: img.washingMachine,  price: "₹22,490", originalPrice: "₹30,990", discount: "27% Off", rating: 4.3, reviews: 214, bg: "#f0fff4" },
      { id: 3, name: "LG 7kg 5 Star Inverter Direct Drive Front Load",              brand: "LG",      image: img.washingMachine,  price: "₹34,990", originalPrice: "₹46,990", discount: "26% Off", rating: 4.4, reviews: 156, bg: "#fff0f5" },
      { id: 4, name: "Whirlpool 6.5kg 5 Star Fully Automatic Top Load",             brand: "Whirlpool",image: img.washingMachine, price: "₹16,990", originalPrice: "₹23,900", discount: "29% Off", rating: 4.1, reviews: 188, bg: "#f8f0ff" },
      { id: 5, name: "IFB 8kg 5 Star Fully Automatic Front Load Washing Machine",   brand: "IFB",     image: img.washingMachine,  price: "₹29,490", originalPrice: "₹39,990", discount: "26% Off", rating: 4.3, reviews: 92,  bg: "#fff8f0" },
      { id: 6, name: "Haier 8kg 5 Star Automatic Top Load Washing Machine",         brand: "Haier",   image: img.washingMachine,  price: "₹18,490", originalPrice: "₹26,000", discount: "29% Off", rating: 4.0, reviews: 74,  bg: "#f0f8ff" },
    ],
    editorial: {
      title: "Buy Washing Machines Online",
      intro: "Shop washing machines from top brands like Bosch, Samsung, LG, IFB, and Whirlpool. Choose from front load, top load, and semi-automatic models in a range of capacities and features.",
      sections: [
        { heading: "Front Load vs Top Load", body: "Front load washing machines offer superior cleaning, lower water usage, and gentler fabric care. Top load machines are easy to use, faster in cycle times, and generally more affordable. Both types are available with inverter technology for energy savings." },
        { heading: "Choosing the Right Capacity", body: "For a family of 2–3, a 6–7 kg machine is ideal. Families of 4–5 should consider 8–9 kg capacity. For larger households, 10 kg or higher models are recommended for efficient washing." },
      ],
    },
  },

  "Air Conditioners": {
    filters: [
      { label: "Type",        options: ["Split AC", "Window AC", "Portable AC", "Cassette AC"] },
      { label: "Capacity",    options: ["0.8 Ton", "1 Ton", "1.5 Ton", "2 Ton"] },
      { label: "Star Rating", options: ["3 Star", "4 Star", "5 Star"] },
      { label: "Technology",  options: ["Inverter", "Non-Inverter", "AI Cooling"] },
    ],
    products: [
      { id: 1, name: "LG 1.5 Ton 5 Star AI Dual Inverter Split AC",           brand: "LG",      image: img.airConditioner,    price: "₹34,990", originalPrice: "₹47,990", discount: "27% Off", rating: 4.5, reviews: 186, bg: "#f0f8ff" },
      { id: 2, name: "Samsung 1.5 Ton 5 Star WindFree Inverter Split AC",      brand: "Samsung", image: img.airConditionerRoom,price: "₹38,490", originalPrice: "₹51,990", discount: "26% Off", rating: 4.4, reviews: 124, bg: "#f0fff4" },
      { id: 3, name: "Daikin 1.5 Ton 5 Star Inverter Split Air Conditioner",   brand: "Daikin",  image: img.airConditioner,    price: "₹36,990", originalPrice: "₹49,990", discount: "26% Off", rating: 4.3, reviews: 98,  bg: "#fff0f5" },
      { id: 4, name: "Voltas 1.5 Ton 3 Star Inverter Split AC",                brand: "Voltas",  image: img.airConditionerRoom,price: "₹28,490", originalPrice: "₹39,990", discount: "29% Off", rating: 4.1, reviews: 276, bg: "#f8f0ff" },
      { id: 5, name: "Blue Star 1 Ton 5 Star Inverter Split AC",               brand: "Blue Star",image: img.airConditioner,   price: "₹29,990", originalPrice: "₹39,900", discount: "25% Off", rating: 4.2, reviews: 88,  bg: "#f0f4ff" },
      { id: 6, name: "Hitachi 2 Ton 3 Star Inverter Split Air Conditioner",    brand: "Hitachi", image: img.airConditionerRoom,price: "₹44,990", originalPrice: "₹59,900", discount: "25% Off", rating: 4.3, reviews: 56,  bg: "#fff8f0" },
    ],
    editorial: {
      title: "Buy Air Conditioners Online",
      intro: "Stay cool with the latest inverter split ACs from LG, Samsung, Daikin, Voltas, and more. Find energy-efficient models with 3–5 star ratings for every room size.",
      sections: [
        { heading: "Split AC vs Window AC", body: "Split ACs are more efficient, quieter, and suitable for most modern rooms. Window ACs are compact and cost-effective, ideal for smaller spaces. Cassette and portable ACs offer flexible installation options." },
        { heading: "Inverter vs Non-Inverter", body: "Inverter ACs adjust the compressor speed based on cooling needs, saving up to 50% energy compared to non-inverter models. They also deliver faster cooling and maintain a more consistent room temperature." },
      ],
    },
  },

  "Mobiles": {
    filters: [
      { label: "Brand",     options: ["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme", "Vivo"] },
      { label: "RAM",       options: ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB"] },
      { label: "Storage",   options: ["64 GB", "128 GB", "256 GB", "512 GB"] },
      { label: "Camera",    options: ["48 MP", "64 MP", "108 MP", "200 MP"] },
    ],
    products: [
      { id: 1, name: "Samsung Galaxy S25 Ultra 5G — 256GB, Titanium Black",   brand: "Samsung", image: img.galaxyPhones, price: "₹1,24,999",originalPrice: "₹1,44,999",discount: "14% Off", rating: 4.7, reviews: 340, bg: "#f0f4ff" },
      { id: 2, name: "Samsung Galaxy S25 5G — 128GB, Icy Blue",               brand: "Samsung", image: img.phoneBlue,   price: "₹79,999",  originalPrice: "₹89,999",  discount: "11% Off", rating: 4.5, reviews: 218, bg: "#f0f8ff" },
      { id: 3, name: "Samsung Galaxy A55 5G — 128GB, Awesome Navy",           brand: "Samsung", image: img.phoneBlue,   price: "₹34,999",  originalPrice: "₹39,999",  discount: "13% Off", rating: 4.3, reviews: 480, bg: "#fff0f5" },
      { id: 4, name: "Samsung Galaxy M35 5G — 128GB, Thunder Grey",           brand: "Samsung", image: img.galaxyPhones,price: "₹19,999",  originalPrice: "₹24,999",  discount: "20% Off", rating: 4.2, reviews: 620, bg: "#f8f0ff" },
      { id: 5, name: "Samsung Galaxy F55 5G — 256GB, Apricot Crush",          brand: "Samsung", image: img.phoneBlue,   price: "₹26,999",  originalPrice: "₹32,999",  discount: "18% Off", rating: 4.1, reviews: 196, bg: "#f0fff4" },
      { id: 6, name: "Samsung Galaxy Z Flip6 5G — 256GB, Mint",               brand: "Samsung", image: img.galaxyPhones,price: "₹99,999",  originalPrice: "₹1,09,999",discount: "9% Off",  rating: 4.4, reviews: 128, bg: "#fff8f0" },
    ],
    editorial: {
      title: "Buy Smartphones Online",
      intro: "Explore the latest smartphones from Samsung, Apple, OnePlus, Xiaomi, and more. Compare features, camera specs, battery life, and prices to find the perfect phone.",
      sections: [
        { heading: "5G Smartphones", body: "5G phones deliver significantly faster data speeds, lower latency, and better connectivity. They're ideal for gaming, streaming, and heavy data usage. Most flagship and mid-range phones now come with 5G support." },
        { heading: "Camera & Performance", body: "Modern smartphones feature multi-lens setups with up to 200MP resolution, OIS for video stability, and AI-enhanced photography. Processors like Snapdragon 8 Gen 3 and Dimensity 9300 ensure smooth multitasking and gaming." },
      ],
    },
  },

  "Laptops": {
    filters: [
      { label: "Brand",     options: ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer"] },
      { label: "Processor", options: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7"] },
      { label: "RAM",       options: ["8 GB", "16 GB", "32 GB"] },
      { label: "Storage",   options: ["256 GB SSD", "512 GB SSD", "1 TB SSD"] },
    ],
    products: [
      { id: 1, name: "HP 15s Intel Core i5 13th Gen Laptop — 16GB RAM, 512GB SSD",  brand: "HP",     image: img.laptop,      price: "₹57,990", originalPrice: "₹74,990", discount: "23% Off", rating: 4.4, reviews: 226, bg: "#f0f4ff" },
      { id: 2, name: "Dell Inspiron 15 Intel Core i7 13th Gen — 16GB, 512GB SSD",   brand: "Dell",   image: img.multiLaptops,price: "₹72,990", originalPrice: "₹92,990", discount: "22% Off", rating: 4.3, reviews: 148, bg: "#f0fff4" },
      { id: 3, name: "Lenovo IdeaPad Slim 5 AMD Ryzen 7 — 16GB RAM, 512GB SSD",     brand: "Lenovo", image: img.laptop,      price: "₹54,990", originalPrice: "₹69,990", discount: "21% Off", rating: 4.4, reviews: 198, bg: "#fff0f5" },
      { id: 4, name: "Asus VivoBook 15 Intel Core i5 — 8GB RAM, 512GB SSD",         brand: "Asus",   image: img.multiLaptops,price: "₹44,990", originalPrice: "₹57,990", discount: "22% Off", rating: 4.2, reviews: 312, bg: "#f8f0ff" },
      { id: 5, name: "Acer Aspire Lite AMD Ryzen 5 — 8GB RAM, 512GB SSD",            brand: "Acer",   image: img.laptop,      price: "₹36,990", originalPrice: "₹48,990", discount: "24% Off", rating: 4.1, reviews: 286, bg: "#f0f8ff" },
      { id: 6, name: "HP Pavilion 14 Intel Core i7 — 16GB RAM, 1TB SSD",             brand: "HP",     image: img.multiLaptops,price: "₹79,990", originalPrice: "₹99,990", discount: "20% Off", rating: 4.5, reviews: 94,  bg: "#fff8f0" },
    ],
    editorial: {
      title: "Buy Laptops Online",
      intro: "Shop laptops from HP, Dell, Lenovo, Asus, Acer, Apple, and more. Whether you need a laptop for work, study, gaming, or creative tasks, we have the right configuration at the right price.",
      sections: [
        { heading: "Intel vs AMD Processors", body: "Intel Core i5/i7 processors offer excellent single-core performance and compatibility, ideal for everyday productivity and light gaming. AMD Ryzen 5/7 processors deliver strong multi-core performance and better energy efficiency, making them great for multitasking and creative work." },
        { heading: "Choosing the Right Specs", body: "For everyday tasks — 8GB RAM and 256GB SSD is sufficient. For professional or creative work — go for 16GB RAM and 512GB SSD. Gaming laptops require dedicated GPUs. Always check display quality, battery life, and port selection before buying." },
      ],
    },
  },

  "Kitchen Appliances": {
    filters: [
      { label: "Type",       options: ["Air Fryer", "Microwave", "OTG", "Mixer Grinder", "Chimney", "Induction"] },
      { label: "Brand",      options: ["Philips", "Samsung", "LG", "Bajaj", "Prestige"] },
      { label: "Wattage",    options: ["500–1000W", "1000–1500W", "1500–2000W"] },
      { label: "Capacity",   options: ["2–4 L", "4–6 L", "6–10 L", "10 L+"] },
    ],
    products: [
      { id: 1, name: "Philips Viva 6.2L 1400W XXL Air Fryer with Rapid Air Technology",  brand: "Philips", image: img.airFryer,  price: "₹8,999",  originalPrice: "₹12,995", discount: "31% Off", rating: 4.5, reviews: 524, bg: "#f0f4ff" },
      { id: 2, name: "Samsung 28L Convection Microwave Oven with SlimFry",               brand: "Samsung", image: img.rangeHood, price: "₹14,990", originalPrice: "₹19,900", discount: "25% Off", rating: 4.3, reviews: 186, bg: "#f0fff4" },
      { id: 3, name: "Philips 4.1L Digital Air Fryer 1400W — Auto Shut Off",             brand: "Philips", image: img.airFryer,  price: "₹5,499",  originalPrice: "₹7,995",  discount: "31% Off", rating: 4.4, reviews: 730, bg: "#fff0f5" },
      { id: 4, name: "Elica 90cm 1200 m³/hr Auto-Clean Chimney — WDFL 904 HAC LTW",     brand: "Elica",   image: img.rangeHood, price: "₹12,490", originalPrice: "₹17,990", discount: "31% Off", rating: 4.2, reviews: 148, bg: "#f8f0ff" },
      { id: 5, name: "Bajaj 3L 2000W Vertical Pop Up Toaster + Sandwich Maker",          brand: "Bajaj",   image: img.airFryer,  price: "₹1,299",  originalPrice: "₹1,999",  discount: "35% Off", rating: 4.0, reviews: 890, bg: "#fff8f0" },
      { id: 6, name: "Prestige 750W Mixer Grinder 3 Stainless Steel Jars",               brand: "Prestige",image: img.rangeHood, price: "₹2,999",  originalPrice: "₹4,299",  discount: "30% Off", rating: 4.1, reviews: 640, bg: "#f0f8ff" },
    ],
    editorial: {
      title: "Buy Kitchen Appliances Online",
      intro: "Upgrade your kitchen with air fryers, microwave ovens, chimneys, mixer grinders, and more from Philips, Samsung, LG, Bajaj, Prestige, and other leading brands.",
      sections: [
        { heading: "Air Fryers — Healthy Cooking Made Easy", body: "Air fryers use rapid hot air circulation to cook food with up to 80% less oil, making them a healthier alternative to deep frying. They're versatile — use them to fry, bake, grill, and roast a variety of foods." },
        { heading: "Choosing the Right Kitchen Appliance", body: "Consider the cooking capacity, wattage, safety features, and ease of cleaning before purchasing. For a family of 4, a 6L air fryer or a 28L microwave oven is ideal. Look for appliances with auto-shutoff and overheating protection." },
      ],
    },
  },

  "Speakers & Media Players": {
    filters: [
      { label: "Type",        options: ["Bluetooth Speaker", "Smart Speaker", "Soundbar", "Home Theatre"] },
      { label: "Brand",       options: ["Amazon", "JBL", "Sony", "Bose", "Boat"] },
      { label: "Connectivity",options: ["Bluetooth", "Wi-Fi", "Wired", "Multi-Room"] },
      { label: "Voice Assist",options: ["Alexa", "Google Assistant", "Siri"] },
    ],
    products: [
      { id: 1, name: "Amazon Echo Dot (5th Gen) Smart Speaker with Alexa",          brand: "Amazon", image: img.echoDot,  price: "₹4,499",  originalPrice: "₹5,499",  discount: "18% Off", rating: 4.5, reviews: 1240, bg: "#f0f4ff" },
      { id: 2, name: "Amazon Echo (4th Gen) Premium Sound Smart Speaker with Alexa",brand: "Amazon", image: img.echoDot,  price: "₹9,999",  originalPrice: "₹11,999", discount: "17% Off", rating: 4.4, reviews: 680,  bg: "#f0fff4" },
      { id: 3, name: "JBL Charge 5 Portable Waterproof Bluetooth Speaker — 20hr",   brand: "JBL",    image: img.echoDot,  price: "₹13,999", originalPrice: "₹19,999", discount: "30% Off", rating: 4.6, reviews: 420,  bg: "#fff0f5" },
      { id: 4, name: "Sony SRS-XB33 Portable Wireless Bluetooth Speaker",           brand: "Sony",   image: img.echoDot,  price: "₹11,990", originalPrice: "₹17,990", discount: "33% Off", rating: 4.3, reviews: 316,  bg: "#f8f0ff" },
      { id: 5, name: "Amazon Echo Show 8 (2nd Gen) Smart Display with Alexa",       brand: "Amazon", image: img.echoDot,  price: "₹12,999", originalPrice: "₹14,999", discount: "13% Off", rating: 4.5, reviews: 280,  bg: "#fff8f0" },
      { id: 6, name: "boAt Aavante Bar 1160 2.0 Soundbar 100W RMS",                 brand: "boAt",   image: img.echoDot,  price: "₹3,999",  originalPrice: "₹8,990",  discount: "56% Off", rating: 4.1, reviews: 760,  bg: "#f0f8ff" },
    ],
    editorial: {
      title: "Buy Speakers & Media Players Online",
      intro: "Shop Bluetooth speakers, smart speakers, soundbars, and home theatre systems from Amazon, JBL, Sony, Bose, boAt, and more at Matru Kripa Enterprises.",
      sections: [
        { heading: "Smart Speakers vs Bluetooth Speakers", body: "Smart speakers like the Amazon Echo and Google Nest offer voice-control, smart home integration, and music streaming from the cloud. Bluetooth speakers are portable, no Wi-Fi needed, and ideal for outdoor use." },
        { heading: "Soundbars for Home Entertainment", body: "Soundbars deliver a significant audio upgrade over built-in TV speakers. Look for Dolby Atmos support for immersive sound, and multi-channel configurations (2.1, 5.1) for a cinematic experience." },
      ],
    },
  },
};
