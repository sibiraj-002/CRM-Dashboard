import { StatCard } from "@/components/ui/StatCard";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { DashboardLayout } from "@/components/layout";
import { dashboardStats } from "@/constants";

export const metadata = {
  title: "Dashboard | Intelligence CRM",
  description: "Overview of your content platform performance",
};

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <WelcomeSection />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeLabel={stat.changeLabel}
              icon={stat.icon}
              iconClassName={stat.iconClassName}
            />
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}
