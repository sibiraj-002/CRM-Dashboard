import { z } from "zod";

export const mediaSchema = z.object({
    fileUrl: z
        .string()
        .min(1, "File URL is required")
        .url("Enter a valid file URL"),
    fileName: z.string().min(1, "File name is required"),
    fileType: z.string().min(1, "File type is required"),
});
