import bcrypt from 'bcryptjs'
import { Gender } from '@prisma/client'
import { categories, products } from '../lib/data/products'
import { prisma } from '../lib/prisma'

const prismaClient = prisma

const ORIGINAL_GENDER: Record<string, Gender> = {
  'eve-001': 'WOMEN',
  'eve-002': 'WOMEN',
  'eve-003': 'WOMEN',
  'day-001': 'WOMEN',
  'day-002': 'WOMEN',
  'day-003': 'UNISEX', // AMBIGUOUS: tailored trousers with unisex cut
  'acc-001': 'UNISEX',
  'acc-002': 'UNISEX',
  'acc-003': 'UNISEX',
  'her-001': 'WOMEN',
  'her-002': 'UNISEX', // AMBIGUOUS: home textile, not gendered apparel
  'her-003': 'UNISEX', // AMBIGUOUS: traditional shawl worn across genders
  'lim-001': 'WOMEN',
  'lim-002': 'MEN',
  'lim-003': 'UNISEX',
}

const CATEGORY_SLUGS = [
  'evening-wear',
  'day-wear',
  'accessories',
  'heritage',
  'limited-edition',
] as const

const GENDERS: Gender[] = ['MEN', 'WOMEN', 'UNISEX']

const TOP_UP_TEMPLATES: Record<
  Gender,
  Record<(typeof CATEGORY_SLUGS)[number], Array<{ name: string; price: number; skuPrefix: string }>>
> = {
  MEN: {
    'evening-wear': [
      { name: 'Velvet Dinner Jacket - Onyx', price: 2100, skuPrefix: 'M-EVE' },
      { name: 'Silk Brocade Kaftan - Royal', price: 1750, skuPrefix: 'M-EVE' },
      { name: 'Embroidered Formal Vest - Gold', price: 980, skuPrefix: 'M-EVE' },
    ],
    'day-wear': [
      { name: 'Linen Safari Shirt - Sand', price: 620, skuPrefix: 'M-DAY' },
      { name: 'Tailored Chino - Olive', price: 780, skuPrefix: 'M-DAY' },
      { name: 'Lightweight Blazer - Navy', price: 1150, skuPrefix: 'M-DAY' },
    ],
    accessories: [
      { name: 'Hand-tooled Leather Belt - Cognac', price: 320, skuPrefix: 'M-ACC' },
      { name: 'Silk Pocket Square - Atlas', price: 180, skuPrefix: 'M-ACC' },
      { name: 'Woven Cufflinks - Bronze', price: 450, skuPrefix: 'M-ACC' },
    ],
    heritage: [
      { name: 'Traditional Burnous Cloak', price: 1450, skuPrefix: 'M-HER' },
      { name: 'Handwoven Sfax Blanket', price: 890, skuPrefix: 'M-HER' },
      { name: 'Artisan Leather Slippers', price: 540, skuPrefix: 'M-HER' },
    ],
    'limited-edition': [
      { name: 'Numbered Brocade Caftan #M-04', price: 3800, skuPrefix: 'M-LIM' },
      { name: 'Master Tailor Dinner Suit #M-05', price: 4200, skuPrefix: 'M-LIM' },
    ],
  },
  WOMEN: {
    'evening-wear': [],
    'day-wear': [
      { name: 'Pleated Midi Skirt - Sage', price: 720, skuPrefix: 'W-DAY' },
    ],
    accessories: [
      { name: 'Pearl-Trimmed Clutch - Ivory', price: 680, skuPrefix: 'W-ACC' },
      { name: 'Hand-beaded Headband - Gold', price: 240, skuPrefix: 'W-ACC' },
      { name: 'Silk Wrap - Desert Rose', price: 390, skuPrefix: 'W-ACC' },
    ],
    heritage: [
      { name: 'Ceremonial Coin Belt', price: 510, skuPrefix: 'W-HER' },
      { name: 'Tataouine Embroidered Cape', price: 980, skuPrefix: 'W-HER' },
    ],
    'limited-edition': [
      { name: 'Hand-painted Silk Gown #W-02', price: 4800, skuPrefix: 'W-LIM' },
      { name: 'Collector Kaftan Series #W-03', price: 3600, skuPrefix: 'W-LIM' },
    ],
  },
  UNISEX: {
    'evening-wear': [
      { name: 'Metallic Thread Cape - Eclipse', price: 1420, skuPrefix: 'U-EVE' },
      { name: 'Crystal-Embroidered Shawl Wrap', price: 1180, skuPrefix: 'U-EVE' },
      { name: 'Silk Column Overlay - Pearl', price: 1560, skuPrefix: 'U-EVE' },
    ],
    'day-wear': [
      { name: 'Relaxed Linen Set - Clay', price: 920, skuPrefix: 'U-DAY' },
      { name: 'Oversized Tunic - Stone', price: 680, skuPrefix: 'U-DAY' },
    ],
    accessories: [],
    heritage: [
      { name: 'Berber Pattern Table Runner', price: 360, skuPrefix: 'U-HER' },
    ],
    'limited-edition': [
      { name: 'Artisan Metal Cuff Set #U-02', price: 2100, skuPrefix: 'U-LIM' },
      { name: 'Heritage Archive Piece #U-03', price: 2750, skuPrefix: 'U-LIM' },
    ],
  },
}

function categoryMeta(slug: string) {
  return categories.find((c) => c.slug === slug)!
}

