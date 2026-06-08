"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  isAuthRedirectRoute,
  isProtectedRoute,
} from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

export function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isProtected = isProtectedRoute(pathname);
  const shouldRedirectToHome = user && isAuthRedirectRoute(pathname);
  const shouldRedirectToLogin = !user && isProtected;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (shouldRedirectToLogin) {
      router.replace("/login");
      return;
    }

    if (shouldRedirectToHome) {
      router.replace("/");
    }
  }, [loading, shouldRedirectToLogin, shouldRedirectToHome, router]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (shouldRedirectToLogin || shouldRedirectToHome) {
    return <AuthLoadingScreen />;
  }

  return children;
}
