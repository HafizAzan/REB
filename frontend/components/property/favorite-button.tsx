'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { useFavoriteCheckQuery, useToggleFavoriteMutation } from '@/hooks/use-favorites-api';
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
  const checkQuery = useFavoriteCheckQuery(propertyId, Boolean(user));
  const toggleFavorite = useToggleFavoriteMutation(propertyId);
  const saved = checkQuery.data?.saved ?? false;

  function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    toggleFavorite.mutate(saved, {
      onSuccess: (result) => {
        if (result.saved) toast.success('Saved to favorites');
      },
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not update favorite'),
    });
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
