"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, FileImage, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout";
import { deleteMedia, getMedia } from "@/services/mediaService";

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

function isImage(fileType) {
    return fileType?.startsWith("image/");
}

function MediaPreview({ item }) {
    if (isImage(item.fileType)) {
        return (
            <div
                className="h-36 rounded-lg border bg-cover bg-center bg-muted"
                style={{ backgroundImage: `url("${item.fileUrl}")` }}
                aria-label={`Preview of ${item.fileName}`}
            />
        );
    }

    return (
        <div className="flex h-36 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
            <FileImage className="h-10 w-10" />
        </div>
    );
}

export function MediaLibraryView() {
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const data = await getMedia();
            setMedia(data);
        } catch (error) {
            const message = error.message || "Failed to load media";
            setMedia([]);
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    async function handleDeleteMedia() {
        if (!deleteTarget) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteMedia(deleteTarget.id);
            toast.success("Media deleted successfully");
            setDeleteTarget(null);
            await fetchMedia();
        } catch (error) {
            toast.error(error.message || "Failed to delete media");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Media Library">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Media Library
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Browse and manage images, videos, and other media assets.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/media-library/create">
                            <Plus className="h-4 w-4" />
                            Add Media
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Media</CardTitle>
                        <CardDescription>
                            {isLoading
                                ? "Loading media..."
                                : `${media.length} file${media.length === 1 ? "" : "s"} found`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading media...
                            </div>
                        ) : errorMessage ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <p className="text-sm font-medium">Failed to load media</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {errorMessage}
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    onClick={fetchMedia}
                                >
                                    Try again
                                </Button>
                            </div>
                        ) : media.length === 0 ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <FileImage className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-sm font-medium">No media found</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Add your first media URL to get started.
                                </p>
                                <Button
                                    asChild
                                    className="mt-4"
                                    variant="outline"
                                >
                                    <Link href="/media-library/create">
                                        <Plus className="h-4 w-4" />
                                        Add Media
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {media.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="space-y-4 p-4">
                                            <MediaPreview item={item} />
                                            <div className="space-y-1">
                                                <p className="truncate text-sm font-medium">
                                                    {item.fileName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.fileType || "Unknown type"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Uploaded {formatDate(item.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="outline" size="sm">
                                                    <a
                                                        href={item.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                        View
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setDeleteTarget(item)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
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
                        <DialogTitle>Delete media</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this media file?
                            <br />
                            This action cannot be undone.
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
                            onClick={handleDeleteMedia}
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
