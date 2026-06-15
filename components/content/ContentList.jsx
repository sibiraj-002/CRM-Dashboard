"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FileText,
    Loader2,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
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
import { DeleteContentDialog } from "@/components/content/DeleteContentDialog";
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
import { getCategories } from "@/services/categoryService";

const contentTypeLabels = {
    blogs: {
        singular: "blog",
        plural: "blogs",
    },
    articles: {
        singular: "article",
        plural: "articles",
    },
    news: {
        singular: "news item",
        plural: "news",
    },
    podcasts: {
        singular: "podcast",
        plural: "podcasts",
    },
};

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

export function ContentList({
    title,
    description,
    listTitle,
    contentSingular,
    contentPlural,
    contentType,
    createPath,
    editBasePath,
    getItems,
    deleteItem,
    addLabel,
    emptyCreateLabel,
    searchPlaceholder = "Search by title or slug...",
}) {
    const router = useRouter();
    const typeLabels = contentTypeLabels[contentType] || contentTypeLabels.blogs;
    const singularLabel = contentSingular || typeLabels.singular;
    const pluralLabel = contentPlural || typeLabels.plural;
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);

        try {
            const [itemsData, categoriesData] = await Promise.all([
                getItems(),
                getCategories(),
            ]);

            setItems(itemsData);
            setCategories(categoriesData);
        } catch (error) {
            toast.error(error.message || `Failed to load ${pluralLabel}`);
        } finally {
            setIsLoading(false);
        }
    }, [getItems, pluralLabel]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach((category) => {
            map[category.id] = category.name;
        });
        return map;
    }, [categories]);

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return items;
        }

        return items.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                item.slug.toLowerCase().includes(query),
        );
    }, [items, searchQuery]);

    async function handleDelete() {
        if (!deleteTarget) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteItem(deleteTarget.id);
            toast.success(`"${deleteTarget.title}" deleted successfully`);
            setDeleteTarget(null);
            await fetchItems();
        } catch (error) {
            toast.error(error.message || `Failed to delete ${singularLabel}`);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <DashboardLayout title={title}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>

                    <Button asChild>
                        <Link href={createPath}>
                            <Plus className="h-4 w-4" />
                            {addLabel || `Add ${title}`}
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{listTitle}</CardTitle>
                        <CardDescription>
                            {isLoading
                                ? `Loading ${pluralLabel}...`
                                : `${filteredItems.length} ${singularLabel}${filteredItems.length === 1 ? "" : "s"} found`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="pl-8"
                            />
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading {pluralLabel}...
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-sm font-medium">
                                    No {pluralLabel} found
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {searchQuery
                                        ? "Try a different search term."
                                        : `Create your first ${singularLabel}`}
                                </p>
                                {!searchQuery ? (
                                    <Button asChild className="mt-4" variant="outline">
                                        <Link href={createPath}>
                                            <Plus className="h-4 w-4" />
                                            {emptyCreateLabel || `Create ${title}`}
                                        </Link>
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
                                        {filteredItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {item.title}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {categoryMap[item.categoryId] || "Uncategorized"}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={item.status} />
                                                </TableCell>
                                                <TableCell>{formatDate(item.createdAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                aria-label={`More actions for ${item.title}`}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(
                                                                        `${editBasePath}/${item.id}`,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setDeleteTarget(item)}
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

            <DeleteContentDialog
                contentSingular={singularLabel}
                isDeleting={isDeleting}
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </DashboardLayout>
    );
}
