# 🏡 EstateX --- Premium Real Estate Platform

A production-style, premium real-estate marketplace built with
**Next.js + NestJS + PostgreSQL**, designed to be developed efficiently
with **Cursor AI**.

The goal is not to build a simple CRUD demo. The goal is to create a
portfolio-grade application with a polished UI, scalable architecture,
secure APIs, advanced property search, agent workflows, maps, favorites,
inquiries, scheduling, and production deployment.

---

## 1. Product Vision

### Core User Journey

```text
Landing Page
    ↓
Search Properties
    ↓
Apply Filters
    ↓
Browse Property Cards
    ↓
Open Property Details
    ↓
Gallery + Amenities + Map
    ↓
Favorite / Compare
    ↓
Contact Agent
    ↓
Schedule Visit
```

### Main User Types

1. **Guest**

- Browse properties
- Search and filter
- View property details
- View agents
- View map locations
- Register/login

1. **Buyer / User**

- Everything a guest can do
- Save favorites
- Compare properties
- Contact agents
- Send inquiries
- Schedule property visits
- Manage profile

1. **Agent**

- Manage profile
- Create properties
- Edit properties
- Delete/archive properties
- Upload property images
- Manage inquiries
- Manage visit requests
- View basic analytics

1. **Admin**

- Manage users
- Manage agents
- Manage properties
- Moderate listings
- Manage inquiries
- View platform analytics
- Manage featured properties

---

# 2. Final Tech Stack

## Frontend

- Next.js latest stable App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide Icons
- React Hook Form
- Zod
- TanStack Query
- Zustand where global client state is useful
- Leaflet + React Leaflet for maps
- Sonner for notifications
- Recharts for dashboards
- next/image for optimized images

## Backend

- NestJS
- TypeScript
- REST API
- Prisma ORM
- JWT authentication
- Refresh token flow
- bcrypt/argon2 for password hashing
- class-validator
- class-transformer
- Swagger/OpenAPI
- Helmet
- CORS
- Rate limiting
- Structured logging

## Database

- PostgreSQL
- Prisma ORM
- PostgreSQL indexes
- Full-text/search-friendly database design
- UUID primary keys

## File Storage

Recommended:

- Cloudinary for property images

Alternative:

- AWS S3 / Cloudflare R2

Never store large production images directly inside the backend
filesystem.

## Maps

Recommended:

- Leaflet
- OpenStreetMap-compatible tile provider

Alternative:

- Google Maps API

## Deployment

Frontend:

- Vercel

Backend:

- Railway / Render / Fly.io

Database:

- Neon / Supabase PostgreSQL / Railway PostgreSQL

Images:

- Cloudinary

Repository:

- GitHub

CI/CD:

- GitHub Actions

---

# 3. Architecture

```text
estatex/
│
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── properties/
│   │   │   │   ├── agents/
│   │   │   │   └── about/
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── forgot-password/
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   ├── favorites/
│   │   │   ├── compare/
│   │   │   └── properties/[slug]/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── property/
│   │   │   ├── search/
│   │   │   ├── map/
│   │   │   ├── agent/
│   │   │   └── layout/
│   │   │
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   └── public/
│   │
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── agents/
│       │   ├── properties/
│       │   ├── favorites/
│       │   ├── inquiries/
│       │   ├── visits/
│       │   ├── uploads/
│       │   ├── admin/
│       │   ├── analytics/
│       │   ├── common/
│       │   ├── prisma/
│       │   ├── app.module.ts
│       │   └── main.ts
│       │
│       └── test/
│
├── packages/
│   ├── types/
│   └── config/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── database.md
│
├── .env.example
├── docker-compose.yml
├── package.json
├── turbo.json
└── README.md
```

### Recommended Monorepo

Use **npm + Turborepo** if comfortable with monorepos.

If the project needs to stay simpler, use:

```text
client/
server/
```

The architecture matters more than the monorepo tooling.

---

# 4. Database Design

Use PostgreSQL with Prisma.

## Main Entities

```text
User
AgentProfile
Property
PropertyImage
Amenity
PropertyAmenity
Favorite
Inquiry
Visit
PropertyView
Notification
```

## User

```text
User
- id
- name
- email
- passwordHash
- phone
- avatar
- role
- isActive
- createdAt
- updatedAt
```

Roles:

```text
USER
AGENT
ADMIN
```

## AgentProfile

```text
AgentProfile
- id
- userId
- bio
- agencyName
- licenseNumber
- experienceYears
- specialties
- socialLinks
- createdAt
- updatedAt
```

