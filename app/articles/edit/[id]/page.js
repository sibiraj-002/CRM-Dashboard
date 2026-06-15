import { EditArticleView } from "@/components/articles";

export const metadata = {
    title: "Edit Article | Intelligence CRM",
    description: "Edit an existing article",
};

export default async function EditArticlePage({ params }) {
    const { id } = await params;

    return <EditArticleView articleId={id} />;
}
