"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    Pencil,
    Plus,
    Search,
    Trash2,
    Eye,
    MoreHorizontal,
    FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DashboardLayout } from "@/components/layout";
import { deleteBlog, getBlogs } from "@/services/blogService";
import { getCategories } from "@/services/categoryService";

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
        archived: "outline",
    };

    return (
        <Badge variant={variants[status] || "secondary"} className="capitalize">
            {status}
        </Badge>
    );
}

export function BlogsList() {
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchBlogs = useCallback(async () => {
        setIsLoading(true);

        try {
            const [blogsData, categoriesData] = await Promise.all([
                getBlogs(),
                getCategories(),
            ]);

            setBlogs(blogsData);
            setCategories(categoriesData);
        } catch (error) {
            toast.error(error.message || "Failed to load blogs");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach((category) => {
            map[category.id] = category.name;
        });
        return map;
    }, [categories]);

    const filteredBlogs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return blogs;
        }

        return blogs.filter(
            (blog) =>
                blog.title.toLowerCase().includes(query) ||
                blog.slug.toLowerCase().includes(query),
        );
    }, [blogs, searchQuery]);

    async function handleDelete() {
        if (!deleteTarget) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteBlog(deleteTarget.id);
            toast.success(`"${deleteTarget.title}" deleted successfully`);
            setDeleteTarget(null);
            await fetchBlogs();
        } catch (error) {
            toast.error(error.message || "Failed to delete blog");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Blogs">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">Blogs</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage and publish blog content.
                        </p>
                    </div>

                    <Button asChild>
                        <a href="/blogs/create">
                            <Plus className="h-4 w-4" />
                            Add Blog
                        </a>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Blogs</CardTitle>
                        <CardDescription>
                            {isLoading
                                ? "Loading blogs..."
                                : `${filteredBlogs.length} blog${filteredBlogs.length === 1 ? "" : "s"} found`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by title or slug..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="pl-8"
                            />
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading blogs...
                            </div>
                        ) : filteredBlogs.length === 0 ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-sm font-medium">No blogs found</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {searchQuery
                                        ? "Try a different search term."
                                        : "Create your first blog post"}
                                </p>
                                {!searchQuery ? (
                                    <Button asChild className="mt-4" variant="outline">
                                        <a href="/blogs/create">
                                            <Plus className="h-4 w-4" />
                                            Create Blog
                                        </a>
                                    </Button>
                                ) : null}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBlogs.map((blog) => (
                                            <TableRow key={blog.id}>
                                                <TableCell className="font-medium">
                                                    {blog.title}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {categoryMap[blog.categoryId] || "Uncategorized"}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={blog.status} />
                                                </TableCell>
                                                <TableCell>{formatDate(blog.createdAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                aria-label={`More actions for ${blog.title}`}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/blogs/${blog.id}`)}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(`/blogs/edit/${blog.id}`)
                                                                }
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setDeleteTarget(blog)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete blog</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{deleteTarget?.title}
                            &quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
