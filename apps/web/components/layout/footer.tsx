'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { Typography } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import { homeForRole } from '@/lib/auth';

export function Footer() {
  const { user, loading } = useAuth();

  return (
    <footer className="mt-auto border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Typography variant="subheading" tone="paper">
            EstateX
          </Typography>
          <Typography
            variant="muted"
            className="mt-3 max-w-md leading-relaxed text-paper/70"
          >
            A quieter way to find remarkable homes. Curated residences, trusted agents,
            and a search experience built for how people actually buy.
          </Typography>
        </div>
        <div>
          <Typography variant="eyebrow" className="text-gold">
            Explore
          </Typography>
          <div className="mt-4 flex flex-col gap-2 text-sm text-paper/80">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </div>
        </div>
        <div>
          <Typography variant="eyebrow" className="text-gold">
            Account
          </Typography>
          <div className="mt-4 flex flex-col gap-2 text-sm text-paper/80">
            {loading ? (
              <>
                <Skeleton className="h-4 w-24 bg-white/15 after:via-white/20" />
                <Skeleton className="h-4 w-20 bg-white/15 after:via-white/20" />
              </>
            ) : user ? (
              <>
                <FooterLink href={homeForRole(user.role)}>
                  {user.role === 'ADMIN'
                    ? 'Admin'
                    : user.role === 'AGENT'
                      ? 'Agent workspace'
                      : 'Dashboard'}
                </FooterLink>
                <FooterLink href="/settings">Settings</FooterLink>
              </>
            ) : (
              <>
                <FooterLink href="/login">Sign in</FooterLink>
                <FooterLink href="/register">Create account</FooterLink>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center">
        <Typography variant="caption" className="text-paper/50">
          © {new Date().getFullYear()} EstateX. Crafted for a premium real-estate
          experience.
        </Typography>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-block w-fit transition duration-200 hover:translate-x-1 hover:text-paper"
    >
      {children}
    </Link>
  );
}
