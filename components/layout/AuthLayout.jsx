import Link from "next/link";
import { BarChart3, Layers, Shield } from "lucide-react";

export function AuthLayout({ title, description, children, footer }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-700/40 via-zinc-950 to-zinc-950" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-zinc-950">
              IC
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Intelligence CRM
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight">
              Manage your content platform with confidence
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              Publish blogs, articles, news, and podcasts from a single
              professional workspace built for modern content teams.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              {
                icon: Layers,
                text: "Unified content management across all channels",
              },
              {
                icon: BarChart3,
                text: "Real-time insights into your content performance",
              },
              {
                icon: Shield,
                text: "Secure access with enterprise-grade authentication",
              },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-zinc-300">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Intelligence CRM. All rights
          reserved.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-muted/30 p-6 lg:w-1/2">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            IC
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Intelligence CRM
          </span>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {children}

          {footer ? (
            <div className="text-center text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
