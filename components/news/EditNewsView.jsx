"use client";

import { ContentEditView } from "@/components/content/ContentEditView";
import { getNewsById, updateNews } from "@/services/newsService";
import { contentSchema } from "@/validations";

const newsFormLabels = {
    titlePlaceholder: "Breaking News Title",
    titleDescription: "The title of your news update.",
    excerptPlaceholder: "Brief summary of your news update (10-160 characters)",
    contentPlaceholder: "Write your news content here...",
};

export function EditNewsView({ newsId }) {
    return (
        <ContentEditView
            itemId={newsId}
            title="Edit News"
            description="Update the news details and publishing status."
            backPath="/news"
            backLabel="Back to news"
            redirectPath="/news"
            contentSingular="news item"
            getItemById={getNewsById}
            updateItem={updateNews}
            schema={contentSchema}
            successMessage="News updated successfully"
            loadErrorMessage="Failed to load news"
            saveErrorMessage="Failed to update news"
            formLabels={newsFormLabels}
        />
    );
}
