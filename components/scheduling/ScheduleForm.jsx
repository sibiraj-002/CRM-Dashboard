"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { getArticles } from "@/services/articleService";
import { getBlogs } from "@/services/blogService";
import { getNews } from "@/services/newsService";
import { getPodcasts } from "@/services/podcastService";
import { scheduleSchema } from "@/validations";

const contentTypes = [
    { label: "Blog", value: "blogs", getItems: getBlogs },
    { label: "Article", value: "articles", getItems: getArticles },
    { label: "News", value: "news", getItems: getNews },
    { label: "Podcast", value: "podcasts", getItems: getPodcasts },
];

export function ScheduleForm({ onSubmit, isSubmitting = false }) {
    const [contentItems, setContentItems] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [itemsError, setItemsError] = useState("");

    const form = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            contentType: "",
            contentId: "",
            scheduledDate: undefined,
            scheduledTime: "",
        },
    });

    const selectedContentType = form.watch("contentType");

    const selectedContentItem = useMemo(
        () => contentItems.find((item) => item.id === form.getValues("contentId")),
        [contentItems, form],
    );

    useEffect(() => {
        let isMounted = true;
        const contentTypeConfig = contentTypes.find(
            (contentType) => contentType.value === selectedContentType,
        );

        form.setValue("contentId", "", { shouldValidate: true });
        setContentItems([]);
        setItemsError("");

        if (!contentTypeConfig) {
            return () => {
                isMounted = false;
            };
        }

        async function fetchContentItems() {
            setIsLoadingItems(true);

            try {
                const items = await contentTypeConfig.getItems();

                if (isMounted) {
                    setContentItems(items);
                }
            } catch (error) {
                const message = error.message || "Failed to load content items";

                if (isMounted) {
                    setItemsError(message);
                    setContentItems([]);
                    toast.error(message);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingItems(false);
                }
            }
        }

        fetchContentItems();

        return () => {
            isMounted = false;
        };
    }, [form, selectedContentType]);

    async function handleSubmit(values) {
        const item =
            contentItems.find((contentItem) => contentItem.id === values.contentId) ||
            selectedContentItem;

        await onSubmit({
            ...values,
            title: item?.title || "Untitled",
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="contentType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isSubmitting}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select content type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {contentTypes.map((contentType) => (
                                        <SelectItem
                                            key={contentType.value}
                                            value={contentType.value}
                                        >
                                            {contentType.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Choose the type of content to schedule.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content Item</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={
                                    isSubmitting ||
                                    !selectedContentType ||
                                    isLoadingItems ||
                                    Boolean(itemsError)
                                }
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={
                                                isLoadingItems
                                                    ? "Loading content..."
                                                    : "Select content item"
                                            }
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {contentItems.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                {itemsError ||
                                    "Choose the specific content item to publish."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <div className="rounded-lg border">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={{ before: new Date() }}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>
                                Select the date this content should be published.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                                <Input
                                    type="time"
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Select the local time this content should be published.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Create Schedule"
                    )}
                </Button>
            </form>
        </Form>
    );
}
