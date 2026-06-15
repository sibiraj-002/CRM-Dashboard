"use client";

import { ContentEditView } from "@/components/content/ContentEditView";
import { getArticleById, updateArticle } from "@/services/articleService";
import { contentSchema } from "@/validations";

const articleFormLabels = {
    titlePlaceholder: "Insightful Article Title",
    titleDescription: "The title of your article.",
    excerptPlaceholder: "Brief summary of your article (10-160 characters)",
    contentPlaceholder: "Write your article content here...",
};

export function EditArticleView({ articleId }) {
    return (
        <ContentEditView
            itemId={articleId}
            title="Edit Article"
            description="Update the article details and publishing status."
            backPath="/articles"
            backLabel="Back to articles"
            redirectPath="/articles"
            contentSingular="article"
            getItemById={getArticleById}
            updateItem={updateArticle}
            schema={contentSchema}
            successMessage="Article updated successfully"
            loadErrorMessage="Failed to load article"
            saveErrorMessage="Failed to update article"
            formLabels={articleFormLabels}
        />
    );
}
