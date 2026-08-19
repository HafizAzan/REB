'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Typography } from '@/components/ui/typography';
import type { ConfirmDialogProps } from '@/types/components/confirm-dialog';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  loading = false,
  danger = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <Typography variant="muted" className="leading-6">
        {description}
      </Typography>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
