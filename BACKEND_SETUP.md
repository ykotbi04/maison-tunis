# MAISON TUNIS Backend Setup

Production backend for the MAISON TUNIS storefront: PostgreSQL, Prisma, Next.js App Router API routes, and Auth.js credentials sessions.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally or remotely
- npm (or pnpm)

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

Copy the example env file and edit values:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/maison_tunis?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-at-least-32-characters"
NEXT_PUBLIC_API_URL="/api"
```

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Create database

```bash
createdb maison_tunis
```

Or create the database through your PostgreSQL admin tool using the name in `DATABASE_URL`.

## 4. Generate Prisma client

```bash
npm run db:generate
```

## 5. Run migrations

```bash
npm run db:migrate
```

When prompted for a migration name, use:

```text
init
```

Alternative for local prototyping without migration history:

```bash
npm run db:push
```

## 6. Seed catalog and demo users

```bash
npm run db:seed
```

Seeded accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@maison-tunis.com` | `Admin123!` |
| Customer | `customer@maison-tunis.com` | `Customer123!` |

The seed is idempotent and safe to re-run.

## 7. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 8. Verify backend

### Products

```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products/eve-001
curl "http://localhost:3000/api/products?category=evening-wear"
curl "http://localhost:3000/api/products/search?query=silk&page=1&limit=24"
```

### Categories

```bash
curl http://localhost:3000/api/categories
curl http://localhost:3000/api/categories/evening-wear
```

### Auth

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Password123!\"}"

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@maison-tunis.com\",\"password\":\"Customer123!\"}" \
  -c cookies.txt
```

### Cart (authenticated)

Use the session cookie from login:

```bash
curl http://localhost:3000/api/cart -b cookies.txt
```

### Admin protection

- Visit `/admin` while logged out → redirected to `/login`
- Log in as customer → redirected away from `/admin`
- Log in as admin → dashboard loads

## Session strategy

Auth.js uses **JWT sessions** (not database sessions).

## API contract

All client requests go through `lib/api.ts` against relative `/api` routes. Error responses use:

```json
{ "error": "message", "details": {} }
```

## Troubleshooting

- **`PrismaClientInitializationError`**: confirm PostgreSQL is running and `DATABASE_URL` is correct.
- **`NEXTAUTH_SECRET` missing**: set it in `.env` and restart the dev server.
- **Empty shop page**: run `npm run db:seed` again.
- **Checkout requires login**: checkout persists orders for authenticated users only.
