import { z } from "zod";

export const contentSchema = z.object({
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
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    excerpt: z
        .string()
        .min(1, "Excerpt is required")
        .min(10, "Excerpt must be at least 10 characters")
        .max(160, "Excerpt must not exceed 160 characters"),
    content: z
        .string()
        .min(1, "Content is required")
        .min(50, "Content must be at least 50 characters"),
    categoryId: z.string().min(1, "Category is required"),
    status: z.enum(["draft", "scheduled", "published"], {
        errorMap: () => ({ message: "Please select a valid status" }),
    }),
    publishDate: z.string().optional(),
    publishTime: z.string().optional(),
    scheduleDate: z.string().optional(),
    scheduleTime: z.string().optional(),
    author: z.string().optional(),
    media: z
        .object({
            desktopBanner: z.any().nullable().optional(),
            tabletBanner: z.any().nullable().optional(),
            mobileBanner: z.any().nullable().optional(),
            featuredImage: z.any().nullable().optional(),
        })
        .optional(),
});
