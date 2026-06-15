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
import { BlogForm } from "@/components/blogs/BlogForm";
import { DashboardLayout } from "@/components/layout";
import { createBlog } from "@/services/blogService";
import { useAuth } from "@/hooks/useAuth";

export function CreateBlogView() {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(data) {
        if (!user?.uid) {
            toast.error("You must be logged in to create a blog");
            return;
        }

        setIsSubmitting(true);

        try {
            await createBlog({
                ...data,
                authorId: user.uid,
            });
            toast.success("Blog created successfully");
            router.push("/blogs");
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to create blog");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardLayout title="Create Blog">
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
                        <CardTitle>Create Blog</CardTitle>
                        <CardDescription>
                            Add a new blog post. You can save as draft or publish immediately.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BlogForm
                            onSubmit={handleSubmit}
                            submitLabel="Create Blog"
                            isSubmitting={isSubmitting}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