## Property

```text
Property
- id
- agentId
- title
- slug
- description
- price
- propertyType
- listingType
- bedrooms
- bathrooms
- area
- areaUnit
- furnishedStatus
- constructionStatus
- address
- city
- state
- country
- latitude
- longitude
- status
- featured
- createdAt
- updatedAt
```

### Property Types

```text
HOUSE
APARTMENT
VILLA
CONDO
TOWNHOUSE
LAND
COMMERCIAL
OFFICE
PENTHOUSE
```

### Listing Types

```text
SALE
RENT
```

### Construction Status

```text
READY_TO_MOVE
UNDER_CONSTRUCTION
```

### Furnished Status

```text
FURNISHED
SEMI_FURNISHED
UNFURNISHED
```

### Property Status

```text
DRAFT
PENDING_REVIEW
PUBLISHED
SOLD
RENTED
ARCHIVED
```

## PropertyImage

```text
PropertyImage
- id
- propertyId
- url
- publicId
- altText
- sortOrder
- isPrimary
- createdAt
```

## Amenity

```text
Amenity
- id
- name
- icon
```

## PropertyAmenity

Many-to-many relationship:

```text
Property
    ↕
PropertyAmenity
    ↕
Amenity
```

Examples:

```text
Parking
Swimming Pool
Gym
Garden
Security
Balcony
Elevator
Air Conditioning
Furnished
Backup Generator
```

## Favorite

```text
Favorite
- id
- userId
- propertyId
- createdAt
```

Add a unique constraint:

```text
(userId, propertyId)
```

This prevents duplicate favorites.

## Inquiry

```text
Inquiry
- id
- propertyId
- userId
- agentId
- name
- email
- phone
- preferredVisitDate
- message
- status
- createdAt
```

Inquiry statuses:

```text
NEW
CONTACTED
IN_PROGRESS
CLOSED
```

## Visit

```text
Visit
- id
- propertyId
- userId
- agentId
- scheduledAt
- status
- notes
- createdAt
- updatedAt
```

Statuses:

```text
REQUESTED
CONFIRMED
CANCELLED
COMPLETED
```

## Notification

```text
Notification
- id
- userId
- type
- title
- message
- isRead
- createdAt
```

---

# 5. API Module Breakdown

NestJS should be organized by business domain.

## AuthModule

Responsibilities:

- Register
- Login
- Logout
- Refresh access token
- Get current user
- Password hashing
- Role authorization

Endpoints:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

## UsersModule

```text
GET    /api/users/me
PATCH  /api/users/me
PATCH  /api/users/me/password
```

## AgentsModule

```text
GET    /api/agents
GET    /api/agents/:id
GET    /api/agents/:id/properties
PATCH  /api/agents/profile
```

## PropertiesModule

```text
GET    /api/properties
GET    /api/properties/:slug
POST   /api/properties
PATCH  /api/properties/:id
DELETE /api/properties/:id
POST   /api/properties/:id/publish
POST   /api/properties/:id/archive
```

## Search

```text
GET /api/properties?search=villa
GET /api/properties?city=Karachi
GET /api/properties?minPrice=100000
GET /api/properties?maxPrice=500000
GET /api/properties?bedrooms=3
GET /api/properties?bathrooms=2
GET /api/properties?propertyType=VILLA
GET /api/properties?listingType=SALE
GET /api/properties?furnishedStatus=FURNISHED
GET /api/properties?constructionStatus=READY_TO_MOVE
```

Support:

```text
page
limit
sort
order
```

Example:

```text
GET /api/properties?
city=Karachi
&minPrice=100000
&maxPrice=500000
&bedrooms=3
&propertyType=VILLA
&page=1
&limit=12
&sort=createdAt
&order=desc
```

## FavoritesModule

```text
POST   /api/favorites/:propertyId
DELETE /api/favorites/:propertyId
GET    /api/favorites
GET    /api/favorites/check/:propertyId
```

## InquiriesModule

```text
POST /api/inquiries
GET  /api/inquiries/my
GET  /api/inquiries/agent
PATCH /api/inquiries/:id/status
```

## VisitsModule

```text
POST /api/visits
GET  /api/visits/my
GET  /api/visits/agent
PATCH /api/visits/:id/status
```

## UploadsModule

Responsibilities:

- Image validation
- File size validation
- MIME validation
- Cloudinary upload
- Image deletion
- Image ordering

Never trust the filename or MIME type sent by the client.

---

# 6. Frontend Page Architecture

