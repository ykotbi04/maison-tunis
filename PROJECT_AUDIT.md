# PROJECT_AUDIT.md — MAISON TUNIS

> Complete technical inventory of the "Maison Tunis" e-commerce platform, generated from source code analysis.

---

## 1. Tech Stack Inventory

### Runtime & Language

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| TypeScript | 5.7.3 | Type-safe development language | `tsconfig.json`, all `.ts`/`.tsx` files |
| Node.js | 20+ | Server runtime (required per `BACKEND_SETUP.md`) | Build scripts, Prisma, API routes |

### Frontend Framework

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| Next.js | 16.2.6 | Full-stack React framework (App Router, SSR, API routes) | `next.config.mjs`, `app/` |
| React | 19.2.4 | UI rendering library | `package.json`, all components |
| React DOM | 19.2.4 | DOM rendering for React | `package.json` |

### Styling

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| Tailwind CSS | ^4.2.0 | Utility-first CSS framework | `tailwind.config.ts`, `app/globals.css` |
| @tailwindcss/postcss | ^4.2.0 | PostCSS plugin for Tailwind v4 | `postcss.config.mjs` |
| PostCSS | ^8.5 | CSS processing pipeline | `postcss.config.mjs` |
| tw-animate-css | ^1.4.0 | Animation utilities for Tailwind | `package.json` |
| class-variance-authority (CVA) | ^0.7.1 | Variant-based component styling | `components/ui/button.tsx`, `input.tsx`, `link.tsx` |
| clsx | ^2.1.1 | Conditional class name utility | `lib/utils.ts` |
| tailwind-merge | ^3.3.1 | Intelligent Tailwind class merging | `lib/utils.ts` |

### State Management

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| Zustand | ^5.0.14 | Client-side state management (cart, wishlist, UI) | `lib/stores/cartStore.ts`, `wishlistStore.ts`, `uiStore.ts` |

### ORM & Database

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| Prisma | ^7.8.0 | ORM for database access | `prisma/schema.prisma`, `lib/prisma.ts` |
| @prisma/client | ^7.8.0 | Auto-generated Prisma client | `lib/prisma.ts`, all `lib/db/*.ts` |
| @prisma/adapter-pg | ^7.8.0 | PostgreSQL adapter for Prisma (driver adapter) | `lib/prisma.ts` |
| pg (node-postgres) | ^8.16.3 | PostgreSQL client driver | `lib/prisma.ts` |

### Authentication

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| next-auth | ^5.0.0-beta.30 | Authentication framework (Auth.js v5 beta) | `auth.ts`, `app/api/auth/` |
| bcryptjs | ^3.0.3 | Password hashing | `auth.ts`, `app/api/auth/register/route.ts`, `app/api/auth/login/route.ts` |
| jose | ^6.2.3 | JWT token library (used by NextAuth internally) | `package.json` |

### Validation

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| Zod | ^4.4.3 | Runtime schema validation for API inputs | `lib/schemas/api.ts`, `lib/api-errors.ts` |

### Animation

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| framer-motion | ^12.40.0 | Declarative animations and transitions | `lib/animations.tsx`, `lib/motion-system.ts` |

### UI Components

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| shadcn | ^4.8.0 | Component scaffolding CLI | `components.json` (style: `base-nova`) |
| @base-ui/react | ^1.5.0 | Headless UI primitives (Base UI) | `package.json` |
| lucide-react | ^1.16.0 | Icon library | `components.json` (`iconLibrary: "lucide"`) |

### Data Formatting

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| date-fns | ^4.4.0 | Date utility library | `package.json` |

### Toasts / Notifications

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| react-hot-toast | ^2.6.0 | Toast notification system | `package.json` |

### Analytics

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| @vercel/analytics | 1.6.1 | Web analytics (production only) | `app/layout.tsx` |

### HTTP Client

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| axios | ^1.18.0 | HTTP client library | `package.json` (not actively imported in source) |

### Environment

| Dependency | Version | Purpose | Location |
|---|---|---|---|
| dotenv | ^17.2.0 | Environment variable loading | `prisma.config.ts` |

### Dev/Tooling Config Files

| File | Purpose |
|---|---|
| `opencode.json` | OpenCode AI agent config; enables Stitch MCP server for design tooling |
| `stitch-tools.json` | Stitch design integration config (binary, Google Stitch) |
| `components.json` | shadcn/ui component configuration (style: `base-nova`, RSC: true) |
| `prisma.config.ts` | Prisma CLI config: schema path, migration path, seed command, datasource URL |
| `BACKEND_SETUP.md` | Project setup documentation |
| `.gitignore` | Standard Next.js gitignore |

---

