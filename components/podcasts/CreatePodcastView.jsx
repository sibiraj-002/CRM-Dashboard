"use client";

import { ContentCreateView } from "@/components/content/ContentCreateView";
import { createPodcast } from "@/services/podcastService";
import { contentSchema } from "@/validations";

const podcastFormLabels = {
    titlePlaceholder: "Podcast Episode Title",
    titleDescription: "The title of your podcast episode.",
    excerptPlaceholder: "Brief summary of your podcast episode (10-160 characters)",
    contentPlaceholder: "Write your podcast notes or transcript here...",
};

export function CreatePodcastView() {
    return (
        <ContentCreateView
            title="Create Podcast"
            description="Add a podcast episode. You can save as draft or publish immediately."
            backPath="/podcasts"
            backLabel="Back to podcasts"
            redirectPath="/podcasts"
            createItem={createPodcast}
            schema={contentSchema}
            successMessage="Podcast created successfully"
            errorMessage="Failed to create podcast"
            formLabels={podcastFormLabels}
        />
    );
}
