import { z } from "zod";

function combineDateAndTime(date, time) {
    const [hours, minutes] = time.split(":").map(Number);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(hours, minutes, 0, 0);
    return scheduledAt;
}

export const scheduleSchema = z
    .object({
        contentType: z.string().min(1, "Content type is required"),
        contentId: z.string().min(1, "Content item is required"),
        scheduledDate: z.date({
            errorMap: () => ({ message: "Scheduled date is required" }),
        }),
        scheduledTime: z
            .string()
            .min(1, "Scheduled time is required")
            .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time"),
    })
    .refine(
        (values) =>
            combineDateAndTime(values.scheduledDate, values.scheduledTime) > new Date(),
        {
            message: "Schedule date and time cannot be in the past",
            path: ["scheduledTime"],
        },
    );

export { combineDateAndTime };
