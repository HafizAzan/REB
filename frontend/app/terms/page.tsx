import type { Metadata } from 'next';
import Link from 'next/link';
import { ProsePage, ProseSection } from '@/components/layout/prose-page';
import { Typography } from '@/components/ui/typography';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms that govern your use of the EstateX marketplace.',
};

export default function TermsPage() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Terms of Service"
      lede="Last updated 20 August 2026. These terms govern browsing, accounts, listings, inquiries, and visits on EstateX."
    >
      <ProseSection title="The service">
        <Typography>
          EstateX is a marketplace that helps people discover homes and helps agents publish
          listings. We are not a broker, bank, or law firm. Listing details, prices, and
          availability are provided by agents and may change. Always confirm a property in person
          before you commit.
        </Typography>
      </ProseSection>

      <ProseSection title="Accounts">
        <Typography>
          You must give accurate details when you register. You are responsible for activity under
          your account. Do not share your password. We may suspend accounts that abuse the
          platform, impersonate others, or post misleading listings.
        </Typography>
      </ProseSection>

      <ProseSection title="Listings">
        <Typography>
          Agents warrant that they have the right to market a property and that photos and
          descriptions are not misleading. Listings go live after review. Featured placement is at
          our discretion. Archiving a listing removes it from public search. We may reject,
          unfeature, or take down a listing that violates these terms.
        </Typography>
      </ProseSection>

      <ProseSection title="Inquiries and visits">
        <Typography>
          Sending an inquiry or booking a visit does not create a contract to buy, rent, or sell.
          Visit times are requests until an agent confirms them. Cancel a visit you cannot attend.
          Do not use inquiries to spam, harass, or scrape contact details.
        </Typography>
      </ProseSection>

      <ProseSection title="Acceptable use">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Typography as="span">Do not attempt to access another user’s account or listings you do not own.</Typography>
          </li>
          <li>
            <Typography as="span">Do not upload unlawful content or images you do not have rights to use.</Typography>
          </li>
          <li>
            <Typography as="span">Do not overload, scrape, or reverse-engineer the service.</Typography>
          </li>
          <li>
            <Typography as="span">Do not use EstateX to discriminate or to post fraudulent offers.</Typography>
          </li>
        </ul>
      </ProseSection>

      <ProseSection title="Liability">
        <Typography>
          The marketplace is provided as-is for this product. We are not liable for deals that fall
          through, inaccurate listing data, or visits that do not happen as planned. To the extent
          allowed by law, our liability is limited to the amount you paid us for the service in the
          last twelve months — which, for this product, is typically nothing.
        </Typography>
      </ProseSection>

      <ProseSection title="Changes">
        <Typography>
          We may update these terms as the product evolves. Continued use after an update means you
          accept the new terms. The date at the top of this page is the latest revision.
        </Typography>
      </ProseSection>

      <Typography>
        How we handle personal data is described in the{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        . Learn more about EstateX on the{' '}
        <Link href="/about" className="underline">
          About
        </Link>{' '}
        page.
      </Typography>
    </ProsePage>
  );
}
