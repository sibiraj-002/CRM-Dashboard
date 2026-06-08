"use client";

import { useState } from "react";
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
import { generateSlug } from "@/lib/utils/slug";
import { categorySchema } from "@/validations";

export function CategoryForm({
  defaultValues = { name: "", slug: "" },
  onSubmit,
  submitLabel = "Save Category",
  isSubmitting = false,
}) {
  const [slugEdited, setSlugEdited] = useState(
    Boolean(defaultValues.slug),
  );

  const form = useForm({
    resolver: zodResolver(categorySchema),
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Technology"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);

                    if (!slugEdited) {
                      form.setValue(
                        "slug",
                        generateSlug(event.target.value),
                        { shouldValidate: true },
                      );
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                The display name for this category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="technology"
                  disabled={isSubmitting}
                  {...field}
                  onChange={(event) => {
                    setSlugEdited(true);
                    field.onChange(generateSlug(event.target.value));
                  }}
                />
              </FormControl>
              <FormDescription>
                URL-friendly identifier. Auto-generated from name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </Form>
  );
}
