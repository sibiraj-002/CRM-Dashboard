"use client";

import { ContentCreateView } from "@/components/content/ContentCreateView";
import { createArticle } from "@/services/articleService";
import { contentSchema } from "@/validations";

const articleFormLabels = {
    titlePlaceholder: "Insightful Article Title",
    titleDescription: "The title of your article.",
    excerptPlaceholder: "Brief summary of your article (10-160 characters)",
    contentPlaceholder: "Write your article content here...",
};

export function CreateArticleView() {
    return (
        <ContentCreateView
            title="Create Article"
            description="Add a new article. You can save as draft or publish immediately."
            backPath="/articles"
            backLabel="Back to articles"
            redirectPath="/articles"
            createItem={createArticle}
            schema={contentSchema}
            successMessage="Article created successfully"
            errorMessage="Failed to create article"
            formLabels={articleFormLabels}
        />
    );
}
