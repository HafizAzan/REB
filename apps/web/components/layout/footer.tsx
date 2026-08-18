import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">EstateX</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/70">
            A quieter way to find remarkable homes. Curated residences, trusted agents, and a
            search experience built for how people actually buy.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-paper/80">
            <FooterLink href="/properties?listingType=SALE">Buy</FooterLink>
            <FooterLink href="/properties?listingType=RENT">Rent</FooterLink>
            <FooterLink href="/agents">Agents</FooterLink>
            <FooterLink href="/about">About</FooterLink>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Account</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-paper/80">
            <FooterLink href="/login">Sign in</FooterLink>
            <FooterLink href="/register">Create account</FooterLink>
            <FooterLink href="/agent">Agent workspace</FooterLink>
            <FooterLink href="/admin">Admin</FooterLink>
            <FooterLink href="/dashboard">Dashboard</FooterLink>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} EstateX. Crafted for a premium real-estate experience.
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
