"use client";

import { useState } from "react";
import { ComplianceCalendar } from "@/components/dashboard/compliance-calendar";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { AddItemDialog } from "@/components/dashboard/add-item-dialog";
import { EditItemDialog } from "@/components/dashboard/edit-item-dialog";
import { DeleteItemDialog } from "@/components/dashboard/delete-item-dialog";
import { ComplianceItemCard } from "@/components/dashboard/compliance-item-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

export function DashboardContent({ items: initialItems, userId }: DashboardContentProps) {
  const [items, setItems] = useState<ComplianceItem[]>(initialItems);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  const upcomingItems = items
    .filter((item) => !item.completed)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 10);

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

  const deadlineDates = items
    .filter((item) => !item.completed)
    .map((item) => new Date(item.due_date));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your compliance deadlines at a glance
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deadline
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ComplianceCalendar items={items} />
        </div>
        <div>
          <UpcomingDeadlines
            items={upcomingItems}
            onItemSelect={openEdit}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Deadlines</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ComplianceItemCard
              key={item.id}
              item={item}
              onToggleComplete={handleToggleComplete}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      </div>

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