## 2. Project Architecture

### Folder Structure (3 levels deep)

```
maison-tunis/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── account/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── profile/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── orders/[id]/page.tsx
│   │       └── wishlist/page.tsx
│   ├── (shop)/
│   │   ├── about/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── collections/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── shop/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── men/page.tsx
│   │   ├── men/[categorySlug]/page.tsx
│   │   ├── women/page.tsx
│   │   ├── women/[categorySlug]/page.tsx
│   │   └── products/[id]/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── inventory/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── products/page.tsx
│   │   ├── products/new/page.tsx
│   │   ├── products/[id]/edit/page.tsx
│   │   ├── settings/page.tsx
│   │   └── support/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── wishlist/
│   │   ├── account/
│   │   └── admin/
│   ├── pages/[slug]/page.tsx
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   └── product-form.tsx
│   ├── cart/
│   │   └── cart-drawer.tsx
│   ├── layout/
│   │   ├── container.tsx
│   │   ├── footer.tsx
│   │   └── section.tsx
│   ├── navigation/
│   │   └── navbar.tsx
│   ├── product/
│   │   ├── product-card.tsx
│   │   └── product-detail.tsx
│   ├── providers/
│   │   ├── session-provider.tsx
│   │   └── theme-provider.tsx
│   ├── sections/
│   │   └── hero-banner.tsx
│   └── ui/
│       ├── breadcrumbs.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── link.tsx
│       ├── skeleton.tsx
│       └── theme-toggle.tsx
├── hooks/
│   ├── index.ts
│   ├── useAuthSession.ts
│   ├── useCart.ts
│   ├── useCheckout.ts
│   ├── useFilters.ts
│   ├── useProducts.ts
│   ├── useQuantity.ts
│   └── useWishlist.ts
├── lib/
│   ├── api-errors.ts
│   ├── api.ts
│   ├── animations.tsx
│   ├── colors.ts
│   ├── constants.ts
│   ├── data/products.ts
│   ├── db/
│   │   ├── admin.ts
│   │   ├── cart.ts
│   │   ├── categories.ts
│   │   ├── orders.ts
│   │   ├── products.ts
│   │   └── wishlist.ts
│   ├── formatters.ts
│   ├── mappers/
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── product.ts
│   ├── motion-system.ts
│   ├── prisma.ts
│   ├── schemas/api.ts
│   ├── shop/gender-collection-page.tsx
│   ├── stores/
│   │   ├── cartStore.ts
│   │   ├── index.ts
│   │   ├── uiStore.ts
│   │   └── wishlistStore.ts
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── index.ts
│   │   ├── motion.ts
│   │   ├── radius.ts
│   │   ├── shadows.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   ├── utils.ts
│   └── validators.ts
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── types/
│   ├── admin.ts
│   ├── api.ts
│   ├── cart.ts
│   ├── checkout.ts
│   ├── next-auth.d.ts
│   ├── product.ts
│   └── user.ts
├── auth.ts
├── middleware.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── opencode.json
├── components.json
└── stitch-tools.json
```

### App Router Route Map

| Route | File Path | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Homepage: hero, brand values, featured collections, newsletter |
| `/shop` | `app/(shop)/shop/page.tsx` | All products catalog with search/filter |
| `/shop` (also) | `app/(shop)/collections/page.tsx` | Collections overview page |
| `/cart` | `app/(shop)/cart/page.tsx` | Shopping cart page |
| `/checkout` | `app/(shop)/checkout/page.tsx` | Multi-step checkout (shipping → payment → confirmation) |
| `/about` | `app/(shop)/about/page.tsx` | Brand story / about page |
| `/contact` | `app/(shop)/contact/page.tsx` | Contact form page |
| `/men` | `app/(shop)/men/page.tsx` | Men's collection (all categories) |
| `/men/[categorySlug]` | `app/(shop)/men/[categorySlug]/page.tsx` | Men's category-specific product listing |
| `/women` | `app/(shop)/women/page.tsx` | Women's collection (all categories) |
| `/women/[categorySlug]` | `app/(shop)/women/[categorySlug]/page.tsx` | Women's category-specific product listing |
| `/categories/[slug]` | `app/(shop)/categories/[slug]/page.tsx` | Generic category product listing |
| `/products/[id]` | `app/(shop)/products/[id]/page.tsx` | Product detail page |
| `/pages/[slug]` | `app/pages/[slug]/page.tsx` | Static/info pages (shipping, returns, FAQ, etc.) |
| `/login` | `app/(auth)/login/page.tsx` | Login form |
| `/register` | `app/(auth)/register/page.tsx` | Registration form |
| `/account` | `app/(auth)/account/page.tsx` | Account dashboard |
| `/account/profile` | `app/(auth)/account/profile/page.tsx` | Edit profile |
| `/account/orders` | `app/(auth)/account/orders/page.tsx` | Order history |
| `/account/orders/[id]` | `app/(auth)/account/orders/[id]/page.tsx` | Order detail |
| `/account/wishlist` | `app/(auth)/account/wishlist/page.tsx` | User wishlist |
| `/admin` | `app/admin/page.tsx` | Admin dashboard overview |
| `/admin/products` | `app/admin/products/page.tsx` | Admin: product listing |
| `/admin/products/new` | `app/admin/products/new/page.tsx` | Admin: create product |
| `/admin/products/[id]/edit` | `app/admin/products/[id]/edit/page.tsx` | Admin: edit product |
| `/admin/orders` | `app/admin/orders/page.tsx` | Admin: order management |
| `/admin/categories` | `app/admin/categories/page.tsx` | Admin: category management |
| `/admin/analytics` | `app/admin/analytics/page.tsx` | Admin: analytics dashboard |
| `/admin/inventory` | `app/admin/inventory/page.tsx` | Admin: inventory management |
| `/admin/settings` | `app/admin/settings/page.tsx` | Admin: settings page |
| `/admin/support` | `app/admin/support/page.tsx` | Admin: support/tickets page |

