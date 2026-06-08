"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug } from "@/lib/utils/slug";
import { blogSchema } from "@/validations";

export function BlogForm({
    defaultValues = {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "draft",
    },
    onSubmit,
    submitLabel = "Save",
    isSubmitting = false,
}) {
    const [slugEdited, setSlugEdited] = useState(Boolean(defaultValues.slug));

    const form = useForm({
        resolver: zodResolver(blogSchema),
        defaultValues,
    });

    async function handleSubmit(values) {
        await onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Amazing Blog Post"
                                    disabled={isSubmitting}
                                    {...field}
                                    onChange={(event) => {
                                        field.onChange(event);

                                        if (!slugEdited) {
                                            form.setValue(
                                                "slug",
                                                generateSlug(event.target.value),
                                                { shouldValidate: true },
                                            );
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The title of your blog post.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="amazing-blog-post"
                                    disabled={isSubmitting}
                                    {...field}
                                    onChange={(event) => {
                                        setSlugEdited(true);
                                        field.onChange(generateSlug(event.target.value));
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                URL-friendly identifier. Auto-generated from title.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief summary of your blog post (10-160 characters)"
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A short preview of your blog post. Used in listings and search results.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Write your blog content here..."
                                    disabled={isSubmitting}
                                    className="min-h-[300px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The main content of your blog post (plain text).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={async () => {
                            form.setValue("status", "draft", { shouldValidate: true });
                            const isValid = await form.trigger();
                            if (isValid) {
                                form.handleSubmit(handleSubmit)();
                            }
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving Draft...
                            </>
                        ) : (
                            "Save Draft"
                        )}
                    </Button>

                    <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={async () => {
                            form.setValue("status", "published", { shouldValidate: true });
                            const isValid = await form.trigger();
                            if (isValid) {
                                form.handleSubmit(handleSubmit)();
                            }
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            "Publish"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
