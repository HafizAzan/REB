'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Video, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { apiUpload } from '@/lib/api';
import { isVideoUrl } from '@/lib/media';
import type { PropertyMedia } from '@/types/property';

export function PropertyMediaField({
  items,
  onChange,
}: {
  items: PropertyMedia[];
  onChange: (items: PropertyMedia[]) => void;
}) {
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<'IMAGE' | 'VIDEO' | null>(null);

  async function upload(kind: 'IMAGE' | 'VIDEO', files: FileList | null) {
    if (!files?.length) return;
    setUploading(kind);
    try {
      const uploaded: PropertyMedia[] = [];
      for (const file of Array.from(files)) {
        const result = await apiUpload<PropertyMedia>(
          kind === 'VIDEO' ? '/uploads/video' : '/uploads/image',
          file,
        );
        uploaded.push({
          url: result.url,
          publicId: result.publicId,
          kind: result.kind ?? kind,
        });
      }
      onChange([...items, ...uploaded].slice(0, 20));
      toast.success(kind === 'VIDEO' ? 'Video uploaded' : 'Images uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(null);
      if (imageInput.current) imageInput.current.value = '';
      if (videoInput.current) videoInput.current.value = '';
    }
  }

  return (
    <div className="space-y-3">
      <Typography variant="caption">Photos & videos</Typography>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<ImagePlus className="h-4 w-4" />}
          loading={uploading === 'IMAGE'}
          onClick={() => imageInput.current?.click()}
        >
          Upload images
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Video className="h-4 w-4" />}
          loading={uploading === 'VIDEO'}
          onClick={() => videoInput.current?.click()}
        >
          Upload videos
        </Button>
        <input
          ref={imageInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(event) => upload('IMAGE', event.target.files)}
        />
        <input
          ref={videoInput}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={(event) => upload('VIDEO', event.target.files)}
        />
      </div>

      {items.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item, index) => (
            <li key={`${item.url}-${index}`} className="relative overflow-hidden rounded-2xl border border-line bg-cream">
              {item.kind === 'VIDEO' || isVideoUrl(item.url, item.kind) ? (
                <video src={item.url} className="h-28 w-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="h-28 w-full object-cover" />
              )}
              <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-paper">
                {isVideoUrl(item.url, item.kind) ? 'Video' : 'Image'}
              </span>
              <button
                type="button"
                aria-label="Remove media"
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink"
                onClick={() => onChange(items.filter((_, current) => current !== index))}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-ink-soft">
          Upload listing photos and walkthrough videos. Files go to Cloudinary.
        </p>
      )}
    </div>
  );
}
