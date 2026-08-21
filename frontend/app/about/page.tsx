import Link from 'next/link';
import { ProsePage, ProseSection } from '@/components/layout/prose-page';
import { Typography } from '@/components/ui/typography';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'EstateX is a quieter real-estate marketplace for premium homes across Pakistan.',
};

export default function AboutPage() {
  return (
    <ProsePage
      eyebrow="About"
      title="A quieter way to find remarkable homes"
      lede="EstateX is a premium marketplace for buying and renting residences across Pakistan — built around curated listings, trusted agents, and a search experience that matches how people actually look for a home."
    >
      <ProseSection title="What we do">
        <Typography>
          We bring villas, apartments, houses, penthouses, and commercial spaces into one calm
          catalogue. Each listing can be filtered by city, price, type, and amenities, then opened
          on a map, saved, or booked for a visit.
        </Typography>
      </ProseSection>

      <ProseSection title="Who it is for">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Typography as="span">
              <strong>Buyers and renters</strong> browse published homes, save favorites, send
              inquiries, and schedule visits.
            </Typography>
          </li>
          <li>
            <Typography as="span">
              <strong>Agents</strong> publish listings, manage photos, and follow up on inquiries and
              viewing requests.
            </Typography>
          </li>
          <li>
            <Typography as="span">
              <strong>Admins</strong> moderate listings, feature standout homes, and keep accounts in
              good standing.
            </Typography>
          </li>
        </ul>
      </ProseSection>

      <ProseSection title="Where we focus">
        <Typography>
          Listings are centred on Pakistan’s major cities — Karachi, Lahore, Islamabad, Rawalpindi
          and the communities around them. Prices are shown in PKR, with sale and monthly rent made
          obvious at a glance.
        </Typography>
      </ProseSection>

      <ProseSection title="How we work">
        <Typography>
          Agents submit listings for review. Once approved they appear in search, can be marked
          featured, and stay off-market when archived. Your account, email, and password changes
          are protected with verification so only you can update them.
        </Typography>
      </ProseSection>

      <Typography>
        Questions about how EstateX uses your information? Read our{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>
        .
      </Typography>
    </ProsePage>
  );
}
