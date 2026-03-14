"use client";

import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CATEGORY_COLOURS } from "@/lib/constants";
import type { ComplianceItem, Category } from "@/types/database";

interface ComplianceCalendarProps {
  items: ComplianceItem[];
}

export function ComplianceCalendar({ items }: ComplianceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const deadlineDates = items.map((item) => parseISO(item.due_date));

  const selectedDayItems = selectedDate
    ? items.filter((item) => isSameDay(parseISO(item.due_date), selectedDate))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Compliance Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          numberOfMonths={1}
          components={{
            DayButton: ({ day, ...props }) => {
              const dayItems = items.filter((item) =>
                isSameDay(parseISO(item.due_date), day.date)
              );
              const hasOverdue = dayItems.some(
                (item) => new Date(item.due_date) < new Date() && !item.completed
              );

              return (
                <button
                  {...props}
                  className={cn(
                    "relative flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-center gap-0.5 rounded-md p-0 text-sm font-normal transition-colors hover:bg-muted",
                    day.date.toDateString() === new Date().toDateString() &&
                      "bg-muted font-medium",
                    selectedDate &&
                      day.date.toDateString() === selectedDate.toDateString() &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <span>{day.date.getDate()}</span>
                  {dayItems.length > 0 && (
                    <div className="flex gap-0.5">
                      {dayItems.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className={cn(
                            "size-1.5 rounded-full",
                            hasOverdue && !item.completed
                              ? "bg-red-500"
                              : item.completed
                              ? "bg-green-500"
                              : "bg-primary"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            },
          }}
        />

        <div className="flex-1 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            {selectedDate
              ? format(selectedDate, "EEEE, dd MMMM yyyy")
              : "Select a date"}
          </h4>
          {selectedDayItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No deadlines on this day.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedDayItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3",
                    item.completed && "opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 size-2 shrink-0 rounded-full",
                      CATEGORY_COLOURS[item.category as Category]?.includes(
                        "emerald"
                      )
                        ? "bg-emerald-500"
                        : CATEGORY_COLOURS[item.category as Category]?.includes(
                            "blue"
                          )
                        ? "bg-blue-500"
                        : CATEGORY_COLOURS[item.category as Category]?.includes(
                            "orange"
                          )
                        ? "bg-orange-500"
                        : CATEGORY_COLOURS[item.category as Category]?.includes(
                            "green"
                          )
                        ? "bg-green-500"
                        : CATEGORY_COLOURS[item.category as Category]?.includes(
                            "purple"
                          )
                        ? "bg-purple-500"
                        : CATEGORY_COLOURS[item.category as Category]?.includes(
                            "yellow"
                          )
                        ? "bg-yellow-500"
                        : CATEGORY_COLOURS[item.category as Category]?.includes(
                            "cyan"
                          )
                        ? "bg-cyan-500"
                        : CATEGORY_COLOURS[item.category as Category]?.includes(
                            "pink"
                          )
                        ? "bg-pink-500"
                        : "bg-slate-500"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        item.completed && "line-through"
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.category.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
