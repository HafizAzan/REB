'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownItem, DropdownMenu } from '@/components/ui/dropdown-menu';
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

  async function signOut() {
    await logout();
    router.push('/');
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
          {loading ? null : user ? (
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
              <DropdownItem href="/properties">Browse homes</DropdownItem>
              <DropdownItem tone="muted" onSelect={() => void signOut()}>
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
            {!user ? (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-ink-soft transition hover:bg-cream hover:text-ink sm:hidden"
              >
                Sign in
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