function buildTopUpProduct(
  gender: Gender,
  categorySlug: (typeof CATEGORY_SLUGS)[number],
  template: { name: string; price: number; skuPrefix: string },
  index: number
) {
  const category = categoryMeta(categorySlug)
  const id = `gen-${gender.toLowerCase()}-${categorySlug}-${String(index + 1).padStart(2, '0')}`
  const sku = `${template.skuPrefix}-${String(index + 1).padStart(3, '0')}`

  return {
    id,
    name: template.name,
    categorySlug,
    gender,
    price: template.price,
    description: `Premium ${category.name.toLowerCase()} crafted for MAISON TUNIS ${gender.toLowerCase()} collections.`,
    longDescription: `An expertly crafted piece from our ${category.name.toLowerCase()} line, honoring Tunisian artisan techniques with contemporary refinement. Designed for discerning clients who value heritage and modern elegance.`,
    image: `/images/categories/${categorySlug}.png`,
    images: [`/images/categories/${categorySlug}.png`],
    color: 'Natural',
    colors: ['Natural', 'Gold', 'Midnight'],
    size: 'M',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: 'Premium natural fibers with hand-finished details',
    care: 'Professional care recommended.',
    inStock: true,
    isNew: index === 0,
    isLimited: categorySlug === 'limited-edition',
    limitedQty: categorySlug === 'limited-edition' ? 8 : undefined,
    rating: 4.7 + index * 0.05,
    reviews: 3 + index,
    sku,
    heritage:
      categorySlug === 'heritage'
        ? 'Inspired by regional Tunisian craft traditions'
        : undefined,
  }
}

async function upsertCategory(category: (typeof categories)[number]) {
  return prismaClient.category.upsert({
    where: { slug: category.slug },
    update: {
      name: category.name,
      description: category.description,
      image: category.image,
    },
    create: {
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
    },
  })
}

async function upsertProduct(
  product: (typeof products)[number] | ReturnType<typeof buildTopUpProduct>,
  gender: Gender,
  categoryId: string
) {
  return prismaClient.product.upsert({
    where: { id: product.id },
    update: {
      name: product.name,
      categoryId,
      gender,
      price: product.price,
      description: product.description,
      longDescription: product.longDescription,
      image: product.image,
      images: product.images,
      color: product.color,
      colors: product.colors,
      size: product.size,
      sizes: product.sizes,
      material: product.material,
      care: product.care,
      inStock: product.inStock,
      isNew: product.isNew,
      isLimited: product.isLimited,
      limitedQty: product.limitedQty,
      rating: product.rating,
      reviews: product.reviews,
      sku: product.sku,
      heritage: product.heritage,
    },
    create: {
      id: product.id,
      name: product.name,
      categoryId,
      gender,
      price: product.price,
      description: product.description,
      longDescription: product.longDescription,
      image: product.image,
      images: product.images,
      color: product.color,
      colors: product.colors,
      size: product.size,
      sizes: product.sizes,
      material: product.material,
      care: product.care,
      inStock: product.inStock,
      isNew: product.isNew,
      isLimited: product.isLimited,
      limitedQty: product.limitedQty,
      rating: product.rating,
      reviews: product.reviews,
      sku: product.sku,
      heritage: product.heritage,
    },
  })
}

async function main() {
  console.log('Seeding categories...')
  const categoryRecords: Record<string, string> = {}
  for (const category of categories) {
    const record = await upsertCategory(category)
    categoryRecords[category.slug] = record.id
  }

  console.log('Seeding original products...')
  for (const product of products) {
    const gender = ORIGINAL_GENDER[product.id] ?? 'UNISEX'
    await upsertProduct(product, gender, categoryRecords[product.categorySlug])
  }

  console.log('Topping up gender × category coverage...')
  for (const gender of GENDERS) {
    for (const categorySlug of CATEGORY_SLUGS) {
      const existingCount = await prismaClient.product.count({
        where: {
          gender,
          category: { slug: categorySlug },
        },
      })

      const needed = Math.max(0, 3 - existingCount)
      const templates = TOP_UP_TEMPLATES[gender][categorySlug] ?? []

      for (let i = 0; i < needed; i++) {
        const template = templates[i] ?? {
          name: `${gender} ${categoryMeta(categorySlug).name} Piece ${existingCount + i + 1}`,
          price: 500 + (existingCount + i) * 120,
          skuPrefix: `${gender[0]}-${categorySlug.slice(0, 3).toUpperCase()}`,
        }

        const topUp = buildTopUpProduct(gender, categorySlug, template, i)
        await upsertProduct(topUp, gender, categoryRecords[categorySlug])
      }
    }
  }

  console.log('Seeding users...')
  const adminPassword = await bcrypt.hash('Hannibal08', 12)
  const customerPassword = await bcrypt.hash('Mediterranean19', 12)

  await prismaClient.user.upsert({
    where: { email: 'youssefkotbi@gmail.com' },
    update: {
      name: 'Youssef Kotbi',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Youssef Kotbi',
      email: 'youssefkotbi@gmail.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  await prismaClient.user.upsert({
    where: { email: 'nourhouda@outlook.com' },
    update: {
      name: 'Nour Houda',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
    create: {
      name: 'Nour Houda',
      email: 'nourhouda@outlook.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  })

  const totalProducts = await prismaClient.product.count()
  console.log(`Seed complete. ${totalProducts} products in catalog.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })
