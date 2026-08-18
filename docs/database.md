# EstateX Database

PostgreSQL + Prisma. UUID primary keys. Passwords and refresh tokens are never selected in public queries.

## Enums

```text
Role                 USER | AGENT | ADMIN
PropertyType         HOUSE | APARTMENT | VILLA | CONDO | TOWNHOUSE | LAND | COMMERCIAL | OFFICE | PENTHOUSE
ListingType          SALE | RENT
ConstructionStatus   READY_TO_MOVE | UNDER_CONSTRUCTION
FurnishedStatus      FURNISHED | SEMI_FURNISHED | UNFURNISHED
PropertyStatus       DRAFT | PENDING_REVIEW | PUBLISHED | SOLD | RENTED | ARCHIVED
InquiryStatus        NEW | CONTACTED | IN_PROGRESS | CLOSED
VisitStatus          REQUESTED | CONFIRMED | CANCELLED | COMPLETED
AreaUnit             SQFT | SQM | MARLA | KANAL
```

## Models

### User

| Field        | Notes                          |
| ------------ | ------------------------------ |
| id           | UUID PK                        |
| name         | required                       |
| email        | unique, lowercase              |
| passwordHash | never exposed via API          |
| phone        | optional                       |
| avatar       | optional URL                   |
| role         | Role, default USER             |
| isActive     | default true                   |
| createdAt    |                                |
| updatedAt    |                                |

Relations: `agentProfile`, `properties` (as agent), `favorites`, `inquiries`, `visits`, `notifications`, `refreshTokens`, `propertyViews`.

### RefreshToken

Rotating refresh sessions.

| Field     | Notes                |
| --------- | -------------------- |
| id        | UUID PK              |
| userId    | FK User              |
| tokenHash | unique               |
| expiresAt |                      |
| revokedAt | nullable             |
| createdAt |                      |

Index: `(userId, expiresAt)`.

### AgentProfile

1:1 with User (only when `role = AGENT` or ADMIN acting as agent).

| Field           | Notes        |
| --------------- | ------------ |
| id              | UUID PK      |
| userId          | unique FK    |
| bio             |              |
| agencyName      |              |
| licenseNumber   |              |
| experienceYears | int          |
| specialties     | string[]     |
| socialLinks     | Json         |
| createdAt       |              |
| updatedAt       |              |

### Property

| Field              | Notes                                      |
| ------------------ | ------------------------------------------ |
| id                 | UUID PK                                    |
| agentId            | FK User (must be AGENT/ADMIN)              |
| title              |                                            |
| slug               | unique                                     |
| description        |                                            |
| price              | Decimal(12,2)                              |
| propertyType       | enum                                       |
| listingType        | enum                                       |
| bedrooms           | int, 0 for land/commercial where N/A       |
| bathrooms          | Decimal(3,1)                               |
| area               | Decimal(12,2)                              |
| areaUnit           | enum, default SQFT                         |
| furnishedStatus    | enum                                       |
| constructionStatus | enum                                       |
| address            |                                            |
| city               | indexed                                    |
| state              |                                            |
| country            | default Pakistan                           |
| latitude           | Float                                      |
| longitude          | Float                                      |
| status             | default DRAFT                              |
| featured           | default false                              |
| createdAt          | indexed                                    |
| updatedAt          |                                            |

Indexes: `city`, `price`, `propertyType`, `listingType`, `bedrooms`, `status`, `createdAt`, `agentId`, composite `(status, city, listingType)`.

Public list queries must filter `status = PUBLISHED` unless the caller is the owning agent or an admin.

### PropertyImage

| Field      | Notes                      |
| ---------- | -------------------------- |
| id         | UUID PK                    |
| propertyId | FK, cascade delete         |
| url        | Cloudinary URL             |
| publicId   | Cloudinary public id       |
| altText    |                            |
| sortOrder  | int                        |
| isPrimary  | bool                       |
| createdAt  |                            |

At most one primary image per property (enforced in service; unique partial index where possible).

### Amenity / PropertyAmenity

`Amenity`: `id`, `name` (unique), `icon`.
`PropertyAmenity`: composite unique `(propertyId, amenityId)`.

### Favorite

Unique `(userId, propertyId)`. Cascade on user/property delete.

### Inquiry

| Field             | Notes                                      |
| ----------------- | ------------------------------------------ |
| id                | UUID PK                                    |
| propertyId        | FK                                         |
| userId            | optional FK (guest inquiries allowed later)|
| agentId           | derived from property, never trusted input |
| name, email, phone|                                            |
| preferredVisitDate| optional DateTime                          |
| message           |                                            |
| status            | default NEW                                |
| createdAt         |                                            |

### Visit

| Field       | Notes                                      |
| ----------- | ------------------------------------------ |
| id          | UUID PK                                    |
| propertyId  | FK                                         |
| userId      | FK                                         |
| agentId     | derived from property                      |
| scheduledAt | DateTime                                   |
| status      | default REQUESTED                          |
| notes       |                                            |
| createdAt   |                                            |
| updatedAt   |                                            |

Service must reject conflicting confirmed visits for the same agent/slot.

### PropertyView

Anonymous + authenticated view tracking.

| Field      | Notes            |
| ---------- | ---------------- |
| id         | UUID PK          |
| propertyId | FK               |
| userId     | optional FK      |
| createdAt  |                  |

Index: `(propertyId, createdAt)`.

### Notification

| Field     | Notes     |
| --------- | --------- |
| id        | UUID PK   |
| userId    | FK        |
| type      | string    |
| title     |           |
| message   |           |
| isRead    | default false |
| createdAt |           |

## Constraints that must never be skipped

- Unique email
- Unique property slug
- Unique favorite `(userId, propertyId)`
- Unique amenity name
- Unique property-amenity pair
- Agent cannot mutate another agent's property (enforced in service, not only UI)

## Seed expectations

Realistic Pakistan listings (Karachi, Lahore, Islamabad, Rawalpindi), amenities, 3 demo users (`user@estatex.dev`, `agent@estatex.dev`, `admin@estatex.dev`), published + featured properties with images.
