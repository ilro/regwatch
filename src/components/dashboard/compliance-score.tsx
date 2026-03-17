"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ComplianceItem } from "@/types/database";

interface ComplianceScoreProps {
  items: ComplianceItem[];
}

interface ScoreData {
  score: number;
  label: string;
  color: string;
  ringColor: string;
  completedCount: number;
  totalCount: number;
  overdueCount: number;
}

function calculateScore(items: ComplianceItem[]): ScoreData {
  const total = items.length;
  if (total === 0) {
    return { score: 100, label: "Excellent", color: "text-emerald-600", ringColor: "#10b981", completedCount: 0, totalCount: 0, overdueCount: 0 };
  }

  const completed = items.filter((i) => i.completed).length;
  const now = new Date();
  const overdue = items.filter((i) => !i.completed && new Date(i.due_date) < now);
  const upcoming = items.filter((i) => {
    if (i.completed) return false;
    const due = new Date(i.due_date);
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 30;
  });

  const noOverdue = overdue.length === 0;
  const upcomingHandled = upcoming.every((i) => i.completed);

  const base = (completed / total) * 70;
  const overdueBonus = noOverdue ? 20 : Math.max(0, 20 - overdue.length * 5);
  const upcomingBonus = upcomingHandled ? 10 : upcoming.length === 0 ? 10 : 0;

  const rawScore = Math.round(base + overdueBonus + upcomingBonus);
  const score = Math.max(0, Math.min(100, rawScore));

  let label: string;
  let color: string;
  let ringColor: string;

  if (score >= 80) {
    label = "Excellent";
    color = "text-emerald-600";
    ringColor = "#10b981";
  } else if (score >= 60) {
    label = "Good";
    color = "text-yellow-600";
    ringColor = "#ca8a04";
  } else if (score >= 40) {
    label = "Needs Attention";
    color = "text-orange-600";
    ringColor = "#ea580c";
  } else {
    label = "At Risk";
    color = "text-red-600";
    ringColor = "#dc2626";
  }

  return { score, label, color, ringColor, completedCount: completed, totalCount: total, overdueCount: overdue.length };
}

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return <>{current}</>;
}

export function ComplianceScore({ items }: ComplianceScoreProps) {
  const data = calculateScore(items);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compliance Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-muted/20"
              />
              <motion.circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke={data.ringColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-3xl font-bold", data.color)}>
                <AnimatedCounter target={data.score} />
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>

          <div className="text-center">
            <p className={cn("text-sm font-semibold", data.color)}>{data.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.completedCount} of {data.totalCount} deadline{data.totalCount !== 1 ? "s" : ""} completed
            </p>
            {data.overdueCount > 0 && (
              <p className="mt-0.5 text-xs font-medium text-red-600">
                {data.overdueCount} overdue
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
