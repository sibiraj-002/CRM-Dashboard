import { ContentEditor } from "@/components/content/ContentEditor";

const defaultContentValues = {
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    excerpt: "",
    content: "",
    categoryId: "",
    status: "draft",
    publishDate: "",
    publishTime: "",
    scheduleDate: "",
    scheduleTime: "",
    author: "",
    media: {
        desktopBanner: null,
        tabletBanner: null,
        mobileBanner: null,
        featuredImage: null,
    },
};

export function ContentForm({
    schema,
    defaultValues = defaultContentValues,
    onSubmit,
    isSubmitting = false,
    labels = {},
}) {
    return (
        <ContentEditor
            schema={schema}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            labels={labels}
        />
    );
}
