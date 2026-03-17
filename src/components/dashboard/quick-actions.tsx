"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Calendar, FileBarChart } from "lucide-react";
import type { ComplianceItem } from "@/types/database";

interface QuickActionsProps {
  onAddDeadline: () => void;
  onGetRecommendations: () => void;
  onViewReport: () => void;
  items: ComplianceItem[];
}

function generateICS(items: ComplianceItem[]): string {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const escapeText = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  const now = formatDate(new Date().toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RegWatch//Compliance Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  items.forEach((item) => {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${item.id}@regwatch`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART;VALUE=DATE:${item.due_date.replace(/-/g, "")}`);
    lines.push(`SUMMARY:${escapeText(item.title)}`);
    if (item.description) {
      lines.push(`DESCRIPTION:${escapeText(item.description)}`);
    }
    lines.push(`CATEGORIES:${item.category}`);
    lines.push(`STATUS:${item.completed ? "COMPLETED" : "NEEDS-ACTION"}`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(items: ComplianceItem[]) {
  const ics = generateICS(items);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "regwatch-compliance-calendar.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function QuickActions({ onAddDeadline, onGetRecommendations, onViewReport, items }: QuickActionsProps) {
  const actions = [
    {
      label: "Add Deadline",
      icon: Plus,
      onClick: onAddDeadline,
      variant: "default" as const,
    },
    {
      label: "AI Recommendations",
      icon: Sparkles,
      onClick: onGetRecommendations,
      variant: "outline" as const,
    },
    {
      label: "Export Calendar",
      icon: Calendar,
      onClick: () => downloadICS(items),
      variant: "outline" as const,
    },
    {
      label: "View Report",
      icon: FileBarChart,
      onClick: onViewReport,
      variant: "outline" as const,
    },
  ];

  return (
    <motion.div
      className="flex flex-wrap gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.div key={action.label} variants={item}>
            <Button
              variant={action.variant}
              onClick={action.onClick}
              className="gap-2 transition-transform hover:scale-[1.02]"
            >
              <Icon className="size-4" />
              {action.label}
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
