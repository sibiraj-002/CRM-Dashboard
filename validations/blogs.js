import { z } from "zod";

export const blogSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .min(3, "Title must be at least 3 characters"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must be lowercase letters, numbers, and hyphens only",
        ),
    excerpt: z
        .string()
        .min(1, "Excerpt is required")
        .min(10, "Excerpt must be at least 10 characters")
        .max(160, "Excerpt must not exceed 160 characters"),
    content: z
        .string()
        .min(1, "Content is required")
        .min(50, "Content must be at least 50 characters"),
    status: z.enum(["draft", "published"], {
        errorMap: () => ({ message: "Please select a valid status" }),
    }),
});
