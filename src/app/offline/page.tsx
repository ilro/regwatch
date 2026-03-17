"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted mb-6">
        <WifiOff className="size-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">You&apos;re offline</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        Some features may be unavailable while you&apos;re disconnected from the internet.
        Your cached compliance deadlines will still be visible.
      </p>
      <Button
        className="mt-6"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="mr-2 size-4" />
        Retry
      </Button>
    </div>
  );
}
