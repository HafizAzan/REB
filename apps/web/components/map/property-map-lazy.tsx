'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./property-map').then((mod) => mod.PropertyMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-80 place-items-center rounded-2xl border border-line bg-cream text-sm text-ink-soft">
      Loading map…
    </div>
  ),
});

export function PropertyMapLazy(props: { latitude: number; longitude: number; title: string }) {
  return <Map {...props} />;
}
