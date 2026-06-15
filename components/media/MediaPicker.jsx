"use client";

import { useState } from "react";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaLibraryModal } from "@/components/media/MediaLibraryModal";

export function MediaPicker({ label, value, onChange, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{label}</p>
                {value ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onChange(null)}
                        disabled={disabled}
                        aria-label={`Remove ${label}`}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                ) : null}
            </div>

            <div className="overflow-hidden rounded-lg border bg-muted/40">
                {value?.fileUrl ? (
                    <div
                        className="h-36 bg-cover bg-center"
                        style={{ backgroundImage: `url("${value.fileUrl}")` }}
                    />
                ) : (
                    <div className="flex h-36 items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                    </div>
                )}
                <div className="space-y-2 border-t bg-background p-3">
                    <p className="truncate text-xs text-muted-foreground">
                        {value?.fileName || "No image selected"}
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOpen(true)}
                        disabled={disabled}
                    >
                        <UploadCloud className="h-4 w-4" />
                        Select From Media Library / Upload New Image
                    </Button>
                </div>
            </div>

            <MediaLibraryModal
                open={isOpen}
                onOpenChange={setIsOpen}
                onSelect={onChange}
            />
        </div>
    );
}
