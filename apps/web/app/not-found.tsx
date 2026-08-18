export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">404</p>
      <h1 className="mt-2 font-display text-4xl">This page doesn’t exist</h1>
      <p className="mt-3 text-ink-soft">The listing may have been archived, or the URL is wrong.</p>
      <a href="/properties" className="mt-6 inline-block text-sm underline">
        Back to properties
      </a>
    </div>
  );
}
