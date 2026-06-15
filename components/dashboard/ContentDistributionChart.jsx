"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ContentDistributionChart({ counts = {}, isLoading = false }) {
  const data = [
    { name: "Blogs", value: counts.blogs || 0 },
    { name: "Articles", value: counts.articles || 0 },
    { name: "News", value: counts.news || 0 },
    { name: "Podcasts", value: counts.podcasts || 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Distribution</CardTitle>
        <CardDescription>Content volume by type.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-72 animate-pulse rounded-lg bg-muted" />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
