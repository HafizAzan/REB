export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Studio</p>
      <h1 className="mt-2 font-display text-5xl">About EstateX</h1>
      <p className="mt-6 text-lg leading-8 text-ink-soft">
        EstateX is a production-style real-estate marketplace: Next.js on the front, NestJS and
        PostgreSQL behind it, with role-aware workflows for buyers, agents, and admins. The aim is
        a product a recruiter can open and immediately recognise as serious work — not a tutorial
        CRUD board.
      </p>
    </div>
  );
}
