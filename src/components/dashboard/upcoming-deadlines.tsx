"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getDaysUntil, getUrgencyColor, getUrgencyLabel, cn } from "@/lib/utils";
import { CATEGORY_COLOURS, CATEGORY_LABELS } from "@/lib/constants";
import type { ComplianceItem, Category } from "@/types/database";

interface UpcomingDeadlinesProps {
  items: ComplianceItem[];
  onItemSelect?: (item: ComplianceItem) => void;
}

export function UpcomingDeadlines({ items, onItemSelect }: UpcomingDeadlinesProps) {
  const sortedItems = useMemo(() => {
    return [...items]
      .filter((item) => !item.completed)
      .sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      )
      .slice(0, 10);
  }, [items]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
        <span className="text-xs text-muted-foreground">
          {sortedItems.length} item{sortedItems.length !== 1 ? "s" : ""}
        </span>
      </CardHeader>
      <CardContent className="px-0">
        {sortedItems.length === 0 ? (
          <p className="px-4 text-sm text-muted-foreground">
            No upcoming deadlines. You&apos;re all caught up.
          </p>
        ) : (
          <ul className="divide-y">
            {sortedItems.map((item) => {
              const daysUntil = getDaysUntil(item.due_date);
              const urgencyColor = getUrgencyColor(daysUntil);
              const categoryColour = CATEGORY_COLOURS[item.category as Category] ?? CATEGORY_COLOURS.other;

              return (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    onItemSelect && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() => onItemSelect?.(item)}
                  role={onItemSelect ? "button" : undefined}
                  tabIndex={onItemSelect ? 0 : undefined}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={cn("text-xs font-medium", urgencyColor)}>
                        {getUrgencyLabel(daysUntil)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.due_date)}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("shrink-0 text-[10px]", categoryColour)}>
                    {CATEGORY_LABELS[item.category as Category] ?? item.category}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
