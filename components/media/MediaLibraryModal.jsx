"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, Loader2, Search, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getMedia, uploadMedia } from "@/services/mediaService";

function isImage(fileType) {
    return fileType?.startsWith("image/");
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function MediaLibraryModal({ open, onOpenChange, onSelect }) {
    const fileInputRef = useRef(null);
    const [media, setMedia] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const fetchMedia = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await getMedia();
            setMedia(data.filter((item) => isImage(item.fileType)));
        } catch (error) {
            toast.error(error.message || "Failed to load media");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchMedia();
        }
    }, [fetchMedia, open]);

    const filteredMedia = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return media;
        }

        return media.filter(
            (item) =>
                item.fileName?.toLowerCase().includes(query) ||
                item.fileType?.toLowerCase().includes(query),
        );
    }, [media, searchQuery]);

    async function handleFiles(files) {
        const file = files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Only image uploads are supported here");
            return;
        }

        setIsUploading(true);

        try {
            const fileUrl = await fileToDataUrl(file);
            await uploadMedia({
                fileName: file.name,
                fileUrl,
                fileType: file.type,
                fileSize: file.size,
            });
            toast.success("Image uploaded successfully");
            await fetchMedia();
        } catch (error) {
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    }

    function handleSelect() {
        if (!selectedMedia) {
            return;
        }

        onSelect({
            id: selectedMedia.id,
            fileName: selectedMedia.fileName,
            fileUrl: selectedMedia.fileUrl,
            fileType: selectedMedia.fileType,
        });
        onOpenChange(false);
        setSelectedMedia(null);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Media Library</DialogTitle>
                    <DialogDescription>
                        Select an existing image or upload a new image.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                    <div
                        className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            handleFiles(event.dataTransfer.files);
                        }}
                    >
                        {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        )}
                        <p className="mt-3 text-sm font-medium">
                            Drag & drop image
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            or click to upload
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => handleFiles(event.target.files)}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search media..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="pl-8"
                            />
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading media...
                            </div>
                        ) : filteredMedia.length === 0 ? (
                            <div className="rounded-lg border border-dashed py-16 text-center">
                                <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
                                <p className="mt-3 text-sm font-medium">No images found</p>
                            </div>
                        ) : (
                            <div className="grid max-h-[420px] gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
                                {filteredMedia.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`overflow-hidden rounded-lg border text-left transition ${
                                            selectedMedia?.id === item.id
                                                ? "border-primary ring-2 ring-primary/30"
                                                : "hover:border-primary/60"
                                        }`}
                                        onClick={() => setSelectedMedia(item)}
                                    >
                                        <div
                                            className="h-28 bg-cover bg-center bg-muted"
                                            style={{ backgroundImage: `url("${item.fileUrl}")` }}
                                        />
                                        <div className="p-2">
                                            <p className="truncate text-xs font-medium">
                                                {item.fileName}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.fileType}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSelect} disabled={!selectedMedia}>
                        Select Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
