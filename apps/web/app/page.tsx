import Link from 'next/link';
import { ArrowRight, Building2, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { apiList } from '@/lib/api';
import { PropertyCard } from '@/components/property/property-card';
import { HeroSearch } from '@/components/search/hero-search';
import { Button } from '@/components/ui/button';
import type { Agent, Property } from '@/types/property';

const categories = [
  { label: 'Villas', query: 'propertyType=VILLA', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80' },
  { label: 'Apartments', query: 'propertyType=APARTMENT', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80' },
  { label: 'Houses', query: 'propertyType=HOUSE', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80' },
  { label: 'Penthouses', query: 'propertyType=PENTHOUSE', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80' },
];

export default async function HomePage() {
  let featured: Property[] = [];
  let latest: Property[] = [];
  let agents: Agent[] = [];

  try {
    const [featuredRes, latestRes, agentsRes] = await Promise.all([
      apiList<Property[]>('/properties?featured=true&limit=4'),
      apiList<Property[]>('/properties?limit=6&sort=createdAt&order=desc'),
      apiList<Agent[]>('/agents'),
    ]);
    featured = featuredRes.data ?? [];
    latest = latestRes.data ?? [];
    agents = Array.isArray(agentsRes.data) ? agentsRes.data.slice(0, 3) : [];
  } catch {
    featured = [];
    latest = [];
    agents = [];
  }

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/55 to-ink/80" />
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
          <div className="max-w-2xl text-paper">
            <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">Pakistan’s quieter marketplace</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              Find a place you’ll love.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-paper/80 sm:text-lg">
              Discover premium homes, apartments, villas and commercial spaces — curated, mapped,
              and ready to visit.
            </p>
          </div>
          <HeroSearch />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Featured</p>
            <h2 className="mt-2 font-display text-4xl">Homes with presence</h2>
          </div>
          <Link href="/properties?featured=true" className="hidden items-center gap-1 text-sm text-ink-soft hover:text-ink sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {featured.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyHint />
        )}
      </section>

      <section className="bg-cream/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-4xl">Browse by type</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.label}
                href={`/properties?${category.query}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.label}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/35" />
                <span className="absolute bottom-4 left-4 font-display text-2xl text-white">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'Verified listings', body: 'Every published home is reviewed. Agents cannot hide behind another ID.' },
          { icon: Sparkles, title: 'Editorial presentation', body: 'Galleries, amenities, maps and visit scheduling — not a spreadsheet in disguise.' },
          { icon: KeyRound, title: 'From search to keys', body: 'Save, inquire, and schedule a viewing without leaving the listing.' },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-line bg-white p-8">
            <item.icon className="h-6 w-6 text-gold-dark" />
            <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gold">Advisors</p>
              <h2 className="mt-2 font-display text-4xl">Agents who know the street</h2>
            </div>
            <Link href="/agents" className="text-sm text-paper/70 hover:text-paper">
              All agents
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {agents.length
              ? agents.map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/agents/${agent.id}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                  >
                    <p className="font-display text-2xl">{agent.name}</p>
                    <p className="mt-1 text-sm text-gold">{agent.agentProfile?.agencyName}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-paper/70">{agent.agentProfile?.bio}</p>
                    <p className="mt-4 text-xs uppercase tracking-widest text-paper/50">
                      {agent.agentProfile?.experienceYears} years · {agent._count?.properties ?? 0} listings
                    </p>
                  </Link>
                ))
              : <p className="text-paper/60">Agents appear after the database is seeded.</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-4xl">Latest listings</h2>
          <Link href="/properties" className="text-sm text-ink-soft hover:text-ink">
            Browse marketplace
          </Link>
        </div>
        {latest.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {latest.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyHint />
        )}
      </section>

      <section className="border-y border-line bg-cream/70">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-16 text-center sm:grid-cols-4 sm:px-6">
          {[
            ['8+', 'Live demo listings'],
            ['3', 'Cities to start'],
            ['24/7', 'Inquiry routing'],
            ['1', 'Place to manage it all'],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="font-display text-4xl text-ink">{stat}</p>
              <p className="mt-1 text-sm text-ink-soft">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['The gallery actually feels like a listing, not a CMS dump.', 'Karachi buyer'],
            ['Search URLs I can send to a client. Finally.', 'Lahore agent'],
            ['Visit scheduling without a WhatsApp scavenger hunt.', 'Islamabad family'],
          ].map(([quote, who]) => (
            <blockquote key={who} className="rounded-2xl border border-line bg-white p-8">
              <p className="font-display text-xl leading-snug">“{quote}”</p>
              <footer className="mt-4 text-sm text-ink-soft">— {who}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-ink px-8 py-12 text-paper md:flex-row md:items-center md:px-12">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold">
              <Building2 className="h-4 w-4" /> For agents
            </p>
            <h2 className="mt-3 max-w-xl font-display text-4xl">List once. Look like a studio.</h2>
          </div>
          <Link href="/register">
            <Button variant="gold" size="lg">
              Create your account
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

function EmptyHint() {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center text-ink-soft">
      <p>Listings appear once PostgreSQL is running and the database is seeded.</p>
      <p className="mt-2 text-sm">Start Docker, then run `npm run db:migrate` and `npm run db:seed`.</p>
    </div>
  );
}
