export const RESTAURANT = {
  name: 'ÉTOILE ROYALE',
  tagline: 'Where Exceptional Taste Meets Royal Elegance.',
  address: '26 Rue Notre-Dame, L-2240 Luxembourg City',
  phone: '+352 27 86 44 10',
  email: 'concierge@etoileroyale.lu',
  dressCode:
    'Smart Elegant. Tailored evening attire is appreciated; sportswear and beachwear are politely declined.'
};

export const HOURS = [
  ['Tuesday to Friday', '18:00 – 23:30'],
  ['Saturday', '12:00 – 15:00 & 18:00 – 00:00'],
  ['Sunday', '18:00 – 22:30'],
  ['Monday', 'Closed for private cellar curation']
];

export const CATEGORIES = ['Signature Steaks', 'Signature Beverages', 'Royal Desserts', "Chef's Special"];

export const MENU_DATA = [
  {
    id: 'wagyu-ribeye', name: 'Japanese A5 Wagyu Ribeye', category: 'Signature Steaks', price: 95,
    weight: '280g', recommendedTemp: 'Medium-Rare (54°C)', provenance: 'Miyazaki Prefecture, Japan (BMS 11–12)',
    chefRecommended: true, glutenFree: true, tableIndex: 0, dishType: 'wagyu',
    description: 'Snowflake-marbled Miyazaki A5 ribeye seared over 850°C Kishu Binchotan charcoal, crowned with Normandy smoked herb butter, fresh rosemary, and Maldon sea salt flakes.',
    ingredients: ['Miyazaki A5 Ribeye (BMS 12)', 'Normandy Cultured Herb Butter', 'Kishu Binchotan Sear', 'Maldon Sea Salt', 'Fresh Garden Rosemary'],
    flavorProfile: 'Velvety, umami-rich, buttery melt',
    pairing: 'Royal Berry Sparkle (€14) or Grand Cru Pomerol', allergens: 'Dairy'
  },
  {
    id: 'royal-tomahawk', name: 'Royal Tomahawk Steak', category: 'Signature Steaks', price: 120,
    weight: '950g (for 1–2 guests)', recommendedTemp: 'Medium-Rare (55°C)', provenance: 'Black Angus Reserve, Scottish Highlands',
    chefRecommended: true, glutenFree: true, tableIndex: 1, dishType: 'tomahawk',
    description: 'Dramatic 14-inch Frenched rib steak aged 45 days in our Himalayan pink salt chamber, served tableside with roasted bone marrow, glazed heirloom carrots, and aged Bordelaise.',
    ingredients: ['45-Day Dry-Aged Ribeye on Bone', 'Roasted Bone Marrow', 'Heirloom Baby Carrots', 'Shallot Bordelaise Jus', 'Fresh Rosemary'],
    flavorProfile: 'Deep nutty crust, bold beef essence, smoky',
    pairing: 'Golden Passion (€12) or Left Bank Bordeaux', allergens: 'Dairy, Sulphites'
  },
  {
    id: 'classic-filet', name: 'Classic Filet Mignon', category: 'Signature Steaks', price: 68,
    weight: '240g', recommendedTemp: 'Medium-Rare (54°C)', provenance: 'Charolais Heritage Farms, France',
    chefRecommended: false, glutenFree: true, tableIndex: 2, dishType: 'filet',
    description: 'Center-cut Charolais beef tenderloin renowned for effortless tenderness, accompanied by silky pommes purée, charred cipollini onion, and green Kampot peppercorn cognac reduction.',
    ingredients: ['Center-Cut Charolais Tenderloin', 'Silky Pommes Purée', 'Green Kampot Peppercorn Jus', 'Charred Cipollini Onion', 'Thyme Infusion'],
    flavorProfile: 'Refined, silky tenderness, warm peppercorn',
    pairing: 'Lemon Royale (€10) or Burgundy Pinot Noir', allergens: 'Dairy, Sulphites'
  },
  {
    id: 'black-truffle-tenderloin', name: 'Black Truffle Tenderloin', category: 'Signature Steaks', price: 78,
    weight: '250g', recommendedTemp: 'Medium-Rare (54°C)', provenance: 'Limousin Reserve & Périgord Truffle',
    chefRecommended: true, glutenFree: true, tableIndex: 3, dishType: 'truffle',
    description: 'Prime tenderloin crowned with shaved Périgord black winter truffle, foie gras emulsion, wild morel jus, and a delicate whisper of 24-karat edible gold leaf.',
    ingredients: ['Limousin Beef Tenderloin', 'Périgord Black Winter Truffle', '24k Edible Gold Leaf', 'Wild Morel Reduction', 'Roasted Shallot Glaze'],
    flavorProfile: 'Earthy, aromatic, decadent forest notes',
    pairing: 'Emerald Matcha Latte (€11) or Aged Barolo', allergens: 'Dairy, Sulphites'
  },
  {
    id: 'royal-berry-sparkle', name: 'Royal Berry Sparkle', category: 'Signature Beverages', price: 14,
    weight: '220ml crystal goblet', recommendedTemp: 'Chilled (4°C)', provenance: 'Luxembourg Ardennes Berries & Crémant Essence',
    chefRecommended: false, glutenFree: true, tableIndex: 4, dishType: 'berry_drink',
    description: 'Effervescent ruby botanical aperitif crafted from crushed Ardennes blackberries, wild raspberries, hibiscus reduction, and dealcoholized Luxembourgish sparkling cuvée.',
    ingredients: ['Ardennes Blackberries & Raspberries', 'Hibiscus Petal Infusion', 'Botanical Sparkling Cuvée', 'Fresh Garden Mint', '24k Gold Rim Dust'],
    flavorProfile: 'Crisp, ruby tartness, floral effervescence',
    pairing: 'Palate cleanser with the Japanese A5 Wagyu Ribeye', allergens: 'None (alcohol-free)'
  },
  {
    id: 'golden-passion', name: 'Golden Passion', category: 'Signature Beverages', price: 12,
    weight: '240ml coupe', recommendedTemp: 'Chilled (5°C)', provenance: 'Madagascar Vanilla & Exotic Passionfruit',
    chefRecommended: false, glutenFree: true, tableIndex: null, dishType: 'drink',
    description: 'Sunlit passionfruit nectar shaken with Madagascar bourbon vanilla bean, cold-pressed Meyer lemon, ginger blossom mist, and shimmering champagne-gold dust.',
    ingredients: ['Fresh Passionfruit Pulp', 'Madagascar Vanilla Bean', 'Meyer Lemon Juice', 'Ginger Blossom Mist', 'Sparkling Spring Water'],
    flavorProfile: 'Vibrant tropical acid, warm vanilla finish',
    pairing: 'Complements the Royal Tomahawk Steak and Crème Brûlée', allergens: 'None (alcohol-free)'
  },
  {
    id: 'emerald-matcha-latte', name: 'Emerald Matcha Latte', category: 'Signature Beverages', price: 11,
    weight: '200ml porcelain vessel', recommendedTemp: 'Velvet warm (62°C) or iced', provenance: 'Uji, Kyoto, Japan',
    chefRecommended: false, glutenFree: true, tableIndex: null, dishType: 'drink',
    description: 'Stone-ground first-harvest Uji ceremonial matcha whisked to micro-foam perfection with organic oat or Hokkaido milk and a touch of white acacia honey.',
    ingredients: ['Uji Ceremonial Grade Matcha', 'Organic Oat or Hokkaido Milk', 'Luxembourg Acacia Honey', 'Bamboo Chasen Micro-Foam'],
    flavorProfile: 'Silky umami, vegetal sweetness, calm finish',
    pairing: 'Pairs with the Raspberry Pistachio Royale', allergens: 'Optional dairy (oat available)'
  },
  {
    id: 'lemon-royale', name: 'Lemon Royale', category: 'Signature Beverages', price: 10,
    weight: '250ml highball', recommendedTemp: 'Ice-chilled (3°C)', provenance: 'Amalfi Coast Lemons & Moselle Thyme',
    chefRecommended: false, glutenFree: true, tableIndex: null, dishType: 'drink',
    description: 'Hand-pressed Amalfi lemon elixir infused with wild Moselle lemon thyme, white verbena cordial, and crystal-clear artisanal tonic.',
    ingredients: ['Amalfi Coast Lemon Zest & Juice', 'Moselle Lemon Thyme', 'White Verbena Cordial', 'Artisanal Botanical Tonic'],
    flavorProfile: 'Zesty citrus, herbaceous, refreshingly dry',
    pairing: 'Classic accompaniment to the Classic Filet Mignon', allergens: 'None (alcohol-free)'
  },
  {
    id: 'midnight-chocolate-fondant', name: 'Midnight Chocolate Fondant', category: 'Royal Desserts', price: 18,
    weight: '190g, baked to order', recommendedTemp: 'Warm molten core', provenance: 'Valrhona Guanaja & Madagascar Vanilla',
    chefRecommended: true, glutenFree: false, tableIndex: 5, dishType: 'fondant',
    description: 'Warm dark Valrhona 72% chocolate cake revealing a molten velvet ganache core, paired with Madagascar vanilla bean gelato, raspberry coulis, and 24k gold leaf.',
    ingredients: ['Valrhona Guanaja 72% Dark Chocolate', 'Madagascar Vanilla Bean Gelato', 'Fresh Raspberry Coulis', 'Cocoa Nib Tuile', '24k Edible Gold Leaf'],
    flavorProfile: 'Intense bittersweet cocoa, warm and cold contrast',
    pairing: 'Emerald Matcha Latte (€11) or Vintage Tawny Port', allergens: 'Dairy, Eggs, Gluten'
  },
  {
    id: 'parisian-creme-brulee', name: 'Parisian Crème Brûlée', category: 'Royal Desserts', price: 15,
    weight: '180g porcelain dish', recommendedTemp: 'Caramelized crust, chilled custard', provenance: 'Tahitian Vanilla & Normandy Cream',
    chefRecommended: false, glutenFree: true, tableIndex: null, dishType: 'brulee',
    description: 'Silky double-vanilla bean custard infused with Tahitian and Bourbon vanilla pods, torched tableside to a glass-like amber demerara sugar crust with fresh berries.',
    ingredients: ['Normandy Double Cream', 'Tahitian & Bourbon Vanilla Pods', 'Free-Range Organic Egg Yolks', 'Torched Amber Demerara Crust'],
    flavorProfile: 'Caramelized crunch, floral vanilla custard',
    pairing: 'Golden Passion (€12) or Sauternes', allergens: 'Dairy, Eggs'
  },
  {
    id: 'raspberry-pistachio-royale', name: 'Raspberry Pistachio Royale', category: 'Royal Desserts', price: 17,
    weight: '175g entremet', recommendedTemp: 'Chilled (6°C)', provenance: 'Bronte DOP Pistachios & Ardennes Raspberries',
    chefRecommended: false, glutenFree: false, tableIndex: 6, dishType: 'pistachio',
    description: 'Velvety Sicilian Bronte pistachio mousseline layered over crisp almond dacquoise, bright raspberry confit heart, glazed with emerald mirror sheen and gold leaf.',
    ingredients: ['Sicilian Bronte DOP Pistachio Paste', 'Ardennes Raspberry Confit', 'Almond Dacquoise Sponge', 'White Chocolate Velvet', '24k Gold Leaf'],
    flavorProfile: 'Roasted nutty depth, bright berry tartness',
    pairing: 'Royal Berry Sparkle (€14)', allergens: 'Tree nuts (pistachio, almond), Dairy, Eggs'
  },
  {
    id: 'golden-mille-feuille', name: 'Golden Mille-Feuille', category: 'Royal Desserts', price: 16,
    weight: '170g layered pastry', recommendedTemp: 'Crisp and chilled', provenance: 'Isigny Butter Puff & Diplomat Cream',
    chefRecommended: false, glutenFree: false, tableIndex: null, dishType: 'dessert',
    description: 'A thousand caramelized layers of Isigny butter puff pastry interleaved with airy vanilla-tonka diplomat cream and salted butterscotch drizzle.',
    ingredients: ['Caramelized Isigny Puff Pastry', 'Vanilla-Tonka Diplomat Cream', 'Salted Normandy Butterscotch', 'Toasted Hazelnut Praline'],
    flavorProfile: 'Shattering crisp pastry, aromatic tonka cream',
    pairing: 'Lemon Royale (€10) or Espresso', allergens: 'Gluten, Dairy, Eggs, Tree nuts'
  },
  {
    id: 'the-royal-experience', name: 'The Royal Experience', category: "Chef's Special", price: 145,
    weight: '5-course tasting, per person', recommendedTemp: 'Orchestrated service', provenance: 'Curated by Executive Chef Laurent Beaumont',
    chefRecommended: true, glutenFree: false, tableIndex: 7, dishType: 'royal_experience',
    description: 'Our flagship five-course degustation: Complimentary Chef’s Amuse-Bouche, Japanese Wagyu tasting portion, Parmesan Truffle Risotto, Royal Berry Sparkle, and Midnight Chocolate Fondant.',
    ingredients: ["Complimentary Chef's Amuse-Bouche", 'Japanese Wagyu Tasting Portion', 'Parmesan Truffle Risotto', 'Royal Berry Sparkle', 'Midnight Chocolate Fondant'],
    flavorProfile: 'A complete five-course progression',
    pairing: 'Includes Royal Berry Sparkle; optional sommelier flight (+€65)',
    allergens: 'Dairy, Eggs, Gluten (vegetarian risotto adaptation available)'
  }
];

export const TABLE_DISHES = MENU_DATA.filter((d) => d.tableIndex !== null).sort((a, b) => a.tableIndex - b.tableIndex);

export const FAQ_ITEMS = [
  {
    q: 'Do you offer vegetarian or allergy-friendly options?',
    a: 'Yes. Executive Chef Laurent Beaumont prepares an Aged Parmesan & Périgord Black Truffle Risotto for vegetarian guests on request. The four Signature Steaks and the Signature Beverages are naturally gluten-free. Please list any allergy in your reservation notes.'
  },
  {
    q: 'What is the dress code?',
    a: 'Smart Elegant. Tailored trousers, collared shirts, blazers and evening attire are welcome; athletic wear and beachwear are politely declined.'
  },
  {
    q: 'How do we book the Salon Privé Royal for 8 to 16 guests?',
    a: 'Choose “Salon Privé Royal” in the reservation form below, or ask the concierge to help plan a custom menu with dedicated sommelier service.'
  },
  {
    q: 'When are you open?',
    a: 'Tuesday to Friday 18:00–23:30, Saturday 12:00–15:00 and 18:00–00:00, Sunday 18:00–22:30. Closed on Mondays.'
  }
];
