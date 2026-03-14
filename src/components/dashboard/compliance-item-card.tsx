"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, getDaysUntil, getUrgencyColor, getUrgencyLabel, cn } from "@/lib/utils";
import { CATEGORY_COLOURS, CATEGORY_LABELS, FREQUENCY_LABELS } from "@/lib/constants";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { ComplianceItem, Category, Frequency } from "@/types/database";

interface ComplianceItemCardProps {
  item: ComplianceItem;
  onToggleComplete: (item: ComplianceItem) => void;
  onEdit: (item: ComplianceItem) => void;
  onDelete: (item: ComplianceItem) => void;
}

export function ComplianceItemCard({
  item,
  onToggleComplete,
  onEdit,
  onDelete,
}: ComplianceItemCardProps) {
  const daysUntil = getDaysUntil(item.due_date);
  const urgencyColor = getUrgencyColor(daysUntil);
  const categoryColour = CATEGORY_COLOURS[item.category as Category] ?? CATEGORY_COLOURS.other;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors",
        item.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={item.completed}
        onCheckedChange={() => onToggleComplete(item)}
        className="mt-0.5"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium leading-snug",
              item.completed && "line-through"
            )}
          >
            {item.title}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" className="shrink-0" />}
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {item.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px]", categoryColour)}>
            {CATEGORY_LABELS[item.category as Category] ?? item.category}
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
            {FREQUENCY_LABELS[item.frequency as Frequency] ?? item.frequency}
          </Badge>
          <span className={cn("text-xs font-medium", urgencyColor)}>
            {getUrgencyLabel(daysUntil)}
          </span>
        </div>
      </div>
    </div>
  );
}