## Public Pages

```text
/
 /properties
 /properties/[slug]
 /agents
 /agents/[id]
 /about
 /contact
```

## Authentication Pages

```text
/login
/register
/forgot-password
/reset-password
```

## User Pages

```text
/dashboard
/dashboard/profile
/dashboard/favorites
/dashboard/inquiries
/dashboard/visits
/dashboard/settings
```

## Agent Pages

```text
/agent
/agent/properties
/agent/properties/new
/agent/properties/[id]/edit
/agent/inquiries
/agent/visits
/agent/analytics
/agent/profile
```

## Admin Pages

```text
/admin
/admin/users
/admin/agents
/admin/properties
/admin/inquiries
/admin/analytics
```

---

# 7. Premium UI/UX Direction

The UI should feel like a modern real-estate SaaS/product, not a basic
Bootstrap CRUD application.

## Visual Direction

Use:

- Large editorial typography
- Spacious layouts
- Premium property photography
- Rounded cards
- Soft borders
- Subtle shadows
- Smooth hover states
- Elegant transitions
- Clean iconography
- Strong visual hierarchy
- Responsive layouts
- Skeleton loading states
- Empty states
- Toast notifications

Avoid:

- Excessive gradients
- Random colors
- Huge text everywhere
- Overloaded dashboards
- Too many animations
- Generic template-looking UI

## Suggested Design System

```text
Primary:
Deep charcoal / dark neutral

Accent:
Warm gold / emerald / premium real-estate accent

Background:
Off-white / light neutral

Cards:
White with subtle border

Typography:
Modern sans-serif

Radius:
12px - 20px

Spacing:
Consistent 4/8px spacing system
```

Do not hardcode the same values everywhere. Create reusable design
tokens.

---

# 8. Home Page Sections

Recommended order:

```text
1. Navbar
2. Hero Section
3. Search Bar
4. Featured Properties
5. Property Categories
6. Why Choose Us
7. Featured Agents
8. Latest Listings
9. Market/Stats Section
10. Testimonials
11. CTA
12. Footer
```

Hero concept:

```text
Find a place you'll love.

Discover premium homes, apartments,
villas and commercial spaces.

[Buy] [Rent]

Location
Property Type
Price
Bedrooms

[Search Properties]
```

---

# 9. Property Listing UI

Property cards should show:

```text
Image
Favorite button
Featured badge
Property type
Price
Title
Location
Bedrooms
Bathrooms
Area
Agent
View Details
```

Card interactions:

- Image hover
- Favorite animation
- Quick view
- View details
- Compare button

---

# 10. Property Details Page

Structure:

```text
Breadcrumb
Property Header
Image Gallery
Price + Basic Information
Description
Amenities
Property Details
Map
Nearby Places
Agent Card
Inquiry Form
Schedule Visit
Similar Properties
```

Property header:

```text
Luxury Modern Villa
Karachi, Pakistan

$350,000

4 Beds
3 Baths
2,500 sqft

[Contact Agent]
[Schedule Visit]
[♡ Save]
[Compare]
```

---

# 11. Advanced Search

Search should support:

- Keyword
- Location
- City
- Property type
- Listing type
- Minimum price
- Maximum price
- Bedrooms
- Bathrooms
- Minimum area
- Maximum area
- Furnished status
- Construction status
- Amenities
- Featured properties

## Search UX

Desktop:

```text
Search bar
+
Filter sidebar
+
Property grid
+
Optional map panel
```

Mobile:

```text
Search bar
Filter button
Property cards
Bottom-sheet filters
```

Add URL-based filter state:

```text
/properties?city=Karachi&minPrice=100000&bedrooms=3
```

This makes search shareable and SEO-friendly.

---

# 12. Pagination

Use server-side pagination.

Response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 120,
    "totalPages": 10
  }
}
```

Do not load every property into the browser.

---

# 13. Maps

Use Leaflet.

Property details:

```text
Property coordinates
        ↓
Interactive map
        ↓
Marker
        ↓
Popup with property title
```

Search page:

```text
Properties List
        +
Interactive Map
```

For privacy and security, consider displaying an approximate location on
public listing pages instead of exposing a private residential address
when the business requirement does not need exact coordinates.

---

# 14. Authentication Architecture

Recommended flow:

```text
Register
   ↓
Hash password
   ↓
Create user
   ↓
Login
   ↓
Issue access token
   ↓
Issue refresh token
   ↓
