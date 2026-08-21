'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownItem, DropdownMenu } from '@/components/ui/dropdown-menu';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/components/auth/auth-provider';
import { homeForRole } from '@/lib/auth';
import { cn } from '@/lib/utils';

const links = [
  { href: '/properties', label: 'Properties' },
  { href: '/agents', label: 'Agents' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function openSignOut() {
    setMobileOpen(false);
    setSignOutOpen(true);
  }

  async function confirmSignOut() {
    setSigningOut(true);
    try {
      await logout();
      setSignOutOpen(false);
      router.push('/');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink transition hover:opacity-80">
          EstateX
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-ink-soft transition-colors duration-200 hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-all after:duration-300 hover:after:w-full',
                pathname === link.href && 'text-ink after:w-full',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {loading ? (
            <Skeleton className="h-9 w-24 rounded-full" />
          ) : user ? (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" className="gap-1">
                  {user.name.split(' ')[0]}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              }
            >
              <p className="px-4 pb-1 pt-2 font-display text-sm text-ink">{user.name}</p>
              <p className="px-4 pb-2 text-[11px] uppercase tracking-[0.16em] text-gold-dark">{user.role}</p>
              <DropdownItem href={homeForRole(user.role)}>Workspace</DropdownItem>
              {user.role === 'USER' ? (
                <>
                  <DropdownItem href="/dashboard/favorites">Favorites</DropdownItem>
                  <DropdownItem href="/dashboard/inquiries">Inquiries</DropdownItem>
                  <DropdownItem href="/dashboard/visits">Visits</DropdownItem>
                </>
              ) : null}
              <DropdownItem href="/settings">Settings</DropdownItem>
              <DropdownItem href="/properties">Browse homes</DropdownItem>
              <DropdownItem tone="muted" onSelect={openSignOut}>
                Sign out
              </DropdownItem>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-ink md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="animate-pop-in border-t border-line bg-paper px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === 'USER' ? (
                  <>
                    <Link
                      href="/dashboard/favorites"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition hover:bg-cream hover:text-ink"
                    >
                      Favorites
                    </Link>
                    <Link
                      href="/dashboard/inquiries"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition hover:bg-cream hover:text-ink"
                    >
                      Inquiries
                    </Link>
                    <Link
                      href="/dashboard/visits"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition hover:bg-cream hover:text-ink"
                    >
                      Visits
                    </Link>
                  </>
                ) : null}
                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition hover:bg-cream hover:text-ink"
                >
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={openSignOut}
                  className="rounded-xl px-3 py-2.5 text-left text-sm text-ink-soft transition hover:bg-cream hover:text-ink"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition hover:bg-cream hover:text-ink sm:hidden"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      ) : null}
      <Modal
        open={signOutOpen}
        onClose={() => {
          if (!signingOut) setSignOutOpen(false);
        }}
        title="Sign out?"
      >
        <p className="text-sm leading-6 text-ink-soft">
          You’ll need to sign in again to access your workspace, favorites, and settings.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" disabled={signingOut} onClick={() => setSignOutOpen(false)}>
            Cancel
          </Button>
          <Button loading={signingOut} onClick={() => void confirmSignOut()}>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>
      </Modal>
    </header>
  );
}
