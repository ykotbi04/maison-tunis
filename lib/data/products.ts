// MAISON TUNIS - Product Database with Complete Details

export interface Product {
  id: string
  name: string
  category: string
  categorySlug: string
  price: number // in TND
  description: string
  longDescription: string
  image: string
  images: string[]
  color: string
  colors: string[]
  size: string
  sizes: string[]
  material: string
  care: string
  inStock: boolean
  isNew: boolean
  isLimited: boolean
  limitedQty?: number
  rating: number
  reviews: number
  sku: string
  heritage?: string // story/cultural significance
}

export interface Category {
  slug: string
  name: string
  description: string
  image: string
}

export const categories: Category[] = [
  {
    slug: 'evening-wear',
    name: 'Evening Wear',
    description: 'Sophisticated pieces for special occasions and elegant evenings',
    image: '/images/categories/evening-wear.png',
  },
  {
    slug: 'day-wear',
    name: 'Day Wear',
    description: 'Comfortable yet refined pieces for everyday elegance',
    image: '/images/categories/day-wear.png',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Premium accessories to complete your wardrobe',
    image: '/images/categories/accessories.png',
  },
  {
    slug: 'heritage',
    name: 'Heritage Collection',
    description: 'Traditional designs honoring Tunisian artistry',
    image: '/images/categories/heritage.png',
  },
  {
    slug: 'limited-edition',
    name: 'Limited Edition',
    description: 'Exclusive, numbered pieces from our most prestigious collections',
    image: '/images/categories/limited-edition.png',
  },
]

