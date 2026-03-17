"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface OverdueBannerProps {
  overdueCount: number;
  onViewOverdue: () => void;
}

const STORAGE_KEY = "regwatch-overdue-banner-dismissed";

export function OverdueBanner({ overdueCount, onViewOverdue }: OverdueBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { date } = JSON.parse(stored);
        // Re-show banner if last dismissed was a different day
        const today = new Date().toDateString();
        if (date === today) {
          setDismissed(true);
        }
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: new Date().toDateString() }));
  };

  if (overdueCount === 0 || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {overdueCount} overdue deadline{overdueCount !== 1 ? "s" : ""} require{overdueCount === 1 ? "s" : ""} attention
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Review and complete these items to improve your compliance score.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300"
              onClick={onViewOverdue}
            >
              View Overdue
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-red-600 hover:bg-red-100 dark:text-red-400"
              onClick={handleDismiss}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
