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
  icon: Icon,
  iconClassName,
  className,
  isLoading = false,
}) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-2">
          {isLoading ? (
            <>
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            </>
          ) : (
            <>
              <CardDescription>{title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                {value}
              </CardTitle>
            </>
          )}
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              isLoading ? "animate-pulse bg-muted text-muted-foreground" : iconClassName,
            )}
          >
            {!isLoading ? <Icon className="h-5 w-5" /> : null}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-sm text-muted-foreground">Live Firestore count</p>
        )}
      </CardContent>
    </Card>
  );
}
