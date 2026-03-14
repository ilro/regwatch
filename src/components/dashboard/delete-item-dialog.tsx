"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import type { ComplianceItem } from "@/types/database";

interface DeleteItemDialogProps {
  item: ComplianceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: ComplianceItem) => Promise<void>;
}

export function DeleteItemDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
}: DeleteItemDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!item) return;

    setLoading(true);
    try {
      await onConfirm(item);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Item</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete &ldquo;{item?.title}&rdquo;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
