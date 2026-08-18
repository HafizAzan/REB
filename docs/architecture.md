# EstateX Architecture

Premium real-estate marketplace. Modular NestJS API + Next.js App Router frontend, PostgreSQL via Prisma.

## Goals

- Portfolio-grade product, not a CRUD demo
- Secure auth, role-based access, ownership checks on the server
- Shareable search URLs, indexed queries, production-ready image flow
- Premium, spacious UI with reusable design tokens

## Repository layout

```text
estatex/
├── apps/
│   ├── web/          # Next.js App Router
│   └── api/          # NestJS REST API
├── packages/
│   ├── types/        # Shared enums + API contracts
│   └── config/       # Shared TSConfig
├── docs/
├── docker-compose.yml
└── .env.example
```

npm workspaces + Turborepo. Prisma lives in `apps/api/prisma`.

## Runtime topology

```text
Browser (Next.js :3000)
        │  credentials: include
        ▼
NestJS API (:4000)  /api/*
        │
        ├── PostgreSQL (:5432)
        └── Cloudinary (property images)
```

## User roles

| Role  | Capabilities |
| ----- | ------------ |
| GUEST | Browse, search, view details, view agents/maps, register |
| USER  | Favorites, compare, inquiries, visit scheduling, profile |
| AGENT | Own listings, images, inquiries, visits, basic analytics |
| ADMIN | Users, agents, listings, moderation, featured, analytics |

Authorization is enforced on the backend. Client role checks are UX only.

## Frontend conventions

- App Router, TypeScript, Tailwind, shadcn/ui
- Server Components by default; `"use client"` only for interactivity
- TanStack Query for server state
- React Hook Form + Zod for forms
- Zustand only for genuine client-global state (compare tray)
- Search filters live in URL query params
- `next/image` for all property photography
- Leaflet maps loaded via dynamic import

Route groups:

```text
app/(public)/     landing, properties, agents, about, contact
app/(auth)/       login, register, forgot/reset password
app/dashboard/    buyer profile, favorites, inquiries, visits
app/agent/        agent listings and workflows
app/admin/        moderation and platform analytics
```

## Backend conventions

- Feature modules by domain (`auth`, `users`, `agents`, `properties`, …)
- Thin controllers, business logic in services
- DTOs + `class-validator` on every write endpoint
- Guards: JWT, roles, resource ownership
- Global interceptor wraps success responses
- Global exception filter standardizes errors
- Helmet, CORS, rate limiting, structured logging
- Swagger at `/api/docs`

## Auth

- Argon2id password hashing
- Short-lived access JWT (15m) + rotating refresh token (7d)
- Refresh tokens stored hashed in PostgreSQL
- HTTP-only, Secure, SameSite cookies
- Logout revokes the current refresh token

## API contract

Success:

```json
{ "success": true, "data": {} }
```

Paginated list:

```json
{
  "success": true,
  "data": [],
  "meta": { "page": 1, "limit": 12, "total": 120, "totalPages": 10 }
}
```

Error:

```json
{ "success": false, "message": "Property not found", "code": "PROPERTY_NOT_FOUND" }
```

Never leak stack traces in production.

## Images

Next.js → backend validation (MIME, size, count) → Cloudinary → `PropertyImage` row with `url` + `publicId`. Never trust client MIME or filename. Max 5MB, jpeg/png/webp, 20 images per property.

## Search

All listing filters are query params on `GET /api/properties`. Server-side pagination. Indexes on `city`, `price`, `propertyType`, `listingType`, `bedrooms`, `status`, `createdAt`, `agentId`.

## Deployment

- Web: Vercel
- API: Railway / Render / Fly.io
- DB: Neon / Supabase / Railway PostgreSQL
- Images: Cloudinary
- CI: GitHub Actions