Access protected APIs
```

Use:

```text
Short-lived access token
+
Rotating refresh token
```

For a production application, prefer secure, HTTP-only cookies for
refresh-token storage.

Never:

```text
localStorage.setItem("password", ...)
```

Never store plaintext passwords.

---

# 15. Authorization

Use NestJS guards.

Example roles:

```text
USER
AGENT
ADMIN
```

Rules:

```text
USER:
- favorites
- inquiries
- visits

AGENT:
- own properties
- own inquiries
- own visits

ADMIN:
- everything
```

Agents must never be able to edit another agent's property by simply
changing an ID in the request.

Authorization must check ownership on the backend.

---

# 16. Image Upload System

Flow:

```text
Next.js
   ↓
Upload UI
   ↓
Backend validation
   ↓
Cloudinary
   ↓
Image URL + public ID
   ↓
PostgreSQL
```

Validation:

```text
Allowed:
image/jpeg
image/png
image/webp

Maximum size:
5MB or business-defined limit

Maximum property images:
10-20
```

Add:

- Image preview
- Drag and drop
- Reordering
- Set primary image
- Delete image
- Upload progress
- Error handling

Use `next/image` for rendering.

---

# 17. Inquiry System

Inquiry form:

```text
Name
Email
Phone
Preferred Visit Date
Message

[Send Inquiry]
```

After submission:

```text
User
 ↓
POST /api/inquiries
 ↓
Validate DTO
 ↓
Store inquiry
 ↓
Notify agent
 ↓
Return success
```

Do not trust user-submitted `agentId` blindly. Derive the agent from the
selected property on the server.

---

# 18. Visit Scheduling

User selects:

```text
Date
Time
Message
```

Backend checks:

```text
Property exists
Agent exists
Time is valid
No conflicting booking
User is authenticated
```

Then:

```text
REQUESTED
    ↓
Agent reviews
    ↓
CONFIRMED
```

Allow:

```text
Cancel
Reschedule
Complete
```

---

# 19. Favorites

When user clicks the heart:

```text
POST /api/favorites/:propertyId
```

If already favorite:

```text
DELETE /api/favorites/:propertyId
```

Database constraint:

```text
unique(userId, propertyId)
```

This prevents duplicate favorites.

---

# 20. Property Comparison

Bonus feature.

Users can compare 2-4 properties.

Compare:

```text
Price
Property Type
Bedrooms
Bathrooms
Area
Furnished
Construction Status
Amenities
Location
```

UI:

```text
Property A | Property B | Property C
-------------------------------------
Price
Bedrooms
Bathrooms
Area
Amenities
```

Use Zustand or URL state for temporary comparison selection.

---

# 21. Agent Dashboard

Dashboard overview:

```text
Total Properties
Published
Pending
Total Inquiries
Upcoming Visits
Profile Views
```

Charts:

```text
Property Views
Inquiries
Visit Requests
Listing Performance
```

Property management:

```text
[+ Add Property]

Property
Status
Views
Inquiries
Created
Actions
```

Actions:

```text
Edit
Preview
Archive
Delete
```

---

# 22. Admin Dashboard

Admin metrics:

```text
Total Users
Total Agents
Total Properties
Published Properties
Pending Properties
Total Inquiries
Visits
```

Admin can:

```text
Approve listings
Reject listings
Suspend users
Manage agents
Manage properties
View platform analytics
```

---

# 23. SEO

Use Next.js metadata.

Every property should have:

```text
Title
Description
Canonical URL
Open Graph image
```

Example concept:

```text
Luxury Villa in Karachi | EstateX
```

Generate dynamic metadata for:

```text
/properties/[slug]
```

Add:

- sitemap
- robots.txt
- Open Graph
- Twitter metadata
- structured data where appropriate

---

# 24. Performance

Frontend:

- Server Components where appropriate
- Dynamic imports for heavy client components
- Image optimization
- Lazy loading
- Skeleton loading
- Avoid unnecessary global state
- TanStack Query caching

Backend:

- Database indexes
- Pagination
- Select only required fields
- Avoid N+1 queries
- Cache expensive queries when justified
- Rate limit public endpoints

Database indexes should cover common filters such as:

```text
city
price
propertyType
listingType
bedrooms
status
createdAt
agentId
```

Do not add indexes blindly. Verify actual query patterns.

---

# 25. Security Checklist

Backend:

- DTO validation
- Helmet
- CORS configuration
- Rate limiting
- Password hashing
- JWT validation
- Role guards
- Ownership checks
- File validation
- SQL injection protection through Prisma
- Input sanitization where needed
- Secure cookies
- Environment variables
- No secrets in Git

Frontend:

- Do not expose server secrets
- Do not trust client role checks
- Handle expired sessions
- Avoid rendering unsanitized HTML
- Validate forms with Zod

---

# 26. Environment Variables

Example:

```env
# Database
DATABASE_URL=

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend
NEXT_PUBLIC_API_URL=

