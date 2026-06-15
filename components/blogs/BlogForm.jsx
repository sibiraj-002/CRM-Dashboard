import { ContentForm } from "@/components/content/ContentForm";
import { blogSchema } from "@/validations";

export function BlogForm({
    defaultValues = {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categoryId: "",
        status: "draft",
    },
    onSubmit,
    submitLabel = "Save",
    isSubmitting = false,
}) {
    return (
        <ContentForm
            schema={blogSchema}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            submitLabel={submitLabel}
            isSubmitting={isSubmitting}
            labels={{
                titlePlaceholder: "Amazing Blog Post",
                titleDescription: "The title of your blog post.",
                excerptPlaceholder:
                    "Brief summary of your blog post (10-160 characters)",
                contentPlaceholder: "Write your blog content here...",
            }}
        />
    );
}