### API Routes Inventory

| Route | HTTP Methods | Purpose | Auth Required |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth.js catch-all handler | No |
| `/api/auth/register` | POST | User registration (name, email, password) | No |
| `/api/auth/login` | POST | Custom login with guest cart/wishlist merge | No |
| `/api/auth/sync` | POST | Sync guest cart & wishlist to authenticated user | Yes |
| `/api/products` | GET, POST | List products (with gender/category filter); create product (admin) | GET: No; POST: Admin |
| `/api/products/[id]` | GET, PATCH, DELETE | Get, update, delete single product | GET: No; PATCH/DELETE: Admin |
| `/api/products/search` | GET | Search products with filters, pagination | No |
| `/api/categories` | GET | List all categories | No |
| `/api/categories/[slug]` | GET | Get category by slug | No |
| `/api/cart` | GET, DELETE | Get user cart; clear cart | Yes |
| `/api/cart/items` | POST | Add item to cart | Yes |
| `/api/cart/items/[id]` | PUT, DELETE | Update quantity / remove cart item | Yes |
| `/api/checkout` | POST | Create order from cart items | Yes |
| `/api/orders/[id]` | GET | Get order details | Yes |
| `/api/wishlist` | GET, POST, DELETE | Get wishlist; add item (single or bulk sync); remove item | Yes |
| `/api/contact` | POST | Submit contact form (currently logs to console) | No |
| `/api/account/profile` | PATCH | Update user name/email | Yes |
| `/api/account/password` | POST | Change password | Yes |
| `/api/account/orders` | GET | Get user's order history (paginated) | Yes |
| `/api/admin/dashboard` | GET | Admin dashboard stats (revenue, orders, customers) | Admin |
| `/api/admin/products` | GET | Admin: list products with search/filter/pagination | Admin |
| `/api/admin/products/[id]` | PATCH, DELETE | Admin: update/delete product | Admin |
| `/api/admin/orders` | GET | Admin: list all orders with status filter | Admin |
| `/api/admin/orders/[id]` | PATCH | Admin: update order status | Admin |
| `/api/admin/categories` | GET, POST | Admin: list/create categories | Admin |
| `/api/admin/categories/[id]` | PATCH, DELETE | Admin: update/delete category | Admin |

---

## 3. Database Schema

**Database:** PostgreSQL  
**ORM:** Prisma (schema at `prisma/schema.prisma`)  
**Adapter:** `@prisma/adapter-pg` with `pg` Pool

### Enums