# Maps
NEXT_PUBLIC_MAP_TILE_URL=
```

Never commit `.env`.

Commit:

```text
.env.example
```

---

# 27. Development Phases

The project should be developed in phases.

Do not ask Cursor to build the entire application in one giant prompt.

---

## PHASE 0 --- Project Planning

### Goal

Finalize architecture before writing production code.

Tasks:

- Define requirements
- Define roles
- Define database entities
- Define API modules
- Define page structure
- Define design system
- Define coding conventions

Deliverables:

```text
docs/architecture.md
docs/database.md
docs/api.md
```

### Cursor Task

Tell Cursor to analyze the project requirements and create the
architecture documents before implementation.

---

# PHASE 1 --- Project Setup

### Goal

Create the base project.

Tasks:

- Initialize Next.js
- Initialize NestJS
- Configure TypeScript
- Configure ESLint
- Configure Prettier
- Configure Tailwind
- Configure shadcn/ui
- Configure Prisma
- Configure PostgreSQL
- Configure environment files
- Configure Git
- Create base folder structure

Definition of Done:

```text
Frontend runs
Backend runs
Database connects
Prisma works
Lint works
Build works
```

---

# PHASE 2 --- Database & Prisma

### Goal

Create production-ready database models.

Tasks:

- Prisma schema
- User
- AgentProfile
- Property
- PropertyImage
- Amenity
- PropertyAmenity
- Favorite
- Inquiry
- Visit
- Notification

Then:

```text
prisma migrate dev
prisma generate
```

Add:

- relations
- enums
- indexes
- unique constraints

Seed database with realistic demo data.

Definition of Done:

```text
Migration succeeds
Seed succeeds
Relations work
Queries work
Indexes exist
```

---

# PHASE 3 --- Authentication

### Goal

Build secure authentication.

Tasks:

- Register
- Login
- Logout
- Refresh token
- Current user
- Password hashing
- JWT strategy
- Auth guards
- Role guards
- User profile

Frontend:

```text
/login
/register
/dashboard/profile
```

Definition of Done:

```text
User can register
User can login
Session persists
Protected APIs reject unauthenticated users
Roles are enforced
```

---

# PHASE 4 --- Design System & Premium UI

### Goal

Create reusable premium UI components before building every page.

Components:

```text
Button
Input
Select
Textarea
Dialog
Dropdown
Tabs
Badge
Card
Avatar
Tooltip
Skeleton
Toast
Pagination
Sheet
Drawer
Modal
Breadcrumb
```

Property-specific:

```text
PropertyCard
PropertyGrid
PropertyGallery
PropertyPrice
PropertyStats
AmenityList
AgentCard
FavoriteButton
CompareButton
```

Create:

```text
PageContainer
SectionHeading
EmptyState
LoadingState
ErrorState
```

Definition of Done:

All pages should use shared components instead of repeated custom
markup.

---

# PHASE 5 --- Landing Page

### Goal

Build a premium homepage.

Sections:

```text
Navbar
Hero
Search
Featured Properties
Categories
Why Choose Us
Agents
Latest Properties
Testimonials
CTA
Footer
```

Focus heavily on:

- Responsive design
- Typography
- Images
- spacing
- visual hierarchy
- micro-interactions

Definition of Done:

The page looks like a real commercial product, not a coding tutorial.

---

# PHASE 6 --- Property CRUD

### Goal

Build the complete property lifecycle.

Backend:

```text
Create
Read
Update
Delete
Publish
Archive
```

Frontend:

```text
Property list
Property details
Create form
Edit form
Delete confirmation
```

Agent ownership must be enforced.

---

# PHASE 7 --- Image Management

### Goal

Implement production-ready property image management.

Features:

- Upload
- Preview
- Delete
- Reorder
- Primary image
- Validation
- Cloudinary integration

Definition of Done:

Agent can completely manage property images.

---

# PHASE 8 --- Search & Filtering

### Goal

Build advanced property search.

Backend:

```text
Keyword
Location
Price
Bedrooms
Bathrooms
Area
Property Type
Listing Type
Furnished Status
Construction Status
Amenities
Pagination
Sorting
```

Frontend:

```text
Search bar
Filter sidebar
Mobile filter drawer
Sort dropdown
Pagination
Result count
Clear filters
```

Store filters in URL query parameters.

Definition of Done:

A user can copy the URL and another user sees the same search state.

---

# PHASE 9 --- Property Details

### Goal

Create the main conversion page.

Build:

```text
Gallery
Property information
Price
Amenities
Description
Map
Agent card
Inquiry form
Schedule visit
Similar properties
```

Add:

```text
Favorite
Compare
Share
```

---

# PHASE 10 --- Favorites

### Goal

Allow users to save properties.

Tasks:

- Favorite API
- Favorite button
- Favorite list
- Remove favorite
- Optimistic UI
- Empty state

Definition of Done:

Favorite state stays synchronized across listing cards and details
pages.

---

# PHASE 11 --- Inquiry System

### Goal

Connect buyers with agents.

Tasks:

- Inquiry DTO
- Inquiry API
- Form validation
- Database storage
- Agent inquiry dashboard
- Inquiry status

Definition of Done:

User sends inquiry → agent sees it.

---

# PHASE 12 --- Visit Scheduling

### Goal

Create appointment workflow.

Tasks:

- Date picker
- Time selection
- Availability validation
- Visit creation
- Agent confirmation
- Cancellation
- Rescheduling
- User visit history

---

# PHASE 13 --- Maps

### Goal

Add location intelligence.

Tasks:

- Property map
- Marker
- Search map
- Map/list layout
- Geolocation handling
- Nearby places

Keep map components client-side because map libraries generally depend
on browser APIs.

---

# PHASE 14 --- Agent Dashboard

### Goal

Build a professional agent workspace.

Pages:

```text
Overview
Properties
Add Property
Edit Property
Inquiries
Visits
Analytics
Profile
```

Include:

```text
Stats cards
Tables
Charts
Filters
Pagination
Empty states
Loading states
```

---

# PHASE 15 --- Admin Dashboard

### Goal

Create platform management.

Tasks:

- User management
- Agent management
- Property moderation
- Listing approval
- Inquiry monitoring
- Analytics

Protect every admin route on the backend.

---

# PHASE 16 --- SEO & Performance

Tasks:

- Metadata
- Dynamic property metadata
- Sitemap
- Robots
- Open Graph
- Structured data
- Image optimization
- Lazy loading
- API caching
- Query optimization
- Database indexes

Run:

```text
npm run build
```

and fix all production build issues.

---

# PHASE 17 --- Testing

## Backend

Test:

```text
Auth
Properties
Favorites
Inquiries
Visits
Authorization
```

Use:

```text
Jest
Supertest
```

## Frontend

Test critical flows:

```text
Login
Search
Filter
Favorite
Property details
Inquiry
```

Use:

```text
Vitest
React Testing Library
Playwright
```

---

# PHASE 18 --- Production Hardening

Checklist:

```text
Error handling
Logging
Rate limiting
CORS
Security headers
Input validation
Upload validation
Database backups
Environment variables
404 handling
500 handling
API documentation
Health check
```

Add:

```text
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

