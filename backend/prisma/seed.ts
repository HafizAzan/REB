import {
  ConstructionStatus,
  FurnishedStatus,
  ListingType,
  PrismaClient,
  PropertyStatus,
  PropertyType,
  Role,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const amenities = [
  { name: 'Parking', icon: 'car' },
  { name: 'Swimming Pool', icon: 'waves' },
  { name: 'Gym', icon: 'dumbbell' },
  { name: 'Garden', icon: 'trees' },
  { name: 'Security', icon: 'shield' },
  { name: 'Balcony', icon: 'layout' },
  { name: 'Elevator', icon: 'arrow-up-down' },
  { name: 'Air Conditioning', icon: 'wind' },
  { name: 'Backup Generator', icon: 'zap' },
  { name: 'Servant Quarter', icon: 'home' },
];

async function main() {
  await prisma.propertyAmenity.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.propertyView.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.otpChallenge.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.property.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.agentProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await argon2.hash('Password123!');

  const [buyer, agent, admin] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Ayesha Khan',
        email: 'user@estatex.dev',
        passwordHash,
        phone: '+92 300 1112233',
        role: Role.USER,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Hamza Malik',
        email: 'agent@estatex.dev',
        passwordHash,
        phone: '+92 321 5556677',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        role: Role.AGENT,
        emailVerifiedAt: new Date(),
        agentProfile: {
          create: {
            bio: 'Luxury residential specialist covering Karachi and Islamabad for the last 12 years.',
            agencyName: 'Malik Premier Realty',
            licenseNumber: 'PK-AG-20491',
            experienceYears: 12,
            specialties: ['Villas', 'Waterfront', 'Investment'],
            socialLinks: { instagram: '@malikpremier', linkedin: 'hamza-malik' },
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: 'EstateX Admin',
        email: 'admin@estatex.dev',
        passwordHash,
        role: Role.ADMIN,
        emailVerifiedAt: new Date(),
      },
    }),
  ]);

  const amenityRows = await Promise.all(
    amenities.map((item) => prisma.amenity.create({ data: item })),
  );
  const amenityByName = Object.fromEntries(amenityRows.map((row) => [row.name, row.id]));

  const listings = [
    {
      title: 'Sea-facing Villa in DHA Phase 8',
      slug: 'sea-facing-villa-dha-phase-8',
      description:
        'A sculptural modern villa on a quiet DHA Phase 8 street, with double-height living, a private pool, and an uninterrupted Arabian Sea horizon. Italian marble, a chef kitchen, and landscaped courtyards make this a rare Karachi trophy home.',
      price: 385000000,
      propertyType: PropertyType.VILLA,
      listingType: ListingType.SALE,
      bedrooms: 6,
      bathrooms: 7,
      area: 6500,
      furnishedStatus: FurnishedStatus.FURNISHED,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      address: 'Khayaban-e-Shaheen, DHA Phase 8',
      city: 'Karachi',
      state: 'Sindh',
      latitude: 24.8142,
      longitude: 67.0474,
      featured: true,
      amenityNames: ['Parking', 'Swimming Pool', 'Garden', 'Security', 'Air Conditioning', 'Servant Quarter'],
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80',
      ],
    },
    {
      title: 'Skyline Penthouse at Clifton',
      slug: 'skyline-penthouse-clifton',
      description:
        'Corner penthouse with wraparound terraces overlooking Clifton Beach. Floor-to-ceiling glass, a private elevator lobby, and a wine wall. Designed for entertaining with a 20-foot living gallery and sunset dining deck.',
      price: 165000000,
      propertyType: PropertyType.PENTHOUSE,
      listingType: ListingType.SALE,
      bedrooms: 4,
      bathrooms: 4.5,
      area: 4200,
      furnishedStatus: FurnishedStatus.SEMI_FURNISHED,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      address: 'Block 5, Clifton',
      city: 'Karachi',
      state: 'Sindh',
      latitude: 24.8138,
      longitude: 67.0299,
      featured: true,
      amenityNames: ['Parking', 'Gym', 'Elevator', 'Security', 'Air Conditioning', 'Balcony'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
      ],
    },
    {
      title: 'Courtyard House in DHA Lahore',
      slug: 'courtyard-house-dha-lahore',
      description:
        'A calm, limewashed family house organised around a central courtyard and reflecting pool. Four ensuite bedrooms, a library, and a kitchen that opens onto a citrus garden. Quiet street, walking distance to parks.',
      price: 98000000,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
      bedrooms: 5,
      bathrooms: 6,
      area: 4500,
      furnishedStatus: FurnishedStatus.UNFURNISHED,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      address: 'Sector Y, DHA Phase 5',
      city: 'Lahore',
      state: 'Punjab',
      latitude: 31.4697,
      longitude: 74.4091,
      featured: true,
      amenityNames: ['Parking', 'Garden', 'Security', 'Backup Generator'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      ],
    },
    {
      title: 'F-6 Duplex with Margalla Views',
      slug: 'f6-duplex-margalla-views',
      description:
        'Split-level duplex in Islamabad F-6 with a terrace looking straight at the Margalla ridge. Oak floors, a study with built-in shelves, and a quiet lane of embassy residences.',
      price: 125000000,
      propertyType: PropertyType.TOWNHOUSE,
      listingType: ListingType.SALE,
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      furnishedStatus: FurnishedStatus.SEMI_FURNISHED,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      address: 'Street 12, F-6/3',
      city: 'Islamabad',
      state: 'Islamabad Capital Territory',
      latitude: 33.7294,
      longitude: 73.0667,
      featured: true,
      amenityNames: ['Parking', 'Garden', 'Security', 'Air Conditioning', 'Balcony'],
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8b99d2f1a1?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1600&q=80',
      ],
    },
    {
      title: 'Bahria Town Apartment — Furnished',
      slug: 'bahria-town-apartment-furnished',
      description:
        'Bright two-bed apartment in a gated Bahria community, fully furnished and ready to rent. Pool access, gym, and 24/7 security. Ideal for professionals commuting to the financial district.',
      price: 185000,
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      furnishedStatus: FurnishedStatus.FURNISHED,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      address: 'Bahria Town, Precinct 19',
      city: 'Karachi',
      state: 'Sindh',
      latitude: 24.8936,
      longitude: 67.1754,
      featured: false,
      amenityNames: ['Parking', 'Gym', 'Swimming Pool', 'Elevator', 'Security'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
      ],
    },
    {
      title: 'Gulberg Office Floor',
      slug: 'gulberg-office-floor',
      description:
        'Entire floor of a contemporary Gulberg tower with raised floors, meeting rooms, and a reception ready for a professional services firm. Covered parking included.',
      price: 72000000,
      propertyType: PropertyType.OFFICE,
      listingType: ListingType.SALE,
      bedrooms: 0,
      bathrooms: 2,
      area: 3800,
      furnishedStatus: FurnishedStatus.SEMI_FURNISHED,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      address: 'Main Boulevard, Gulberg III',
      city: 'Lahore',
      state: 'Punjab',
      latitude: 31.5104,
      longitude: 74.3448,
      featured: false,
      amenityNames: ['Parking', 'Elevator', 'Security', 'Backup Generator', 'Air Conditioning'],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      ],
    },
    {
      title: 'Rawalpindi Family House',
      slug: 'rawalpindi-family-house',
      description:
        'Practical 10-marla family house near Bahria Phase 8, with a lawn, two car porch, and a separate drawing suite. Recently painted and ready to move.',
      price: 42500000,
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.SALE,
      bedrooms: 5,
      bathrooms: 4,
      area: 2250,
      furnishedStatus: FurnishedStatus.UNFURNISHED,
      constructionStatus: ConstructionStatus.READY_TO_MOVE,
      address: 'Bahria Town Phase 8',
      city: 'Rawalpindi',
      state: 'Punjab',
      latitude: 33.5515,
      longitude: 73.1234,
      featured: false,
      amenityNames: ['Parking', 'Garden', 'Security', 'Backup Generator'],
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80',
      ],
    },
    {
      title: 'Under-construction Waterfront Condo',
      slug: 'waterfront-condo-under-construction',
      description:
        'Pre-launch waterfront condo with a 2027 handover. Open plan living, smart-home ready, and a shared marina club. Payment plan available on request.',
      price: 54000000,
      propertyType: PropertyType.CONDO,
      listingType: ListingType.SALE,
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      furnishedStatus: FurnishedStatus.UNFURNISHED,
      constructionStatus: ConstructionStatus.UNDER_CONSTRUCTION,
      address: 'Do Darya, DHA',
      city: 'Karachi',
      state: 'Sindh',
      latitude: 24.8051,
      longitude: 67.0388,
      featured: false,
      amenityNames: ['Parking', 'Gym', 'Swimming Pool', 'Elevator', 'Security'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      ],
    },
  ];

  for (const listing of listings) {
    const { amenityNames, images, ...data } = listing;
    await prisma.property.create({
      data: {
        ...data,
        agentId: agent.id,
        country: 'Pakistan',
        areaUnit: 'SQFT',
        status: PropertyStatus.PUBLISHED,
        images: {
          create: images.map((url, index) => ({
            url,
            publicId: `seed/${listing.slug}-${index}`,
            altText: listing.title,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
        amenities: {
          create: amenityNames.map((name) => ({ amenityId: amenityByName[name]! })),
        },
      },
    });
  }

  console.log(`Seeded buyer ${buyer.email}, agent ${agent.email}, admin ${admin.email}`);
  console.log('Password for all demo accounts: Password123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
