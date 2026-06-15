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
import { CategoryForm } from "@/components/categories/CategoryForm";
import { DashboardLayout } from "@/components/layout";
import { createCategory } from "@/services/categoryService";

export function CreateCategoryView() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data) {
    setIsSubmitting(true);

    try {
      await createCategory(data);
      toast.success("Category created successfully");
      router.push("/categories");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout title="Create Category">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent">
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4" />
            Back to categories
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create Category</CardTitle>
            <CardDescription>
              Add a new category to organize your content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Create Category"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
