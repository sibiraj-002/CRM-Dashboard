"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getArticles } from "@/services/articleService";
import { getBlogs } from "@/services/blogService";
import { getNews } from "@/services/newsService";
import { getPodcasts } from "@/services/podcastService";

const contentSources = [
  { type: "Blog", getItems: getBlogs },
  { type: "Article", getItems: getArticles },
  { type: "News", getItems: getNews },
  { type: "Podcast", getItems: getPodcasts },
];

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }) {
  const variants = {
    draft: "secondary",
    published: "default",
    cancelled: "destructive",
  };

  return (
    <Badge variant={variants[status] || "outline"} className="capitalize">
      {status || "draft"}
    </Badge>
  );
}

export function RecentActivity() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchRecentActivity() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const sourceResults = await Promise.all(
        contentSources.map(async (source) => {
          const data = await source.getItems();
          return data.map((item) => ({
            ...item,
            type: source.type,
          }));
        }),
      );

      const latestItems = sourceResults
        .flat()
        .sort((a, b) => {
          const firstDate = a.createdAt?.getTime?.() || 0;
          const secondDate = b.createdAt?.getTime?.() || 0;
          return secondDate - firstDate;
        })
        .slice(0, 10);

      setItems(latestItems);
    } catch (error) {
      const message = error.message || "Failed to load recent activity";
      setItems([]);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest content across your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading recent activity...
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-dashed py-12 text-center">
            <p className="text-sm font-medium">Failed to load recent activity</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
            <Button className="mt-4" variant="outline" onClick={fetchRecentActivity}>
              Try again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed py-12 text-center">
            <p className="text-sm font-medium">No recent activity found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create content to see recent activity here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={`${item.type}-${item.id}`}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.type}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
