/* =====================================================================
   CloudSupply Co — Data Layer
   js/data.js
   -  WA          : WhatsApp number (edit once, reflects everywhere)
   -  products    : Full product catalogue
   -  categories  : Category definitions shown on home page
   ===================================================================== */

'use strict';

/* ── WhatsApp contact number ──────────────────────────────────────── */
const WA = '923001234567';

/* ── Product Catalogue ────────────────────────────────────────────── */
/*
  Schema per product:
  {
    id         : number   — unique identifier
    name       : string   — display name
    cat        : string   — must match a category.name
    emoji      : string   — fallback emoji
    image      : string   — path to product image
    price      : number   — retail price in PKR
    bulkPrice  : number   — wholesale price in PKR
    moq        : number   — minimum order quantity for bulk
    desc       : string   — short product description
    flavors    : string[] — available flavour options
    badges     : string[] — one or more of: 'new' | 'hot' | 'best' | 'sale'
    flavorType : string   — filter group: 'Fruity Ice'|'Dessert'
    isNew      : boolean  — shown in "New Arrivals" section
    isBest     : boolean  — shown in "Best Sellers" section
  }
*/
const products = [

  /* ─────────────────────────────────────────────────────────────────
     1.  PINEAPPLE SERIES  ·  Nicotine Strength: 50 MG
     ───────────────────────────────────────────────────────────────── */
  {
    id: 1,
    name: 'Pineapple Ice',
    cat: 'Pineapple Series',
    emoji: '🍍',
    image: 'assets/products/pineapple-ice.jpeg',
    price: 2800,
    bulkPrice: 2200,
    moq: 10,
    desc: 'Crisp pineapple blended with an icy menthol exhale. 50 MG nicotine strength for a bold, satisfying hit.',
    flavors: ['Pineapple Ice'],
    badges: ['hot'],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: true,
  },
  {
    id: 2,
    name: 'Pineapple Red Apple Ice',
    cat: 'Pineapple Series',
    emoji: '🍎',
    image: 'assets/products/pineapple-red-apple-ice.jpeg',
    price: 2800,
    bulkPrice: 2200,
    moq: 10,
    desc: 'Sweet red apple meets tropical pineapple on a frosty ice finish. 50 MG nicotine strength.',
    flavors: ['Pineapple Red Apple Ice'],
    badges: ['best'],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: true,
  },
  {
    id: 3,
    name: 'Pineapple Mango Orange Ice',
    cat: 'Pineapple Series',
    emoji: '🥭',
    image: 'assets/products/pineapple-mango-orange-ice.jpeg',
    price: 2800,
    bulkPrice: 2200,
    moq: 10,
    desc: 'A vibrant tropical trio — pineapple, mango & orange layered with cool ice. 50 MG nicotine strength.',
    flavors: ['Pineapple Mango Orange Ice'],
    badges: ['new', 'hot'],
    flavorType: 'Fruity Ice',
    isNew: true,
    isBest: false,
  },
  {
    id: 4,
    name: 'Pineapple Passion Fruit Ice',
    cat: 'Pineapple Series',
    emoji: '🌺',
    image: 'assets/products/pineapple-passion-fruit-ice.jpeg',
    price: 2800,
    bulkPrice: 2200,
    moq: 10,
    desc: 'Tangy passion fruit infused with juicy pineapple and a cool menthol breeze. 50 MG nicotine strength.',
    flavors: ['Pineapple Passion Fruit Ice'],
    badges: ['new'],
    flavorType: 'Fruity Ice',
    isNew: true,
    isBest: false,
  },
  {
    id: 5,
    name: 'Pineapple Lychee Ice',
    cat: 'Pineapple Series',
    emoji: '🧊',
    image: 'assets/products/pineapple-lychee-ice.jpeg',
    price: 2800,
    bulkPrice: 2200,
    moq: 10,
    desc: 'Exotic lychee paired with tropical pineapple and a refreshing icy finish. 50 MG nicotine strength.',
    flavors: ['Pineapple Lychee Ice'],
    badges: ['best'],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: true,
  },

  /* ─────────────────────────────────────────────────────────────────
     2.  KRUSH  (ICE SERIES)  ·  Nicotine Strength: 30 MG
     ───────────────────────────────────────────────────────────────── */
  {
    id: 6,
    name: 'Triple Melon Ice',
    cat: 'Krush (Ice Series)',
    emoji: '🍈',
    image: 'assets/products/triple-melon-ice.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'Three layers of melon — watermelon, honeydew & cantaloupe — crushed over ice. 30 MG nicotine strength.',
    flavors: ['Triple Melon Ice'],
    badges: ['hot'],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: true,
  },
  {
    id: 7,
    name: 'Triple Grape Ice',
    cat: 'Krush (Ice Series)',
    emoji: '🍇',
    image: 'assets/products/triple-grape-ice.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'A bold blend of three grape varieties — red, purple & green — finished with a frosty kick. 30 MG nicotine strength.',
    flavors: ['Triple Grape Ice'],
    badges: ['best'],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: true,
  },
  {
    id: 8,
    name: 'Lychee Dragon Fruit Lime Ice',
    cat: 'Krush (Ice Series)',
    emoji: '🐉',
    image: 'assets/products/lychee-dragon-fruit-lime-ice.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'An exotic fusion of lychee, dragon fruit and zesty lime with a chilled menthol exhale. 30 MG nicotine strength.',
    flavors: ['Lychee Dragon Fruit Lime Ice'],
    badges: ['new', 'hot'],
    flavorType: 'Fruity Ice',
    isNew: true,
    isBest: false,
  },
  {
    id: 9,
    name: 'Double Apple Ice',
    cat: 'Krush (Ice Series)',
    emoji: '🍏',
    image: 'assets/products/double-apple-ice.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'Classic double apple — red and green — with a smooth ice undertone. 30 MG nicotine strength.',
    flavors: ['Double Apple Ice'],
    badges: [],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: false,
  },
  {
    id: 10,
    name: 'Pina Colada Ice',
    cat: 'Krush (Ice Series)',
    emoji: '🍹',
    image: 'assets/products/pina-colada-ice.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'Creamy coconut meets ripe pineapple in a tropical cocktail blend, cooled with ice. 30 MG nicotine strength.',
    flavors: ['Pina Colada Ice'],
    badges: ['new'],
    flavorType: 'Fruity Ice',
    isNew: true,
    isBest: false,
  },
  {
    id: 18,
    name: 'Blackcurrant Ice',
    cat: 'Krush (Ice Series)',
    emoji: '🫐',
    image: 'assets/products/blackcurrant-ice.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'Deep, rich blackcurrant flavour with a sharp icy blast. 30 MG nicotine strength.',
    flavors: ['Blackcurrant Ice'],
    badges: ['hot'],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: false,
  },
  {
    id: 19,
    name: 'Blackcurrant Mango Ice',
    cat: 'Krush (Ice Series)',
    emoji: '🥭',
    image: 'assets/products/blackcurrant-mango-ice.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'Exotic mango paired with tart blackcurrants and a cool finish. 30 MG nicotine strength.',
    flavors: ['Blackcurrant Mango Ice'],
    badges: ['new'],
    flavorType: 'Fruity Ice',
    isNew: true,
    isBest: false,
  },
  {
    id: 20,
    name: 'Strawberry Guava Peach Ice',
    cat: 'Krush (Ice Series)',
    emoji: '🍑',
    image: 'assets/products/strawberry-guava-peach-ice.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'A sun-kissed blend of strawberry, guava, and peach with a refreshing icy exhale. 30 MG nicotine strength.',
    flavors: ['Strawberry Guava Peach Ice'],
    badges: ['best'],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: true,
  },
  {
    id: 21,
    name: 'Spear Mint',
    cat: 'Krush (Ice Series)',
    emoji: '🌿',
    image: 'assets/products/spear-mint.jpeg',
    price: 2500,
    bulkPrice: 1950,
    moq: 10,
    desc: 'Crisp, clean spearmint for a purely refreshing and cooling vape. 30 MG nicotine strength.',
    flavors: ['Spear Mint'],
    badges: [],
    flavorType: 'Fruity Ice',
    isNew: false,
    isBest: false,
  },

  /* ─────────────────────────────────────────────────────────────────
     3.  CREATIONS  (DESSERT SERIES)  ·  Nicotine Strength: 35 MG
     ───────────────────────────────────────────────────────────────── */
  {
    id: 13,
    name: 'Vanilla Custard',
    cat: 'Creations (Dessert Series)',
    emoji: '🍮',
    image: 'assets/products/vanilla-custard.jpeg',
    price: 2600,
    bulkPrice: 2050,
    moq: 10,
    desc: 'Rich, velvety vanilla custard — warm, creamy, and utterly indulgent. 35 MG nicotine strength.',
    flavors: ['Vanilla Custard'],
    badges: ['best'],
    flavorType: 'Dessert',
    isNew: false,
    isBest: true,
  },
  {
    id: 14,
    name: 'Salted Caramel',
    cat: 'Creations (Dessert Series)',
    emoji: '🍯',
    image: 'assets/products/salted-caramel.jpeg',
    price: 2600,
    bulkPrice: 2050,
    moq: 10,
    desc: 'Buttery caramel with a pinch of sea salt — a decadent dessert experience. 35 MG nicotine strength.',
    flavors: ['Salted Caramel'],
    badges: ['hot'],
    flavorType: 'Dessert',
    isNew: false,
    isBest: false,
  },
  {
    id: 15,
    name: 'Strawberry Milkshake',
    cat: 'Creations (Dessert Series)',
    emoji: '🍓',
    image: 'assets/products/strawberry-milkshake.jpeg',
    price: 2600,
    bulkPrice: 2050,
    moq: 10,
    desc: 'Sweet strawberries blended into a thick, creamy milkshake. Smooth and satisfying. 35 MG nicotine strength.',
    flavors: ['Strawberry Milkshake'],
    badges: ['new', 'hot'],
    flavorType: 'Dessert',
    isNew: true,
    isBest: false,
  },
  {
    id: 16,
    name: 'Lemon Pound Cake',
    cat: 'Creations (Dessert Series)',
    emoji: '🍋',
    image: 'assets/products/lemon-pound-cake.jpeg',
    price: 2600,
    bulkPrice: 2050,
    moq: 10,
    desc: 'Zesty lemon drizzled over freshly baked pound cake — bright and bakery-fresh. 35 MG nicotine strength.',
    flavors: ['Lemon Pound Cake'],
    badges: ['new'],
    flavorType: 'Dessert',
    isNew: true,
    isBest: false,
  },
  {
    id: 17,
    name: 'Lotus Cheesecake',
    cat: 'Creations (Dessert Series)',
    emoji: '🧁',
    image: 'assets/products/lotus-cheesecake.jpeg',
    price: 2600,
    bulkPrice: 2050,
    moq: 10,
    desc: 'Smooth cheesecake layered with caramelised Lotus Biscoff — an irresistible dessert vape. 35 MG nicotine strength.',
    flavors: ['Lotus Cheesecake'],
    badges: ['best'],
    flavorType: 'Dessert',
    isNew: false,
    isBest: true,
  },
];

/* ── Category Definitions ─────────────────────────────────────────── */
/*
  Schema:
  {
    name : string — must match product.cat values
    icon : string — emoji icon
    desc : string — short subtitle shown on category card
  }
*/
const categories = [
  { name: 'Pineapple Series',          icon: '🍍', desc: '50 MG · Tropical pineapple blends on ice'     },
  { name: 'Krush (Ice Series)',         icon: '❄️', desc: '30 MG · Bold fruity flavours crushed on ice'   },
  { name: 'Creations (Dessert Series)', icon: '🍰', desc: '35 MG · Rich, indulgent dessert-inspired vapes' },
];
