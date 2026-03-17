"use client";

import { useState, useRef, useCallback } from "react";
import { ComplianceCalendar } from "@/components/dashboard/compliance-calendar";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { AddItemDialog } from "@/components/dashboard/add-item-dialog";
import { EditItemDialog } from "@/components/dashboard/edit-item-dialog";
import { DeleteItemDialog } from "@/components/dashboard/delete-item-dialog";
import { ComplianceItemCard } from "@/components/dashboard/compliance-item-card";
import { ComplianceScore } from "@/components/dashboard/compliance-score";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { OverdueBanner } from "@/components/dashboard/overdue-banner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getDaysUntil } from "@/lib/utils";
import type { ComplianceItem } from "@/types/database";

interface DashboardContentProps {
  items: ComplianceItem[];
  userId: string;
}

interface AddItemFormData {
  title: string;
  description: string;
  due_date: string;
  frequency: string;
  category: string;
}

interface EditItemFormData {
  title: string;
  description: string;
  due_date: string;
  frequency: string;
  category: string;
}

type FilterMode = "all" | "overdue" | "upcoming" | "completed";

export function DashboardContent({ items: initialItems, userId }: DashboardContentProps) {
  const [items, setItems] = useState<ComplianceItem[]>(initialItems);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterMode>("all");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const deadlinesRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const overdueItems = items.filter((i) => !i.completed && new Date(i.due_date) < now);
  const overdueCount = overdueItems.length;

  const upcomingItems = items
    .filter((item) => !item.completed)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 10);

  const filteredItems = (() => {
    switch (activeFilter) {
      case "overdue":
        return items.filter((i) => !i.completed && new Date(i.due_date) < now);
      case "upcoming":
        return items.filter((i) => {
          if (i.completed) return false;
          const days = getDaysUntil(i.due_date);
          return days >= 0 && days <= 30;
        });
      case "completed":
        return items.filter((i) => i.completed);
      default:
        return items;
    }
  })();

  const handleAdd = async (data: AddItemFormData) => {
    const res = await fetch("/api/compliance-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, is_custom: true }),
    });
    if (res.ok) {
      const { data: newItem } = await res.json();
      setItems((prev) => [...prev, newItem]);
      setAddDialogOpen(false);
    }
  };

  const handleEdit = async (data: EditItemFormData) => {
    if (!selectedItem) return;
    const res = await fetch(`/api/compliance-items/${selectedItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { data: updated } = await res.json();
      setItems((prev) => prev.map((item) => (item.id === selectedItem.id ? updated : item)));
      setEditDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleDelete = async (item: ComplianceItem) => {
    const res = await fetch(`/api/compliance-items/${item.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleToggleComplete = async (item: ComplianceItem) => {
    const res = await fetch(`/api/compliance-items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !item.completed }),
    });
    if (res.ok) {
      const { data: updated } = await res.json();
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    }
  };

  const openEdit = (item: ComplianceItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const openDelete = (item: ComplianceItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const scrollToDeadlines = useCallback(() => {
    setActiveFilter("overdue");
    deadlinesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="space-y-6">
      {/* Overdue Alert Banner */}
      <OverdueBanner overdueCount={overdueCount} onViewOverdue={scrollToDeadlines} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Your compliance deadlines at a glance
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="min-h-[44px] w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Deadline
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards items={items} onFilterChange={setActiveFilter} activeFilter={activeFilter} />

      {/* Compliance Score + Upcoming */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1 lg:col-span-1">
          <ComplianceScore items={items} />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <UpcomingDeadlines items={upcomingItems} onItemSelect={openEdit} />
        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="min-w-[320px]">
          <ComplianceCalendar items={items} />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions
        onAddDeadline={() => setAddDialogOpen(true)}
        onGetRecommendations={() => setShowRecommendations(true)}
        onViewReport={() => {
          // Placeholder for report view
          setActiveFilter("all");
        }}
        items={items}
      />

      {/* All Deadlines Grid */}
      <div className="space-y-4" ref={deadlinesRef}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {activeFilter === "all"
              ? "All Deadlines"
              : activeFilter === "overdue"
              ? "Overdue Deadlines"
              : activeFilter === "upcoming"
              ? "Upcoming Deadlines (30d)"
              : "Completed Deadlines"}
          </h2>
          {activeFilter !== "all" && (
            <Button variant="ghost" size="sm" onClick={() => setActiveFilter("all")}>
              Show All
            </Button>
          )}
        </div>
        {filteredItems.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No items to display for this filter.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <ComplianceItemCard
                key={item.id}
                item={item}
                onToggleComplete={handleToggleComplete}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAdd}
      />

      <EditItemDialog
        item={selectedItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
      />

      <DeleteItemDialog
        item={selectedItem}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}
