"use client";

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
import { mediaSchema } from "@/validations";

export function MediaForm({
    defaultValues = {
        fileUrl: "",
        fileName: "",
        fileType: "",
    },
    onSubmit,
    isSubmitting = false,
}) {
    const form = useForm({
        resolver: zodResolver(mediaSchema),
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
                    name="fileUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File URL</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Public media URL used until Firebase Storage is enabled.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fileName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="image.jpg"
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Display name for this media asset.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fileType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File Type</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="image/jpeg"
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                MIME type such as image/jpeg, image/png, or application/pdf.
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
                        "Save Media"
                    )}
                </Button>
            </form>
        </Form>
    );
}
