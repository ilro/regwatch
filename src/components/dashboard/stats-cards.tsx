"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getDaysUntil } from "@/lib/utils";
import {
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { ComplianceItem } from "@/types/database";

interface StatsCardsProps {
  items: ComplianceItem[];
  onFilterChange?: (filter: "all" | "overdue" | "upcoming" | "completed") => void;
  activeFilter?: string;
}

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

function AnimatedNumber({ value, duration = 1200 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * value));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span ref={ref}>0</span>;
}

export function StatsCards({ items, onFilterChange, activeFilter }: StatsCardsProps) {
  const now = new Date();
  const total = items.length;
  const completed = items.filter((i) => i.completed).length;
  const overdue = items.filter((i) => !i.completed && new Date(i.due_date) < now).length;
  const upcoming = items.filter((i) => {
    if (i.completed) return false;
    const daysUntil = getDaysUntil(i.due_date);
    return daysUntil >= 0 && daysUntil <= 30;
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

  const cards = [
    {
      label: "Total Deadlines",
      value: total,
      icon: ListChecks,
      color: "text-blue-600",
      bg: "bg-blue-50",
      filter: "all" as const,
      trend: null,
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      filter: "completed" as const,
      trend: { value: completionRate, label: `${completionRate}%` },
    },
    {
      label: "Overdue",
      value: overdue,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      filter: "overdue" as const,
      trend: overdue > 0 ? { value: -overdue, label: "action needed" } : null,
      clickable: true,
    },
    {
      label: "Upcoming (30d)",
      value: upcoming,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      filter: "upcoming" as const,
      clickable: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.filter;

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "transition-all",
                card.clickable && "cursor-pointer hover:shadow-md",
                isActive && "ring-2 ring-primary"
              )}
              onClick={() => card.clickable && onFilterChange?.(card.filter)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className={cn("mt-1 text-2xl font-bold", card.color)}>
                      <AnimatedNumber value={card.value} />
                    </p>
                    {card.trend && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        {card.trend.value > 0 ? (
                          <TrendingUp className="size-3 text-emerald-500" />
                        ) : card.trend.value < 0 ? (
                          <TrendingDown className="size-3 text-red-500" />
                        ) : (
                          <Minus className="size-3" />
                        )}
                        <span>{card.trend.label}</span>
                      </div>
                    )}
                  </div>
                  <div className={cn("rounded-lg p-2.5", card.bg)}>
                    <Icon className={cn("size-5", card.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
