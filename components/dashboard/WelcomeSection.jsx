"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getUserDisplayName } from "@/lib/auth/user";
import { ArrowUpRight, Plus } from "lucide-react";

export function WelcomeSection() {
  const { user } = useAuth();
  const displayName = getUserDisplayName(user);

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">
          Welcome back
        </p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {displayName}
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          Here is an overview of your content library. Track blogs, articles,
          news, podcasts, and media assets at a glance.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline">
          View Reports
          <ArrowUpRight />
        </Button>
        <Button>
          <Plus />
          New Content
        </Button>
      </div>
    </section>
  );
}
