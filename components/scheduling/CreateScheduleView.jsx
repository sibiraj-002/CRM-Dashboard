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
import { DashboardLayout } from "@/components/layout";
import { ScheduleForm } from "@/components/scheduling/ScheduleForm";
import { createSchedule } from "@/services/schedulingService";
import { combineDateAndTime } from "@/validations";

export function CreateScheduleView() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(data) {
        setIsSubmitting(true);

        try {
            await createSchedule({
                contentType: data.contentType,
                contentId: data.contentId,
                title: data.title,
                scheduledAt: combineDateAndTime(
                    data.scheduledDate,
                    data.scheduledTime,
                ),
                status: "scheduled",
            });
            toast.success("Schedule created successfully");
            router.push("/scheduling");
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to create schedule");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardLayout title="Create Schedule">
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <Button
                    asChild
                    variant="ghost"
                    className="gap-2 px-0 hover:bg-transparent"
                >
                    <Link href="/scheduling">
                        <ArrowLeft className="h-4 w-4" />
                        Back to scheduling
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Schedule</CardTitle>
                        <CardDescription>
                            Choose content and schedule when it should be published.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScheduleForm
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
