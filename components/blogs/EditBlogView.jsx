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
import { BlogForm } from "@/components/blogs/BlogForm";
import { DashboardLayout } from "@/components/layout";
import { getBlogById, updateBlog } from "@/services/blogService";

export function EditBlogView({ blogId }) {
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBlog = useCallback(async () => {
        setIsLoading(true);
        setIsNotFound(false);
        setFetchError("");

        try {
            const data = await getBlogById(blogId);

            if (!data) {
                setBlog(null);
                setIsNotFound(true);
                return;
            }

            setBlog(data);
        } catch (error) {
            const message = error.message || "Failed to load blog";
            setBlog(null);
            setFetchError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [blogId]);

    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

    async function handleSubmit(data) {
        setIsSubmitting(true);

        try {
            await updateBlog(blogId, data);
            toast.success("Blog updated successfully");
            router.push("/blogs");
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to update blog");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardLayout title="Edit Blog">
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <Button
                    asChild
                    variant="ghost"
                    className="gap-2 px-0 hover:bg-transparent"
                >
                    <Link href="/blogs">
                        <ArrowLeft className="h-4 w-4" />
                        Back to blogs
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Blog</CardTitle>
                        <CardDescription>
                            Update the blog post details and publishing status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading blog...
                            </div>
                        ) : isNotFound ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <p className="text-sm font-medium">Blog not found</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    The blog you are trying to edit does not exist.
                                </p>
                                <Button asChild className="mt-4" variant="outline">
                                    <Link href="/blogs">Back to blogs</Link>
                                </Button>
                            </div>
                        ) : fetchError ? (
                            <div className="rounded-lg border border-dashed py-12 text-center">
                                <p className="text-sm font-medium">Failed to load blog</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {fetchError}
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    onClick={fetchBlog}
                                >
                                    Try again
                                </Button>
                            </div>
                        ) : (
                            <BlogForm
                                key={blog.id}
                                defaultValues={{
                                    title: blog.title || "",
                                    slug: blog.slug || "",
                                    metaTitle: blog.metaTitle || "",
                                    metaDescription: blog.metaDescription || "",
                                    excerpt: blog.excerpt || "",
                                    content: blog.content || "",
                                    categoryId: blog.categoryId || "",
                                    status:
                                        blog.status === "published" ? "published" : "draft",
                                    publishDate: blog.publishDate || "",
                                    publishTime: blog.publishTime || "",
                                    scheduleDate: blog.scheduleDate || "",
                                    scheduleTime: blog.scheduleTime || "",
                                    author: blog.author || "",
                                    media: {
                                        desktopBanner: blog.media?.desktopBanner || null,
                                        tabletBanner: blog.media?.tabletBanner || null,
                                        mobileBanner: blog.media?.mobileBanner || null,
                                        featuredImage: blog.media?.featuredImage || null,
                                    },
                                }}
                                onSubmit={handleSubmit}
                                submitLabel="Update Blog"
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