---

# PHASE 19 --- Deployment

## Frontend

Deploy to:

```text
Vercel
```

## Backend

Deploy to:

```text
Railway
```

or:

```text
Render
```

## Database

Use:

```text
Neon
```

or:

```text
Supabase PostgreSQL
```

## Images

Use:

```text
Cloudinary
```

Deployment flow:

```text
GitHub
   ↓
CI
   ↓
Tests
   ↓
Build
   ↓
Deploy
```

---

# PHASE 20 --- Portfolio Polish

Before showing this project to clients/employers:

Add:

- Demo account
- Seeded properties
- Realistic images
- Clean README
- Architecture diagram
- API documentation
- Screenshots
- Feature list
- Tech stack
- Deployment link
- GitHub link
- Performance notes

The project should answer:

```text
What problem does it solve?
How is it architected?
How is it secured?
How does search work?
How does authorization work?
How does image upload work?
How does it scale?
```

---

# 28. Bonus Features --- After MVP

Do not start with these.

Build the core system first.

## Priority 1

- Property comparison
- Advanced agent analytics
- Price-drop notifications
- Saved searches
- Email notifications

## Priority 2

- AI property recommendations
- Mortgage calculator
- Property valuation estimator
- Nearby places
- Market price trends

## Priority 3

- Live chat
- Video walkthrough
- Virtual tour
- PWA
- Real-time notifications

---

