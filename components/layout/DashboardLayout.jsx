"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children, title = "Dashboard", className }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header
          title={title}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
