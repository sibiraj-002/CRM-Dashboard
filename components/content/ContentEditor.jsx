"use client";

import { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/components/media/MediaPicker";
import { generateSlug } from "@/lib/utils/slug";
import { getCategories } from "@/services/categoryService";

const defaultContentValues = {
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    excerpt: "",
    content: "",
    categoryId: "",
    status: "draft",
    publishDate: "",
    publishTime: "",
    scheduleDate: "",
    scheduleTime: "",
    author: "",
    media: {
        desktopBanner: null,
        tabletBanner: null,
        mobileBanner: null,
        featuredImage: null,
    },
};

const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Published", value: "published" },
];

export function ContentEditor({
    schema,
    defaultValues = defaultContentValues,
    onSubmit,
    isSubmitting = false,
    labels = {},
}) {
    const [slugEdited, setSlugEdited] = useState(Boolean(defaultValues.slug));
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [categoriesError, setCategoriesError] = useState("");

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            ...defaultContentValues,
            ...defaultValues,
            media: {
                ...defaultContentValues.media,
                ...defaultValues.media,
            },
        },
    });
    const selectedStatus = form.watch("status");

    useEffect(() => {
        let isMounted = true;

        async function fetchCategories() {
            setIsLoadingCategories(true);
            setCategoriesError("");

            try {
                const data = await getCategories();

                if (isMounted) {
                    setCategories(data);
                }
            } catch (error) {
                if (isMounted) {
                    setCategories([]);
                    setCategoriesError(error.message || "Failed to load categories");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingCategories(false);
                }
            }
        }

        fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleSubmit(values) {
        await onSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={labels.titlePlaceholder || "Content title"}
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
                                            placeholder={labels.slugPlaceholder || "content-title"}
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
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content Editor</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={
                                                labels.contentPlaceholder ||
                                                "Write your content here..."
                                            }
                                            disabled={isSubmitting}
                                            className="min-h-[420px]"
                                            {...field}
                                        />
                                    </FormControl>
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
                                            placeholder={
                                                labels.excerptPlaceholder ||
                                                "Brief summary of your content"
                                            }
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4 rounded-xl border p-4">
                            <div>
                                <h3 className="font-medium">SEO Settings</h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure search metadata for this content.
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="metaTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="SEO title"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="metaDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="SEO description"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="space-y-4 rounded-xl border p-4">
                            <div>
                                <h3 className="font-medium">Publish</h3>
                                <p className="text-sm text-muted-foreground">
                                    Manage publishing state and timing.
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {statusOptions.map((status) => (
                                                    <SelectItem
                                                        key={status.value}
                                                        value={status.value}
                                                    >
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {selectedStatus === "scheduled" ? (
                                <FormField
                                    control={form.control}
                                    name="publishDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Publish Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : null}
                        </div>

                        <div className="space-y-4 rounded-xl border p-4">
                            <h3 className="font-medium">Category</h3>
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={
                                                isSubmitting ||
                                                isLoadingCategories ||
                                                Boolean(categoriesError)
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            isLoadingCategories
                                                                ? "Loading categories..."
                                                                : "Select category"
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {categoriesError ||
                                                "Choose the category this content belongs to."}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 rounded-xl border p-4">
                            <h3 className="font-medium">Featured Image</h3>
                            <FormField
                                control={form.control}
                                name="media.featuredImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <MediaPicker
                                                label="Featured Image"
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4 rounded-xl border p-4">
                            <div>
                                <h3 className="font-medium">Responsive Images</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add image variants for each breakpoint.
                                </p>
                            </div>

                            {[
                                ["Desktop", "media.desktopBanner"],
                                ["Tablet", "media.tabletBanner"],
                                ["Mobile", "media.mobileBanner"],
                            ].map(([label, name]) => (
                                <FormField
                                    key={name}
                                    control={form.control}
                                    name={name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <MediaPicker
                                                    label={label}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </aside>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Content"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