# 29. AI Property Recommendations

Later, recommendation logic can use:

```text
User favorites
Search history
Viewed properties
Budget
Location
Property type
Bedrooms
Amenities
```

Simple first version:

```text
User preferences
      ↓
Weighted scoring
      ↓
Recommended properties
```

Do not introduce an LLM before a reliable deterministic recommendation
system exists.

---

# 30. Mortgage / EMI Calculator

Inputs:

```text
Property Price
Down Payment
Loan Amount
Interest Rate
Loan Tenure
```

Outputs:

```text
Monthly Payment
Total Interest
Total Payment
```

Keep the calculator clearly labeled as an estimate, not financial
advice.

---

# 31. Recommended API Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

List:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 120,
    "totalPages": 10
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Property not found",
  "code": "PROPERTY_NOT_FOUND"
}
```

Keep API response shapes consistent.

---

# 32. Error Handling

Frontend states:

```text
Loading
Success
Empty
Error
Retry
```

Backend:

Use NestJS exception filters and meaningful HTTP status codes.

Examples:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests
500 Internal Server Error
```

Never expose stack traces in production responses.

---

# 33. Cursor AI Development Strategy

Cursor should be treated as an implementation assistant, not as the
architect.

The workflow should be:

```text
Plan
 ↓
Small task
 ↓
Cursor implementation
 ↓
Review diff
 ↓
Run tests
 ↓
Fix issues
 ↓
Commit
 ↓
Next task
```

Do not ask:

```text
Build the entire real estate platform.
```

Instead ask:

```text
Implement the Property Prisma model and migration based on docs/database.md.
Do not modify unrelated modules.
Add appropriate indexes and constraints.
Run Prisma validation and explain the changes.
```

This keeps the codebase predictable.

---

# 34. Cursor Rules

Create:

```text
.cursor/
```

Recommended files:

```text
.cursor/rules/
├── architecture.mdc
├── frontend.mdc
├── backend.mdc
├── database.mdc
├── security.mdc
└── testing.mdc
```

## Architecture Rule

Cursor should:

- Follow existing architecture
- Avoid unnecessary dependencies
- Avoid duplicate utilities
- Prefer reusable modules
- Keep business logic out of controllers
- Keep API contracts consistent

## Frontend Rule

Cursor should:

- Use TypeScript
- Prefer Server Components where appropriate
- Use client components only when necessary
- Use reusable UI components
- Use React Hook Form + Zod
- Use TanStack Query for server state
- Avoid unnecessary `useEffect`
- Avoid prop drilling where a better pattern exists

## Backend Rule

Cursor should:

- Use NestJS modules
- Keep controllers thin
- Put business logic in services
- Use DTOs
- Validate all input
- Use guards for authorization
- Check ownership
- Use Prisma services cleanly

## Database Rule

Cursor should:

- Use Prisma
- Use UUID IDs
- Add appropriate constraints
- Add indexes based on query patterns
- Avoid destructive migrations unless explicitly requested
- Never expose passwords

---

# 35. Master Cursor Prompt

Use this at the beginning of the project:

```text
You are a senior full-stack software architect and implementation engineer.

We are building a production-style premium real estate platform called EstateX.

Tech stack:

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- Zustand only when necessary
- Leaflet

Backend:
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Secure refresh-token architecture
- class-validator
- Swagger

Storage:
- Cloudinary

Deployment:
- Vercel frontend
- Railway/Render backend
- PostgreSQL hosted database

Architecture requirements:
- Modular
- Maintainable
- Secure
- Production-ready
- Strong typing
- Reusable components
- Clean API contracts
- Proper error handling
- Proper authorization
- No unnecessary dependencies

UI requirements:
- Premium modern real-estate aesthetic
- Responsive
- Accessible
- Spacious
- High-quality typography
- Subtle animations
- Excellent empty/loading/error states
- No generic dashboard/template appearance

Important rules:
1. Do not build the whole project at once.
2. Work phase by phase.
3. Before coding, inspect the existing project.
4. Read relevant documentation.
5. Make the smallest correct change.
6. Do not modify unrelated files.
7. Explain important architectural decisions.
8. Run lint/typecheck/tests after meaningful changes.
9. Never hardcode secrets.
10. Never trust client-side authorization.
11. Always enforce ownership on the backend.
12. Use reusable components.
13. Avoid duplicate logic.
14. Prefer simple production-ready solutions over unnecessary complexity.

Start by creating the project architecture and documentation.
Do not implement the full application yet.
```

---

