"use client";

import { ContentCreateView } from "@/components/content/ContentCreateView";
import { createNews } from "@/services/newsService";
import { contentSchema } from "@/validations";

const newsFormLabels = {
    titlePlaceholder: "Breaking News Title",
    titleDescription: "The title of your news update.",
    excerptPlaceholder: "Brief summary of your news update (10-160 characters)",
    contentPlaceholder: "Write your news content here...",
};

export function CreateNewsView() {
    return (
        <ContentCreateView
            title="Create News"
            description="Add a news update. You can save as draft or publish immediately."
            backPath="/news"
            backLabel="Back to news"
            redirectPath="/news"
            createItem={createNews}
            schema={contentSchema}
            successMessage="News created successfully"
            errorMessage="Failed to create news"
            formLabels={newsFormLabels}
        />
    );
}
