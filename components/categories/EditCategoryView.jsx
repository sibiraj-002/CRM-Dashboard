"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { getCategoryById, updateCategory } from "@/services/categoryService";

export function EditCategoryView({ categoryId }) {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategory = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getCategoryById(categoryId);

      if (!data) {
        toast.error("Category not found");
        router.replace("/categories");
        return;
      }

      setCategory(data);
    } catch (error) {
      toast.error(error.message || "Failed to load category");
      router.replace("/categories");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, router]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  async function handleSubmit(data) {
    setIsSubmitting(true);

    try {
      await updateCategory(categoryId, data);
      toast.success("Category updated successfully");
      router.push("/categories");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout title="Edit Category">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent">
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4" />
            Back to categories
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Category</CardTitle>
            <CardDescription>
              Update the category name and slug.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading category...
              </div>
            ) : (
              <CategoryForm
                key={category.id}
                defaultValues={{
                  name: category.name,
                  slug: category.slug,
                }}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="Update Category"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
