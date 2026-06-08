import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon: Icon,
  iconClassName,
  className,
}) {
  const isPositive = change?.startsWith("+");

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {value}
          </CardTitle>
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              iconClassName,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          <span
            className={cn(
              "font-medium",
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400",
            )}
          >
            {change}
          </span>{" "}
          {changeLabel}
        </p>
      </CardContent>
    </Card>
  );
}
