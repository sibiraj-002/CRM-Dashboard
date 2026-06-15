"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarClock,
  FileText,
  Image,
  Mic,
  Newspaper,
  Tags,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ContentDistributionChart } from "@/components/dashboard/ContentDistributionChart";
import { ContentStatusChart } from "@/components/dashboard/ContentStatusChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatCard } from "@/components/dashboard/StatCard";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { DashboardLayout } from "@/components/layout";
import { getDashboardCounts } from "@/services/dashboardService";

const dashboardStats = [
  {
    id: "blogs",
    title: "Total Blogs",
    icon: BookOpen,
    iconClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "articles",
    title: "Total Articles",
    icon: FileText,
    iconClassName: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    id: "news",
    title: "Total News",
    icon: Newspaper,
    iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "podcasts",
    title: "Total Podcasts",
    icon: Mic,
    iconClassName: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    id: "categories",
    title: "Total Categories",
    icon: Tags,
    iconClassName: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "media",
    title: "Total Media",
    icon: Image,
    iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "scheduledPosts",
    title: "Total Scheduled Posts",
    icon: CalendarClock,
    iconClassName: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    id: "users",
    title: "Total Users",
    icon: Users,
    iconClassName: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
];

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

export function DashboardHomeView() {
  const [counts, setCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchCounts() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getDashboardCounts();
      setCounts(data);
    } catch (error) {
      const message = error.message || "Failed to load dashboard counts";
      setCounts({});
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <WelcomeSection />

        {errorMessage ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">Failed to load dashboard stats</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
            <Button className="mt-4" variant="outline" onClick={fetchCounts}>
              Try again
            </Button>
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={formatCount(counts[stat.id])}
              icon={stat.icon}
              iconClassName={stat.iconClassName}
              isLoading={isLoading}
            />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ContentDistributionChart counts={counts} isLoading={isLoading} />
          <ContentStatusChart />
        </section>

        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}
