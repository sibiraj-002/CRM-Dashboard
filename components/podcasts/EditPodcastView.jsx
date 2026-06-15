"use client";

import { ContentEditView } from "@/components/content/ContentEditView";
import { getPodcastById, updatePodcast } from "@/services/podcastService";
import { contentSchema } from "@/validations";

const podcastFormLabels = {
    titlePlaceholder: "Podcast Episode Title",
    titleDescription: "The title of your podcast episode.",
    excerptPlaceholder: "Brief summary of your podcast episode (10-160 characters)",
    contentPlaceholder: "Write your podcast notes or transcript here...",
};

export function EditPodcastView({ podcastId }) {
    return (
        <ContentEditView
            itemId={podcastId}
            title="Edit Podcast"
            description="Update the podcast details and publishing status."
            backPath="/podcasts"
            backLabel="Back to podcasts"
            redirectPath="/podcasts"
            contentSingular="podcast"
            getItemById={getPodcastById}
            updateItem={updatePodcast}
            schema={contentSchema}
            successMessage="Podcast updated successfully"
            loadErrorMessage="Failed to load podcast"
            saveErrorMessage="Failed to update podcast"
            formLabels={podcastFormLabels}
        />
    );
}
