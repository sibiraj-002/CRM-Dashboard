import { DashboardLayout } from "@/components/layout/DashboardLayout";

export function PlaceholderPage({ title, description }) {
  return (
    <DashboardLayout title={title}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
        <p className="text-muted-foreground">{description}</p>
      </div>
    </DashboardLayout>
  );
}
