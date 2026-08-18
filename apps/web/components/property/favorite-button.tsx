'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { apiGet, apiSend } from '@/lib/api';
import { cn } from '@/lib/utils';

export function FavoriteButton({
  propertyId,
  className,
}: {
  propertyId: string;
  className?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiGet<{ saved: boolean }>(`/favorites/check/${propertyId}`)
      .then((result) => setSaved(result.saved))
      .catch(() => undefined);
  }, [propertyId, user]);

  async function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      if (saved) {
        await apiSend(`/favorites/${propertyId}`, 'DELETE');
        setSaved(false);
      } else {
        await apiSend(`/favorites/${propertyId}`, 'POST');
        setSaved(true);
        toast.success('Saved to favorites');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update favorite');
    }
  }

  return (
    <button
      type="button"
      aria-label={saved ? 'Remove favorite' : 'Save property'}
      onClick={toggle}
      className={cn(
        'absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink backdrop-blur transition hover:text-gold',
        saved && 'text-gold',
        className,
      )}
    >
      <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
    </button>
  );
}
