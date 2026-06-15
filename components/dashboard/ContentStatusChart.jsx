"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getArticles } from "@/services/articleService";
import { getBlogs } from "@/services/blogService";
import { getNews } from "@/services/newsService";
import { getPodcasts } from "@/services/podcastService";

const contentSources = [getBlogs, getArticles, getNews, getPodcasts];
const statusColors = {
  Draft: "#94a3b8",
  Published: "#22c55e",
};

export function ContentStatusChart() {
  const [data, setData] = useState([
    { name: "Draft", value: 0 },
    { name: "Published", value: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchStatusCounts() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const sourceResults = await Promise.all(
        contentSources.map((getItems) => getItems()),
      );
      const items = sourceResults.flat();
      const draftCount = items.filter((item) => item.status === "draft").length;
      const publishedCount = items.filter(
        (item) => item.status === "published",
      ).length;

      setData([
        { name: "Draft", value: draftCount },
        { name: "Published", value: publishedCount },
      ]);
    } catch (error) {
      const message = error.message || "Failed to load content status";
      setData([
        { name: "Draft", value: 0 },
        { name: "Published", value: 0 },
      ]);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Status</CardTitle>
        <CardDescription>Draft and published content totals.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-72 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading content status...
          </div>
        ) : errorMessage ? (
          <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <p className="text-sm font-medium">Failed to load content status</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
            <Button className="mt-4" variant="outline" onClick={fetchStatusCounts}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  label
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={statusColors[entry.name]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