export const products: Product[] = [
  // Evening Wear
  {
    id: 'eve-001',
    name: 'Silk Evening Gown - Midnight Rose',
    category: 'Evening Wear',
    categorySlug: 'evening-wear',
    price: 2500,
    description: 'Luxurious silk evening gown with hand-embroidered details',
    longDescription:
      'An exquisite evening gown crafted from premium mulberry silk with delicate hand-embroidered rose motifs inspired by Tunisian traditional patterns. The flowing silhouette features a subtle train and is finished with subtle gold threading throughout. Perfect for formal galas and special celebrations.',
    image: '/images/products/evening-gown-1.png',
    images: [
      '/images/products/evening-gown-1.png',
      '/images/products/evening-gown-1-alt.png',
    ],
    color: 'Midnight Rose',
    colors: ['Midnight Rose', 'Gold', 'Sapphire'],
    size: 'M',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: '100% Mulberry Silk, Hand-embroidered with 22k Gold thread',
    care: 'Dry clean only. Store in breathable garment bag.',
    inStock: true,
    isNew: true,
    isLimited: false,
    rating: 4.8,
    reviews: 12,
    sku: 'EVE-001-MR-M',
  },
  {
    id: 'eve-002',
    name: 'Beaded Evening Jacket',
    category: 'Evening Wear',
    categorySlug: 'evening-wear',
    price: 1850,
    description: 'Elegant beaded jacket with traditional Tunisian patterns',
    longDescription:
      'A sophisticated evening jacket featuring intricate beadwork inspired by traditional Tunisian embroidery. Each piece is hand-beaded by our artisans using premium crystal beads. Versatile enough to pair with evening gowns or tailored trousers.',
    image: '/images/products/evening-jacket-1.png',
    images: [
      '/images/products/evening-jacket-1.png',
      '/images/products/evening-jacket-1-alt.png',
    ],
    color: 'Champagne',
    colors: ['Champagne', 'Midnight Navy', 'Bronze'],
    size: 'S',
    sizes: ['XS', 'S', 'M', 'L'],
    material: 'Silk blend, Hand-beaded with crystal and pearl beads',
    care: 'Spot clean. Professional dry cleaning recommended.',
    inStock: true,
    isNew: false,
    isLimited: false,
    rating: 4.9,
    reviews: 8,
    sku: 'EVE-002-CP-S',
  },
  {
    id: 'eve-003',
    name: 'Draped Evening Kaftan',
    category: 'Evening Wear',
    categorySlug: 'evening-wear',
    price: 1650,
    description: 'Flowing kaftan with graceful draping and subtle embellishments',
    longDescription:
      'A timeless piece that merges traditional Tunisian design with contemporary elegance. This flowing kaftan features expertly draped silk panels and is adorned with subtle embroidery along the neckline. The generous silhouette ensures comfort while maintaining sophistication.',
    image: '/images/products/kaftan-evening-1.png',
    images: [
      '/images/products/kaftan-evening-1.png',
      '/images/products/kaftan-evening-1-alt.png',
    ],
    color: 'Cream',
    colors: ['Cream', 'Terracotta', 'Deep Teal'],
    size: 'L',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: '100% Silk Crepe',
    care: 'Gentle hand wash or dry clean.',
    inStock: true,
    isNew: true,
    isLimited: false,
    rating: 4.7,
    reviews: 15,
    sku: 'EVE-003-CR-L',
  },

  // Day Wear
  {
    id: 'day-001',
    name: 'Linen Tunic Dress',
    category: 'Day Wear',
    categorySlug: 'day-wear',
    price: 850,
    description: 'Comfortable linen tunic with traditional design',
    longDescription:
      'Perfect for warm days, this lightweight linen tunic features a traditional Tunisian cut with subtle geometric embroidery. The breathable fabric and relaxed fit make it ideal for casual outings or beach destinations. Pair with sandals for effortless elegance.',
    image: '/images/products/tunic-dress-1.png',
    images: [
      '/images/products/tunic-dress-1.png',
      '/images/products/tunic-dress-1-alt.png',
    ],
    color: 'Natural Beige',
    colors: ['Natural Beige', 'Sage Green', 'Rust'],
    size: 'M',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: '100% Pure Linen',
    care: 'Machine wash cool. Lay flat to dry.',
    inStock: true,
    isNew: false,
    isLimited: false,
    rating: 4.6,
    reviews: 22,
    sku: 'DAY-001-NB-M',
  },
  {
    id: 'day-002',
    name: 'Embroidered Linen Blouse',
    category: 'Day Wear',
    categorySlug: 'day-wear',
    price: 650,
    description: 'Crisp linen blouse with hand-embroidered neckline',
    longDescription:
      'A versatile piece featuring a crisp linen construction with delicate hand-embroidered details on the neckline and cuffs. The clean lines and classic button-front design make it perfect for layering or wearing alone. An essential wardrobe staple.',
    image: '/images/products/linen-blouse-1.png',
    images: [
      '/images/products/linen-blouse-1.png',
      '/images/products/linen-blouse-1-alt.png',
    ],
    color: 'White',
    colors: ['White', 'Cream', 'Light Blue'],
    size: 'S',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: '100% Linen, Hand-embroidered cotton details',
    care: 'Machine wash warm. Warm iron for crisp finish.',
    inStock: true,
    isNew: true,
    isLimited: false,
    rating: 4.8,
    reviews: 18,
    sku: 'DAY-002-WH-S',
  },
  {
    id: 'day-003',
    name: 'Tailored Trousers - Terracotta',
    category: 'Day Wear',
    categorySlug: 'day-wear',
    price: 750,
    description: 'Perfectly tailored trousers in warm earth tones',
    longDescription:
      'These tailored trousers are cut from premium cotton-blend fabric in sophisticated earth tones. The high-waisted, ankle-length cut is designed to flatter all body types. Pair with the embroidered blouse for a complete look.',
    image: '/images/products/trousers-terracotta-1.png',
    images: [
      '/images/products/trousers-terracotta-1.png',
      '/images/products/trousers-terracotta-1-alt.png',
    ],
    color: 'Terracotta',
    colors: ['Terracotta', 'Charcoal', 'Cream'],
    size: 'M',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: '82% Cotton, 15% Linen, 3% Elastane',
    care: 'Machine wash cold. Warm iron as needed.',
    inStock: true,
    isNew: false,
    isLimited: false,
    rating: 4.7,
    reviews: 11,
    sku: 'DAY-003-TR-M',
  },

  // Accessories
  {
    id: 'acc-001',
    name: 'Silk Scarf - Geometric Patterns',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 350,
    description: 'Hand-dyed silk scarf with geometric Tunisian motifs',
    longDescription:
      'A luxurious silk scarf featuring traditional Tunisian geometric patterns, hand-dyed by artisans using natural dyes. The versatile size and colors make it perfect for multiple styling options. A timeless accessory that complements any outfit.',
    image: '/images/products/scarf-geometric-1.png',
    images: [
      '/images/products/scarf-geometric-1.png',
      '/images/products/scarf-geometric-1-alt.png',
    ],
    color: 'Indigo & Gold',
    colors: ['Indigo & Gold', 'Rust & Cream', 'Terracotta & Sage'],
    size: 'One Size',
    sizes: ['One Size'],
    material: '100% Mulberry Silk, Natural dyes',
    care: 'Gentle hand wash. Air dry.',
    inStock: true,
    isNew: true,
    isLimited: false,
    rating: 4.9,
    reviews: 24,
    sku: 'ACC-001-IG-OS',
  },
  {
    id: 'acc-002',
    name: 'Leather Tote Bag',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 950,
    description: 'Premium leather bag with traditional tooling',
    longDescription:
      'A sophisticated tote bag handcrafted from premium tanned leather. Each bag features unique tooling inspired by traditional Tunisian leatherwork. Perfect for everyday use or special occasions.',
    image: '/images/products/tote-bag-1.png',
    images: [
      '/images/products/tote-bag-1.png',
      '/images/products/tote-bag-1-alt.png',
    ],
    color: 'Cognac Brown',
    colors: ['Cognac Brown', 'Black', 'Cream'],
    size: 'Large',
    sizes: ['Large'],
    material: 'Premium tanned leather',
    care: 'Wipe clean with soft cloth. Condition annually.',
    inStock: true,
    isNew: false,
    isLimited: false,
    rating: 4.8,
    reviews: 16,
    sku: 'ACC-002-CB-L',
  },
  {
    id: 'acc-003',
    name: 'Embroidered Belt',
    category: 'Accessories',
    categorySlug: 'accessories',
    price: 280,
    description: 'Traditional belt with intricate hand-embroidery',
    longDescription:
      'A beautiful belt featuring intricate hand-embroidery inspired by traditional Tunisian patterns. The adjustable length and quality construction make it a versatile addition to any wardrobe.',
    image: '/images/products/embroidered-belt-1.png',
    images: [
      '/images/products/embroidered-belt-1.png',
      '/images/products/embroidered-belt-1-alt.png',
    ],
    color: 'Gold & Cream',
    colors: ['Gold & Cream', 'Silver & Navy'],
    size: 'One Size (Adjustable)',
    sizes: ['One Size (Adjustable)'],
    material: 'Silk with hand-embroidery, Brass buckle',
    care: 'Spot clean only.',
    inStock: true,
    isNew: true,
    isLimited: false,
    rating: 4.7,
    reviews: 9,
    sku: 'ACC-003-GC-OS',
  },

  // Heritage Collection
  {
    id: 'her-001',
    name: 'Traditional Dhoti Dress',
    category: 'Heritage Collection',
    categorySlug: 'heritage',
    price: 1200,
    description: 'Authentic traditional dress with cultural significance',
    longDescription:
      'This piece honors the rich traditions of Tunisian dress-making. The dhoti-inspired design features traditional weaving patterns and is hand-finished by our master artisans. A celebration of North African heritage and craftsmanship.',
    image: '/images/products/dhoti-dress-1.png',
    images: [
      '/images/products/dhoti-dress-1.png',
      '/images/products/dhoti-dress-1-alt.png',
    ],
    color: 'Royal Blue',
    colors: ['Royal Blue', 'Deep Red', 'Forest Green'],
    size: 'M',
    sizes: ['S', 'M', 'L'],
    material: 'Cotton with silk accents, hand-woven',
    care: 'Dry clean recommended.',
    inStock: true,
    isNew: false,
    isLimited: false,
    rating: 4.9,
    reviews: 7,
    sku: 'HER-001-RB-M',
    heritage: 'Inspired by traditional Tunisian wedding dresses',
  },
  {
    id: 'her-002',
    name: 'Woven Wall Hanging',
    category: 'Heritage Collection',
    categorySlug: 'heritage',
    price: 580,
    description: 'Handwoven textile art with traditional patterns',
    longDescription:
      'A beautiful woven textile featuring traditional Tunisian motifs. Each piece is individually handwoven on traditional looms by local artisans. A stunning home accessory that tells a story.',
    image: '/images/products/wall-hanging-1.png',
    images: [
      '/images/products/wall-hanging-1.png',
      '/images/products/wall-hanging-1-alt.png',
    ],
    color: 'Multi-color',
    colors: ['Multi-color'],
    size: 'Large',
    sizes: ['Large'],
    material: '100% Natural fibers, hand-woven',
    care: 'Dust regularly. Avoid direct sunlight.',
    inStock: true,
    isNew: true,
    isLimited: true,
    limitedQty: 5,
    rating: 5,
    reviews: 3,
    sku: 'HER-002-MC-L',
    heritage: 'Made using traditional looms from Sfax',
  },
  {
    id: 'her-003',
    name: 'Embroidered Shoulder Shawl',
    category: 'Heritage Collection',
    categorySlug: 'heritage',
    price: 420,
    description: 'Traditional shawl with authentic Tunisian embroidery',
    longDescription:
      'A classic shoulder shawl featuring authentic Tunisian embroidery patterns passed down through generations. Perfect for layering or wearing as a statement piece.',
    image: '/images/products/shoulder-shawl-1.png',
    images: [
      '/images/products/shoulder-shawl-1.png',
      '/images/products/shoulder-shawl-1-alt.png',
    ],
    color: 'Rust & Gold',
    colors: ['Rust & Gold', 'Navy & Silver'],
    size: 'One Size',
    sizes: ['One Size'],
    material: 'Cotton, hand-embroidered silk details',
    care: 'Gentle hand wash.',
    inStock: true,
    isNew: false,
    isLimited: false,
    rating: 4.8,
    reviews: 11,
    sku: 'HER-003-RG-OS',
    heritage: 'Traditional pattern from Tataouine region',
  },

  // Limited Edition
  {
    id: 'lim-001',
    name: 'Couture Gown - Limited Series #001',
    category: 'Limited Edition',
    categorySlug: 'limited-edition',
    price: 5500,
    description: 'Exclusive numbered couture piece - 1 of 10',
    longDescription:
      'An exclusive numbered couture gown, part of our limited series of only 10 pieces. Each gown is individually created with premium fabrics and intricate hand-embroidery. This is couture at its finest - a true collector\'s piece.',
    image: '/images/products/couture-gown-1.png',
    images: [
      '/images/products/couture-gown-1.png',
      '/images/products/couture-gown-1-alt.png',
    ],
    color: 'Midnight Gold',
    colors: ['Midnight Gold'],
    size: 'M',
    sizes: ['XS', 'S', 'M', 'L'],
    material: 'Italian silk, 22k gold embroidery, Swarovski crystals',
    care: 'Professional dry cleaning required.',
    inStock: true,
    isNew: true,
    isLimited: true,
    limitedQty: 10,
    rating: 5,
    reviews: 2,
    sku: 'LIM-001-MG-M',
    heritage: 'Numbered piece: 001/010',
  },
  {
    id: 'lim-002',
    name: 'Bespoke Tuxedo Jacket',
    category: 'Limited Edition',
    categorySlug: 'limited-edition',
    price: 3200,
    description: 'Bespoke tailored tuxedo jacket - Made to order',
    longDescription:
      'A bespoke tuxedo jacket tailored specifically for the discerning client. Each piece is individually constructed with premium fabrics and finished by master tailors. Available in limited quantities.',
    image: '/images/products/tuxedo-jacket-1.png',
    images: [
      '/images/products/tuxedo-jacket-1.png',
      '/images/products/tuxedo-jacket-1-alt.png',
    ],
    color: 'Midnight Navy',
    colors: ['Midnight Navy', 'Charcoal'],
    size: 'M',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: 'Premium wool blend, silk lining',
    care: 'Professional dry cleaning only.',
    inStock: true,
    isNew: false,
    isLimited: true,
    limitedQty: 20,
    rating: 4.9,
    reviews: 4,
    sku: 'LIM-002-MN-M',
  },
  {
    id: 'lim-003',
    name: 'Artisan Jewelry Collection',
    category: 'Limited Edition',
    categorySlug: 'limited-edition',
    price: 1850,
    description: 'Exclusive artisan jewelry set - Only 3 pieces available',
    longDescription:
      'A stunning collection of handcrafted jewelry featuring traditional Tunisian designs in precious metals. Only 3 complete sets are available, each a unique work of art.',
    image: '/images/products/jewelry-set-1.png',
    images: [
      '/images/products/jewelry-set-1.png',
      '/images/products/jewelry-set-1-alt.png',
    ],
    color: 'Gold',
    colors: ['Gold', 'Silver'],
    size: 'One Size',
    sizes: ['One Size'],
    material: '18k Gold with semi-precious stones',
    care: 'Store in jewelry box. Clean with soft cloth.',
    inStock: true,
    isNew: true,
    isLimited: true,
    limitedQty: 3,
    rating: 5,
    reviews: 1,
    sku: 'LIM-003-AU-OS',
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getAllProducts(): Product[] {
  return products
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isNew).slice(0, 6)
}

export function getLimitedEditionProducts(): Product[] {
  return products.filter((p) => p.isLimited)
}
