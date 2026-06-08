"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <AuthGuard>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </AuthGuard>
      </AuthProvider>
    </QueryProvider>
  );
}
