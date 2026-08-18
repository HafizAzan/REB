'use client';

import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

export interface AnchorBox {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function useAnchorBox(open: boolean, anchorRef: RefObject<HTMLElement | null>) {
  const [box, setBox] = useState<AnchorBox | null>(null);

  const update = useCallback(() => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) {
      setBox(null);
      return;
    }
    setBox({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!open) return;
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, update]);

  return box;
}
