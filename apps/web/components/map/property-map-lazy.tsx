'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/ui/skeleton';

const Map = dynamic(() => import('./property-map').then((mod) => mod.PropertyMap), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export function PropertyMapLazy(props: { latitude: number; longitude: number; title: string }) {
  return <Map {...props} />;
}
