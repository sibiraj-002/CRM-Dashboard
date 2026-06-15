"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout";
import { MediaForm } from "@/components/media/MediaForm";
import { useAuth } from "@/hooks/useAuth";
import { uploadMedia } from "@/services/mediaService";

export function CreateMediaView() {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(data) {
        setIsSubmitting(true);

        try {
            await uploadMedia({
                ...data,
                uploadedBy: user?.uid || "",
            });
            toast.success("Media added successfully");
            router.push("/media-library");
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to add media");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardLayout title="Add Media">
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <Button
                    asChild
                    variant="ghost"
                    className="gap-2 px-0 hover:bg-transparent"
                >
                    <Link href="/media-library">
                        <ArrowLeft className="h-4 w-4" />
                        Back to media library
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Add Media</CardTitle>
                        <CardDescription>
                            Add a media asset using a public URL while Firebase Storage is
                            not enabled.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MediaForm
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
