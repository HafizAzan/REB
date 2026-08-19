# EstateX API

Base URL: `http://localhost:4000/api`  
Swagger: `http://localhost:4000/api/docs`  
Auth: HTTP-only cookies. Send `credentials: 'include'` from the web app.

## Envelope

Success: `{ "success": true, "data": T }`  
List: `{ "success": true, "data": T[], "meta": { page, limit, total, totalPages } }`  
Error: `{ "success": false, "message": string, "code": string }`

## Auth

| Method | Path | Auth | Notes |
| ------ | ---- | ---- | ----- |
| POST   | `/auth/register` | public | body: name, email, password, phone? Sends a 6-digit OTP. Account is created after verify. |
| POST   | `/auth/login` | public | password login. Unverified accounts return `next: verify_email` and send OTP. Verified accounts set cookies. |
| POST   | `/auth/forgot-password` | public | body: email. Always succeeds. Sends OTP when the account exists. |
| POST   | `/auth/otp/resend` | public | body: email, purpose (`REGISTER` \| `LOGIN` \| `RESET_PASSWORD`) |
| POST   | `/auth/otp/verify` | public | body: email, purpose, code. Register/login issue cookies. Reset returns a one-time `resetToken`. |
| POST   | `/auth/reset-password` | public | body: email, resetToken, password. Revokes refresh sessions. |
| POST   | `/auth/refresh` | refresh cookie | rotates refresh token |
| POST   | `/auth/logout` | refresh cookie | revokes token, clears cookies |
| GET    | `/auth/me` | access cookie | current user without password |

OTP codes expire in 10 minutes, are hashed at rest, and are limited to 5 attempts. Resend cooldown is 60 seconds. Register defaults to `USER`. Agent/admin promotion is admin-only. In non-production, OTP responses may include `devOtp` for local testing.

## Users

| Method | Path | Auth |
| ------ | ---- | ---- |
| GET    | `/users/me` | USER+ | current profile |
| PATCH  | `/users/me` | USER+ | body: name?, phone?, avatar? |
| PATCH  | `/users/me/password` | USER+ | body: currentPassword, newPassword. Rotates session cookies. |
| POST   | `/users/me/email` | USER+ | body: email, password. Sends OTP to the new address. |
| POST   | `/users/me/email/resend` | USER+ | body: email |
| POST   | `/users/me/email/verify` | USER+ | body: email, code. Updates email and rotates session cookies. |

## Agents

| Method | Path | Auth |
| ------ | ---- | ---- |
| GET    | `/agents` | public |
| GET    | `/agents/:id` | public |
| GET    | `/agents/:id/properties` | public, published only |
| PATCH  | `/agents/profile` | AGENT |

## Properties

| Method | Path | Auth |
| ------ | ---- | ---- |
| GET    | `/properties` | public |
| GET    | `/properties/:slug` | public |
| POST   | `/properties` | AGENT |
| PATCH  | `/properties/:id` | owner AGENT or ADMIN |
| DELETE | `/properties/:id` | owner AGENT or ADMIN |
| POST   | `/properties/:id/publish` | owner → PENDING_REVIEW; ADMIN can PUBLISHED |
| POST   | `/properties/:id/archive` | owner or ADMIN |

### Query params (`GET /properties`)

`search`, `city`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `minArea`, `maxArea`, `propertyType`, `listingType`, `furnishedStatus`, `constructionStatus`, `featured`, `amenities` (comma-separated ids), `page` (default 1), `limit` (default 12, max 50), `sort` (`createdAt` \| `price` \| `area`), `order` (`asc` \| `desc`).

Public callers only receive `status=PUBLISHED`.

## Favorites

| Method | Path | Auth |
| ------ | ---- | ---- |
| POST   | `/favorites/:propertyId` | USER+ |
| DELETE | `/favorites/:propertyId` | USER+ |
| GET    | `/favorites` | USER+ |
| GET    | `/favorites/check/:propertyId` | USER+ |

Duplicate favorites are rejected by the unique constraint (409).

## Inquiries

| Method | Path | Auth |
| ------ | ---- | ---- |
| POST   | `/inquiries` | USER+ |
| GET    | `/inquiries/my` | USER+ |
| GET    | `/inquiries/agent` | AGENT |
| PATCH  | `/inquiries/:id/status` | owning AGENT or ADMIN |

`agentId` is derived from the property. Never trust a client-supplied agent id.

## Visits

| Method | Path | Auth |
| ------ | ---- | ---- |
| POST   | `/visits` | USER+ |
| GET    | `/visits/my` | USER+ |
| GET    | `/visits/agent` | AGENT |
| PATCH  | `/visits/:id/status` | owning agent, visitor (cancel), or ADMIN |

## Uploads

| Method | Path | Auth |
| ------ | ---- | ---- |
| POST   | `/uploads/properties/:id` | owner AGENT |
| PATCH  | `/uploads/properties/:id/reorder` | owner AGENT |
| DELETE | `/uploads/:imageId` | owner AGENT |

Validate MIME (jpeg/png/webp), size (≤5MB), and count (≤20) on the server.

## Admin

| Method | Path | Auth |
| ------ | ---- | ---- |
| GET    | `/admin/stats` | ADMIN |
| GET    | `/admin/users` | ADMIN |
| PATCH  | `/admin/users/:id` | ADMIN (role, isActive) |
| GET    | `/admin/properties` | ADMIN |
| POST   | `/admin/properties/:id/approve` | ADMIN |
| POST   | `/admin/properties/:id/reject` | ADMIN |
| PATCH  | `/admin/properties/:id/featured` | ADMIN |

## Status codes

`400` validation, `401` unauthenticated, `403` forbidden/ownership, `404` missing, `409` conflict, `422` semantic validation, `429` rate limit, `500` unexpected.

## Ownership

Agents must not edit another agent's listing by swapping IDs. Every mutating property/image/inquiry/visit handler loads the resource and compares `agentId` (or admin role).
