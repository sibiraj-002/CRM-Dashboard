"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { ContentForm } from "@/components/content/ContentForm";

export function ContentEditView({
    itemId,
    title,
    description,
    backPath,
    backLabel,
    redirectPath,
    contentSingular,
    getItemById,
    updateItem,
    schema,
    successMessage,
    loadErrorMessage,
    saveErrorMessage,
    formLabels,
}) {
    const router = useRouter();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchItem = useCallback(async () => {
        setIsLoading(true);
        setIsNotFound(false);
        setFetchError("");

        try {
            const data = await getItemById(itemId);

            if (!data) {
                setItem(null);
                setIsNotFound(true);
                return;
            }

            setItem(data);
        } catch (error) {
            const message = error.message || loadErrorMessage;
            setItem(null);
            setFetchError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [getItemById, itemId, loadErrorMessage]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    async function handleSubmit(data) {
        setIsSubmitting(true);

        try {
            await updateItem(itemId, data);
            toast.success(successMessage);
            router.push(redirectPath);
            router.refresh();
        } catch (error) {
            toast.error(error.message || saveErrorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardLayout title={title}>
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <Button
                    asChild
                    variant="ghost"
                    className="gap-2 px-0 hover:bg-transparent"
                >
                    <Link href={backPath}>
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading {contentSingular}...
                            </div>
                        ) : isNotFound ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <p className="text-sm font-medium">
                                    {contentSingular} not found
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    The {contentSingular} you are trying to edit does not exist.
                                </p>
                                <Button asChild className="mt-4" variant="outline">
                                    <Link href={backPath}>{backLabel}</Link>
                                </Button>
                            </div>
                        ) : fetchError ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <p className="text-sm font-medium">
                                    Failed to load {contentSingular}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {fetchError}
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    onClick={fetchItem}
                                >
                                    Try again
                                </Button>
                            </div>
                        ) : (
                            <ContentForm
                                key={item.id}
                                schema={schema}
                                defaultValues={{
                                    title: item.title || "",
                                    slug: item.slug || "",
                                    metaTitle: item.metaTitle || "",
                                    metaDescription: item.metaDescription || "",
                                    excerpt: item.excerpt || "",
                                    content: item.content || "",
                                    categoryId: item.categoryId || "",
                                    status:
                                        item.status === "published" ? "published" : "draft",
                                    publishDate: item.publishDate || "",
                                    publishTime: item.publishTime || "",
                                    scheduleDate: item.scheduleDate || "",
                                    scheduleTime: item.scheduleTime || "",
                                    author: item.author || "",
                                    media: {
                                        desktopBanner: item.media?.desktopBanner || null,
                                        tabletBanner: item.media?.tabletBanner || null,
                                        mobileBanner: item.media?.mobileBanner || null,
                                        featuredImage: item.media?.featuredImage || null,
                                    },
                                }}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                labels={formLabels}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
