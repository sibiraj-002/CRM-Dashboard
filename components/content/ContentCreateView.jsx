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
import { ContentForm } from "@/components/content/ContentForm";
import { useAuth } from "@/hooks/useAuth";

export function ContentCreateView({
    title,
    description,
    backPath,
    backLabel,
    redirectPath,
    createItem,
    schema,
    successMessage,
    errorMessage,
    formLabels,
}) {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(data) {
        if (!user?.uid) {
            toast.error("You must be logged in to create content");
            return;
        }

        setIsSubmitting(true);

        try {
            await createItem({
                ...data,
                authorId: user.uid,
            });
            toast.success(successMessage);
            router.push(redirectPath);
            router.refresh();
        } catch (error) {
            toast.error(error.message || errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardLayout title={title}>
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <Button
                    asChild
                    variant="ghost"
                    className="gap-2 px-0 hover:bg-transparent"
                >
                    <Link href={backPath}>
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ContentForm
                            schema={schema}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            labels={formLabels}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
