import { Loader2 } from "lucide-react";

export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          IC
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    </div>
  );
}
