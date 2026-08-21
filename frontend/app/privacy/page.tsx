import type { Metadata } from 'next';
import Link from 'next/link';
import { ProsePage, ProseSection } from '@/components/layout/prose-page';
import { Typography } from '@/components/ui/typography';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How EstateX collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Privacy Policy"
      lede="Last updated 20 August 2026. This policy explains what EstateX collects when you browse, create an account, inquire about a home, or list a property."
    >
      <ProseSection title="Who we are">
        <Typography>
          EstateX is a real-estate marketplace operated as a demonstration product for finding and
          listing homes in Pakistan. If you have a privacy question, contact us through the account
          you registered with or via the agent listed on a property.
        </Typography>
      </ProseSection>

      <ProseSection title="Information we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Typography as="span">
              <strong>Account details:</strong> name, email address, password (stored as a hash),
              role, and optional profile fields you choose to save.
            </Typography>
          </li>
          <li>
            <Typography as="span">
              <strong>Marketplace activity:</strong> favorites, inquiries, visit requests, and — for
              agents — listing content, photos, and location data you publish.
            </Typography>
          </li>
          <li>
            <Typography as="span">
              <strong>Security signals:</strong> one-time codes sent to your email for registration,
              password reset, and email changes. Codes are hashed and expire quickly.
            </Typography>
          </li>
          <li>
            <Typography as="span">
              <strong>Session cookies:</strong> HTTP-only cookies for signed-in access. We do not
              store passwords or refresh tokens in the browser’s local storage.
            </Typography>
          </li>
        </ul>
      </ProseSection>

      <ProseSection title="How we use it">
        <Typography>
          We use this information to run the marketplace: show relevant homes, connect you with
          agents, schedule visits, moderate listings, prevent abuse, and keep your account secure.
          We do not sell your personal information.
        </Typography>
      </ProseSection>

      <ProseSection title="Sharing">
        <Typography>
          Inquiry and visit details are shared with the listing’s agent so they can respond.
          Platform administrators can review users and listings to moderate the service. Hosted
          images may be stored with our image provider. We do not share accounts with advertisers.
        </Typography>
      </ProseSection>

      <ProseSection title="Retention">
        <Typography>
          We keep account and listing data while your account is active and as needed to operate
          the marketplace. You can ask an administrator to suspend an account. Archived listings
          leave public search but may remain visible to the owning agent.
        </Typography>
      </ProseSection>

      <ProseSection title="Your choices">
        <Typography>
          You can update your profile, email, and password in{' '}
          <Link href="/settings" className="underline">
            Settings
          </Link>
          . You can remove favorites, cancel upcoming visits, and (as an agent) archive your
          listings. To close an account entirely, contact an EstateX administrator.
        </Typography>
      </ProseSection>

      <ProseSection title="Security">
        <Typography>
          Passwords are hashed. Sessions use short-lived access tokens and rotating refresh tokens
          in HTTP-only cookies. Email changes and password resets require a one-time code. No
          method is perfect; please use a strong unique password.
        </Typography>
      </ProseSection>

      <Typography>
        Using EstateX also means you agree to our{' '}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>
        .
      </Typography>
    </ProsePage>
  );
}