# 36. Phase-Specific Cursor Prompt Pattern

Use this format for every phase:

```text
We are currently working on PHASE X.

Read:
- README.md
- relevant docs
- existing source code
- Cursor rules

Goal:
[exact goal]

Tasks:
1. ...
2. ...
3. ...

Constraints:
- Do not modify unrelated modules.
- Follow existing architecture.
- Use TypeScript.
- Add validation.
- Add tests where appropriate.

Definition of Done:
- ...
- ...
- ...

After implementation:
1. Run typecheck.
2. Run lint.
3. Run tests.
4. Report changed files.
5. Report any remaining issues.

Do not start the next phase.
```

---

# 37. Git Strategy

Use small commits.

Examples:

```text
chore: initialize monorepo
feat(db): add prisma schema
feat(auth): implement registration
feat(auth): implement login
feat(auth): add refresh token flow
feat(ui): add design system
feat(home): build landing page
feat(properties): add property CRUD
feat(properties): add image uploads
feat(search): add advanced property filters
feat(favorites): add favorite system
feat(inquiries): add inquiry workflow
feat(visits): add visit scheduling
feat(maps): integrate property maps
feat(agent): build agent dashboard
feat(admin): build admin dashboard
test(api): add property tests
chore: production hardening
chore: deploy application
```

Avoid huge commits like:

```text
final project done
```

---

# 38. Definition of Done

A feature is not finished when the UI appears.

A feature is finished when:

```text
UI works
API works
Validation works
Authorization works
Loading state works
Error state works
Empty state works
Mobile UI works
Database query is correct
Tests pass
TypeScript passes
Lint passes
No console errors
```

---

# 39. MVP Scope

For the first production-ready version, prioritize:

```text
✅ Authentication
✅ User profile
✅ Agent profile
✅ Property CRUD
✅ Property images
✅ Property listing
✅ Property details
✅ Advanced filters
✅ Pagination
✅ Favorites
✅ Inquiry system
✅ Visit scheduling
✅ Maps
✅ Agent dashboard
✅ Admin moderation
✅ Responsive UI
✅ SEO
✅ Deployment
```

Do not delay MVP for:

```text
❌ AI recommendations
❌ Live chat
❌ VR
❌ Complex analytics
❌ PWA
```

---

# 40. Final Build Order

The recommended implementation order is:

```text
1. Planning
2. Repository setup
3. Database
4. Authentication
5. Design system
6. Landing page
7. Property CRUD
8. Image uploads
9. Property listings
10. Search/filter
11. Property details
12. Favorites
13. Inquiries
14. Visit scheduling
15. Maps
16. Agent dashboard
17. Admin dashboard
18. SEO
19. Performance
20. Testing
21. Security hardening
22. Deployment
23. Portfolio polish
24. Bonus features
```

---

# 41. Final Quality Target

The final application should feel like a real SaaS/product rather than a
tutorial project.

A recruiter or client should be able to see:

```text
Premium UI
+
Strong UX
+
Scalable architecture
+
Secure authentication
+
Role-based authorization
+
PostgreSQL data modeling
+
Advanced search
+
Image management
+
Maps
+
Agent workflow
+
Admin workflow
+
Testing
+
Deployment
```

That combination makes the project a strong full-stack portfolio case
study.

---

# 42. One-Action Rule for Cursor

Never give Cursor a 20-feature task.

Give it one clear objective.

Bad:

```text
Build auth, properties, dashboard, maps and admin.
```

Good:

```text
Implement the Prisma Property model, migration, seed data and PropertyService.

Read docs/database.md first.

Do not implement controllers or frontend yet.

After implementation:
- run prisma validate
- run migration
- run seed
- run typecheck
- report changed files
```

Then move to the next task.

---

# 43. Success Criteria

The project is complete when:

```text
A guest can discover properties.
A user can register and save favorites.
A user can contact an agent.
A user can schedule a visit.
An agent can manage listings.
An agent can manage inquiries.
An admin can moderate the platform.
Properties have maps and galleries.
Search works with multiple filters.
The application is responsive.
The API is secure.
The database is indexed appropriately.
The application is deployed.
The codebase is documented.
The project looks premium.
```

---

# 44. Immediate Next Step

Start with:

```text
PHASE 0 — Project Planning
```

Then:

```text
PHASE 1 — Project Setup
```

Do not jump directly into property CRUD.

First establish:

```text
Architecture
+
Database
+
Authentication strategy
+
Design system
+
Cursor rules
```

Then build features incrementally.