```prisma
enum Gender {
  MEN
  WOMEN
  UNISEX
}

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Models

#### Category
| Field | Type | Constraints |
|---|---|---|
| `id` | String | `@id @default(cuid())` |
| `name` | String | — |
| `slug` | String | `@unique` |
| `description` | String | — |
| `image` | String | — |
| `createdAt` | DateTime | `@default(now())` |
| `updatedAt` | DateTime | `@updatedAt` |
| **Relations** | `products` → Product[] (one-to-many) | |

#### Product
| Field | Type | Constraints |
|---|---|---|
| `id` | String | `@id` |
| `name` | String | — |
| `categoryId` | String | FK → Category.id (`onDelete: Restrict`) |
| `gender` | Gender | enum |
| `price` | Decimal | `@db.Decimal(10, 2)` |
| `description` | String | — |
| `longDescription` | String | `@db.Text` |
| `image` | String | — |
| `images` | String[] | array |
| `color` | String | — |
| `colors` | String[] | array |
| `size` | String | — |
| `sizes` | String[] | array |
| `material` | String | — |
| `care` | String | — |
| `inStock` | Boolean | `@default(true)` |
| `stock` | Int? | nullable |
| `isNew` | Boolean | `@default(false)` |
| `isLimited` | Boolean | `@default(false)` |
| `limitedQty` | Int? | nullable |
| `rating` | Float | `@default(0)` |
| `reviews` | Int | `@default(0)` |
| `sku` | String | `@unique` |
| `heritage` | String? | nullable |
| `createdAt` | DateTime | `@default(now())` |
| `updatedAt` | DateTime | `@updatedAt` |
| **Indexes** | `@@index([categoryId])`, `@@index([gender])`, `@@index([inStock])`, `@@index([isNew])`, `@@index([price])` |
| **Relations** | `cartItems` → CartItem[], `wishlistItems` → WishlistItem[], `orderItems` → OrderItem[] |

#### User
| Field | Type | Constraints |
|---|---|---|
| `id` | String | `@id @default(cuid())` |
| `name` | String | — |
| `email` | String | `@unique` |
| `passwordHash` | String | — |
| `role` | Role | `@default(CUSTOMER)` |
| `createdAt` | DateTime | `@default(now())` |
| `updatedAt` | DateTime | `@updatedAt` |
| **Relations** | `cartItems` → CartItem[], `wishlistItems` → WishlistItem[], `orders` → Order[] |

#### CartItem
| Field | Type | Constraints |
|---|---|---|
| `id` | String | `@id @default(cuid())` |
| `userId` | String | FK → User.id (`onDelete: Cascade`) |
| `productId` | String | FK → Product.id (`onDelete: Cascade`) |
| `quantity` | Int | — |
| `size` | String | — |
| `color` | String | — |
| **Unique** | `@@unique([userId, productId, size, color])` |
| **Index** | `@@index([userId])` |

#### WishlistItem
| Field | Type | Constraints |
|---|---|---|
| `id` | String | `@id @default(cuid())` |
| `userId` | String | FK → User.id (`onDelete: Cascade`) |
| `productId` | String | FK → Product.id (`onDelete: Cascade`) |
| `createdAt` | DateTime | `@default(now())` |
| **Unique** | `@@unique([userId, productId])` |
| **Index** | `@@index([userId])` |

#### Order
| Field | Type | Constraints |
|---|---|---|
| `id` | String | `@id @default(cuid())` |
| `userId` | String | FK → User.id (`onDelete: Restrict`) |
| `status` | OrderStatus | `@default(PENDING)` |
| `total` | Decimal | `@db.Decimal(10, 2)` |
| `subtotal` | Decimal | `@db.Decimal(10, 2)` |
| `shippingCost` | Decimal | `@db.Decimal(10, 2)` |
| `tax` | Decimal | `@db.Decimal(10, 2)` |
| `shippingFirstName` | String | — |
| `shippingLastName` | String | — |
| `shippingEmail` | String | — |
| `shippingPhone` | String | — |
| `shippingAddress` | String | — |
| `shippingCity` | String | — |
| `shippingState` | String | — |
| `shippingPostalCode` | String | — |
| `shippingCountry` | String | — |
| `paymentMethod` | String? | nullable |
| `createdAt` | DateTime | `@default(now())` |
| `updatedAt` | DateTime | `@updatedAt` |
| **Indexes** | `@@index([userId])`, `@@index([status])`, `@@index([createdAt])` |
| **Relations** | `items` → OrderItem[] |

#### OrderItem
| Field | Type | Constraints |
|---|---|---|
| `id` | String | `@id @default(cuid())` |
| `orderId` | String | FK → Order.id (`onDelete: Cascade`) |
| `productId` | String | FK → Product.id (`onDelete: Restrict`) |
| `quantity` | Int | — |
| `priceSnapshot` | Decimal | `@db.Decimal(10, 2)` |
| `size` | String | — |
| `color` | String | — |
| **Indexes** | `@@index([orderId])`, `@@index([productId])` |

### Cascade Rules Summary

| Relation | On Delete |
|---|---|
| Product → Category | Restrict (prevent deleting category with products) |
| CartItem → User | Cascade (delete cart items when user deleted) |
| CartItem → Product | Cascade (delete cart items when product deleted) |
| WishlistItem → User | Cascade |
| WishlistItem → Product | Cascade |
| Order → User | Restrict (prevent deleting user with orders) |
| OrderItem → Order | Cascade (delete items when order deleted) |
| OrderItem → Product | Restrict (prevent deleting product referenced in orders) |

---

## 4. Authentication & Authorization

### NextAuth.js Configuration (`auth.ts`)

- **Version:** next-auth v5.0.0-beta.30 (Auth.js v5)
- **Session Strategy:** **JWT** (not database sessions)
- **Session Max Age:** 30 days
- **Providers:** Credentials only (email + password)
- **Password Hashing:** bcryptjs with 12 salt rounds
- **Custom Sign-In Page:** `/login`
- **Trust Host:** enabled (`trustHost: true`)

### Session Augmentation

The `types/next-auth.d.ts` file augments the default NextAuth types to include:
- `session.user.id: string`
- `session.user.role: Role` (CUSTOMER | ADMIN)
- `token.id: string`
- `token.role: Role`

JWT callback stores `id` and `role` in the token; session callback maps them to `session.user`.

### Helper Functions (`auth.ts`)

- `requireAuth()` — returns session if authenticated, null otherwise
- `requireAdmin()` — returns session only if user has ADMIN role

### Middleware (`middleware.ts`)

```typescript
// Protected routes:
// /admin/*   → requires auth + ADMIN role (redirects to / or /login)
// /account/* → requires auth (redirects to /login?callbackUrl=/account)
// All other routes → pass-through (no protection)
```

Matcher config: `['/admin/:path*', '/account/:path*']`

### Role-Based Access

| Role | Access |
|---|---|
| **CUSTOMER** | Shop, cart, checkout, account, order history, wishlist |
| **ADMIN** | All customer routes + admin dashboard, product CRUD, order management, category management, analytics, inventory, settings, support |
| **Unauthenticated** | Shop, product browsing, login, register. Cannot access `/admin/*`, `/account/*`, checkout, or API cart/wishlist endpoints |

### Seed Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@maison-tunis.com` | `Admin123!` |
| Customer | `customer@maison-tunis.com` | `Customer123!` |

---

## 5. State Management

### Zustand Stores

#### 1. Cart Store (`lib/stores/cartStore.ts`)

- **Persistence:** localStorage key `maison-tunis-cart`
- **State Shape:**
  ```typescript
  { items: CartItem[] }
  // CartItem: { id, name, price, quantity, size?, color?, image? }
  ```
- **Actions:** `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- **Selectors:** `getTotalPrice`, `getTotalItems`, `getItemById`, `hasItem`
- **Granular Selectors:** `useCartItems`, `useCartTotalPrice`, `useCartTotalItems`, `useAddCartItem`, etc. (to prevent unnecessary re-renders)

#### 2. Wishlist Store (`lib/stores/wishlistStore.ts`)

- **Persistence:** localStorage key `maison-tunis-wishlist`
- **State Shape:**
  ```typescript
  { items: WishlistItem[] }
  // WishlistItem: { productId: string, addedAt: Date }
  ```
- **Actions:** `addItem`, `removeItem`, `hasItem`, `clearWishlist`

#### 3. UI Store (`lib/stores/uiStore.ts`)

- **Persistence:** None (ephemeral)
- **State Shape:**
  ```typescript
  { cartDrawerOpen: boolean, mobileMenuOpen: boolean, searchOpen: boolean, loading: boolean }
  ```
- **Actions:** set/toggle for each UI state
- **Granular Selectors:** one per state field and per action

### Merge-on-Login / Sync Logic

The `useCart` and `useWishlist` hooks implement a hybrid local↔server sync pattern:

1. **Guest mode:** Cart and wishlist are stored entirely in localStorage via Zustand persist.
2. **On login:** The `useCart` hook calls `syncCartFromServer()` which fetches the server-side cart via `GET /api/cart` and overwrites the local store.
3. **Cart operations (add/remove/update):** If authenticated, the hook calls the API first and updates the local store with the server response. If the API fails, it falls back to the local store.
4. **Login API route** (`/api/auth/login`): Accepts optional `guestCart` and `guestWishlist` arrays in the body. Uses `syncGuestCart()` and `syncGuestWishlist()` to merge guest data into the authenticated user's server-side cart/wishlist. Merging logic: upsert by unique constraint (userId + productId + size + color for cart; userId + productId for wishlist).
5. **Wishlist sync:** On auth, fetches wishlist product IDs from server and hydrates the local store.

---

## 6. Key Features Implemented

### 1. Product Catalog & Browsing
- Full product listing with category, gender, price, and stock filters
- Product search with debounced queries and pagination
- Product detail page with image gallery, color/size selectors, quantity control
- **Main files:** `app/(shop)/shop/page.tsx`, `app/(shop)/products/[id]/page.tsx`, `components/product/product-card.tsx`, `components/product/product-detail.tsx`, `lib/db/products.ts`, `hooks/useProducts.ts`, `hooks/useFilters.ts`

### 2. Gender-Based Collections
- Dedicated `/men` and `/women` routes with category sub-navigation
- Shared `GenderCollectionPage` component with editorial blocks
- **Main files:** `app/(shop)/men/page.tsx`, `app/(shop)/women/page.tsx`, `lib/shop/gender-collection-page.tsx`

### 3. Shopping Cart
- Guest cart (localStorage via Zustand persist)
- Authenticated cart (Prisma/PostgreSQL)
- Cart drawer (slide-in panel from right)
- Add, remove, update quantity, clear cart
- Guest-to-authenticated cart merge on login
- **Main files:** `components/cart/cart-drawer.tsx`, `lib/stores/cartStore.ts`, `hooks/useCart.ts`, `lib/db/cart.ts`, `app/api/cart/`

### 4. Wishlist
- Guest wishlist (localStorage)
- Authenticated wishlist (Prisma/PostgreSQL)
- Toggle wishlist from product cards
- Guest-to-authenticated wishlist merge on login
- Dedicated wishlist page in account section
- **Main files:** `hooks/useWishlist.ts`, `lib/stores/wishlistStore.ts`, `lib/db/wishlist.ts`, `app/api/wishlist/route.ts`, `app/(auth)/account/wishlist/page.tsx`

### 5. Checkout Flow
- Multi-step checkout: Shipping → Payment → Confirmation
- Form validation (Zod schemas + custom validators)
- Order creation with price snapshot, stock validation, tax/shipping calculation
- Cart cleared after successful order
- **Main files:** `app/(shop)/checkout/page.tsx`, `hooks/useCheckout.ts`, `lib/schemas/api.ts`, `lib/validators.ts`, `lib/db/orders.ts`, `app/api/checkout/route.ts`

### 6. Authentication & User Accounts
- Registration with email/password
- Login with session cookie
- Profile editing (name, email)
- Password change
- Order history with detail pages
- **Main files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, `app/(auth)/account/page.tsx`, `app/api/auth/`, `app/api/account/`

### 7. Admin Dashboard
- Revenue stats with month-over-month comparison
- Order count, today's orders, product count, out-of-stock count
- Customer count, new customers this week
- Recent orders list
- **Main files:** `app/admin/page.tsx`, `app/api/admin/dashboard/route.ts`, `lib/db/admin.ts`

### 8. Admin Product Management
- Product listing with search, filter by category/gender/stock, pagination
- Create new product form
- Edit product form
- Delete product
- **Main files:** `app/admin/products/page.tsx`, `app/admin/products/new/page.tsx`, `app/admin/products/[id]/edit/page.tsx`, `components/admin/product-form.tsx`, `app/api/admin/products/`

### 9. Admin Order Management
- Order listing with status filter and search
- Update order status (PENDING → PROCESSING → SHIPPED → DELIVERED / CANCELLED)
- **Main files:** `app/admin/orders/page.tsx`, `app/api/admin/orders/`

### 10. Admin Category Management
- Category CRUD (create, update, delete)
- **Main files:** `app/admin/categories/page.tsx`, `app/api/admin/categories/`

### 11. Contact Form
- Form with Zod validation
- Currently logs submission to server console (no email/DB persistence)
- **Main files:** `app/(shop)/contact/page.tsx`, `app/api/contact/route.ts`

### 12. Dark/Light Theme Toggle
- Class-based theme switching via `next-themes`
- Theme toggle button in navbar
- CSS custom properties for both themes defined in `globals.css`
- **Main files:** `components/ui/theme-toggle.tsx`, `components/providers/theme-provider.tsx`, `app/globals.css`

### 13. Responsive Navigation
- Desktop: full nav bar with dropdown menus (Men/Women by category, Shop, Collections, About, Contact)
- Mobile: hamburger menu with nested category links
- Account-aware: shows sign-in link or account + sign-out
- **Main files:** `components/navigation/navbar.tsx`

### 14. Newsletter Subscription
- Footer newsletter form
- Homepage newsletter CTA
- Client-side only (sets `subscribed` state, no backend persistence)
- **Main files:** `components/layout/footer.tsx`, `app/page.tsx`

---

## 7. Design System

### Tailwind Configuration (`tailwind.config.ts`)

All design tokens are imported from `lib/tokens/` and injected into the Tailwind theme.

#### Custom Colors

| Token | Hex | Description |
|---|---|---|
| `background` | `#0C0A08` | Primary dark background |
| `background-secondary` | `#14110E` | Secondary dark background |
| `foreground` | `#F5F0E8` | Primary text (cream) |
| `foreground-secondary` | `#EDE8E0` | Secondary text |
| `foreground-muted` | `#A9A09B` | Muted text |
| `accent` | `#D8B57F` | Primary accent (bronze/gold) |
| `accent-hover` | `#B8945F` | Accent hover state |
| `bronze` | `#D8B57F` | Bronze color family (light/dark variants) |
| `rose` | `#B8956A` | Rose color family |
| `terracotta` | `#B85C38` | Terracotta color family |
| `stone` | `#9D9080` | Stone color family |
| `sage` | `#8B9D83` | Sage color family |
| `slate` | `#6B7280` | Slate color family |
| `cream` | `#F5F0E8` | Cream neutral |
| `ivory` | `#EDE8E0` | Ivory neutral |
| `white` | `#FEFBF8` | Brilliant white |
| `border` | `#2A2620` | Default border |
| `success` | `#6B9E7F` | Success status |
| `error` | `#C9544D` | Error status |
| `warning` | `#D8B57F` | Warning status |
| `info` | `#7BA3C0` | Info status |

#### Custom Fonts

| Family | CSS Variable | Usage |
|---|---|---|
| `sans` | `--font-sans` | DM Sans (body text, UI elements) |
| `serif` | `--font-serif` | Cormorant Garamond (headings, brand name, product titles) |
| `mono` | — | System monospace fallback |

#### Typography Scale

Defined in `lib/tokens/typography.ts` and mapped as Tailwind `fontSize` utilities:

`display-1`, `display-2`, `h1`–`h6`, `body`, `body-lg`, `body-sm`, `label`, `label-lg`, `label-sm`, `caption`, `overline`, `price`, `price-lg`, `price-sm`

#### Spacing System

8pt grid system defined in `lib/tokens/spacing.ts`. Base unit: 8px. Values from 0 to 96 (0px to 384px).

#### Border Radius

Defined in `lib/tokens/radius.ts`: `none` (0), `xs` (2), `sm` (4), `md` (8), `lg` (12), `xl` (16), `2xl` (24), `3xl` (32), `full` (9999).

#### Shadows

Defined in `lib/tokens/shadows.ts`: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`, `innerLg`, `accent`, `accentLg`.

#### Animations (CSS)

Defined in `tailwind.config.ts`: `fade-in`, `fade-in-up`, `fade-in-down`, `scale-in`, `scale-up`, `slide-in-right`, `slide-in-left`, `shimmer`.

#### CSS Custom Properties (Light/Dark)

Defined in `app/globals.css` under `:root` and `.dark` selectors:
- `--bg`, `--bg-secondary`, `--fg`, `--fg-secondary`, `--fg-muted`, `--accent`, `--accent-hover`, `--border`, `--border-light`, `--card`

### Reusable UI Components

| Component | Location | Description |
|---|---|---|
| `Button` | `components/ui/button.tsx` | Multi-variant button (primary/secondary/tertiary/outline/ghost/destructive/success), multiple sizes, loading state |
| `Input` | `components/ui/input.tsx` | Form input with label, error, helper text, variant/size support |
| `Link` | `components/ui/link.tsx` | Styled anchor with variant/size/underline options |
| `Breadcrumbs` | `components/ui/breadcrumbs.tsx` | Navigation breadcrumb component |
| `Skeleton` | `components/ui/skeleton.tsx` | Loading skeleton with `ProductCardSkeleton` and `ProductDetailSkeleton` |
| `ThemeToggle` | `components/ui/theme-toggle.tsx` | Dark/light mode toggle button |
| `Container` | `components/layout/container.tsx` | Responsive container (sm/md/lg/xl/full) |
| `Section` | `components/layout/section.tsx` | Section wrapper with variant and spacing options |
| `Navbar` | `components/navigation/navbar.tsx` | Main navigation bar with desktop dropdowns, mobile menu, cart/account icons |
| `Footer` | `components/layout/footer.tsx` | Site footer with navigation, newsletter, legal links |
| `CartDrawer` | `components/cart/cart-drawer.tsx` | Slide-in cart panel with item management |
| `ProductCard` | `components/product/product-card.tsx` | Product card with image, badge, wishlist toggle, rating |
| `ProductDetail` | `components/product/product-detail.tsx` | Full product detail with gallery, selectors, sticky CTA |
| `HeroBanner` | `components/sections/hero-banner.tsx` | Hero section with CTA buttons and FeatureGrid |
| `ProductForm` | `components/admin/product-form.tsx` | Admin product create/edit form |
| `AuthProvider` | `components/providers/session-provider.tsx` | NextAuth SessionProvider wrapper |
| `ThemeProvider` | `components/providers/theme-provider.tsx` | next-themes ThemeProvider wrapper |

### Animation Components (`lib/animations.tsx`)

- `FadeIn` — opacity fade-in
- `FadeInUp` — fade-in with upward slide
- `StaggerContainer` — staggered children animation
- `ScaleIn` — scale-in animation
- `ScrollReveal` — viewport-triggered fade-in-up
- `HoverScale` — hover scale effect

All respect `prefers-reduced-motion`.

---

## 8. Environment & Config

### Environment Variables (from `.env.example`)

| Variable | Purpose | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string for Prisma | `postgresql://postgres:postgres@localhost:5432/maison_tunis?schema=public` |
| `NEXTAUTH_URL` | NextAuth base URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth JWT signing secret (32+ chars) | (required) |
| `JWT_SECRET` | Fallback JWT secret | (required) |
| `NEXT_PUBLIC_API_URL` | Public API base URL for client requests | `/api` |
| `STITCH_API_KEY` | Stitch design tool API key (referenced in `opencode.json`) | (optional, dev tooling) |

### Build & Dev Scripts (from `package.json`)

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Start development server |
| `build` | `prisma generate && next build` | Generate Prisma client + production build |
| `start` | `next start` | Start production server |
| `lint` | `tsc --noEmit` | TypeScript type checking (no ESLint) |
| `db:generate` | `prisma generate` | Generate Prisma client only |
| `db:migrate` | `prisma migrate dev` | Run Prisma migrations in dev |
| `db:seed` | `prisma db seed` | Seed database (runs `tsx prisma/seed.ts`) |
| `db:push` | `prisma db push` | Push schema without migration history |

### Build Configuration (`next.config.mjs`)

```javascript
{
  turbopack: { root: projectRoot },
  images: { unoptimized: true }  // No Next.js image optimization
}
```

---

## 9. Known Gaps / TODOs

### `console.log` Debug Leftovers

| File | Line | Content |
|---|---|---|
| `app/api/contact/route.ts` | 10 | `console.log('Contact form submission:', data)` — Contact form only logs to console; no email/DB persistence |
| `prisma/seed.ts` | 227, 234, 240, 266, 301 | Multiple `console.log` calls in seed script (acceptable for CLI tooling) |

### Incomplete / Stub Features

1. **Contact Form** (`app/api/contact/route.ts`): Validates input but only logs to console. No email sending, no database storage. The frontend shows a success response, but the message is not persisted anywhere.

2. **Newsletter Subscription** (`components/layout/footer.tsx`, `app/page.tsx`): Client-side only; sets a `subscribed` boolean state. No backend endpoint, no email list integration.

3. **Admin Pages** — Several admin pages exist as route stubs with no substantial content beyond layout:
   - `app/admin/analytics/page.tsx`
   - `app/admin/inventory/page.tsx`
   - `app/admin/settings/page.tsx`
   - `app/admin/support/page.tsx`

4. **Payment Processing**: The checkout flow accepts "credit card", "PayPal", or "bank transfer" as radio options, but no actual payment gateway integration exists. The order is created with `paymentMethod` stored as a string.

5. **Static Info Pages** (`app/pages/[slug]/page.tsx`): The footer links to `/pages/shipping`, `/pages/returns`, `/pages/faq`, `/pages/blog`, `/pages/careers`, `/pages/press`, `/pages/privacy`, `/pages/terms`, `/pages/cookies`. These are handled by a single dynamic `[slug]` route, but the actual content for these pages was not verified — they may render placeholder content.

6. **Image Optimization Disabled**: `next.config.mjs` sets `images: { unoptimized: true }`, meaning all images are served as-is without Next.js image optimization (resizing, format conversion). This may be intentional for development or a specific hosting setup.

7. **No Test Suite**: No testing framework is installed. No test files were found. The `lint` script only runs `tsc --noEmit` (type checking), with no ESLint or Prettier configuration.

8. **`axios` Dependency Unused**: Listed in `package.json` but not imported in any source file. All HTTP requests use the native `fetch` API via the custom `ApiClient` class in `lib/api.ts`.

9. **Hardcoded Cart Drawer State**: The `CartDrawer` component has a local `isOpen` state that duplicates the Zustand `cartDrawerOpen` state, which could lead to synchronization issues.

10. **Seed Data Fallback**: In `prisma/seed.ts`, when `TOP_UP_TEMPLATES` don't have enough entries for a given gender × category combination, generic placeholder products are generated with template names like `"MEN Evening Wear Piece 1"`.

---

*Report generated from source code analysis of the MAISON TUNIS codebase. All data extracted from actual files — no assumptions or generic descriptions.*
