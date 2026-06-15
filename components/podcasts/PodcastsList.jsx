"use client";

import { ContentList } from "@/components/content/ContentList";
import { deletePodcast, getPodcasts } from "@/services/podcastService";

export function PodcastsList() {
    return (
        <ContentList
            title="Podcasts"
            description="Manage podcast episodes and show metadata."
            listTitle="All Podcasts"
            contentType="podcasts"
            createPath="/podcasts/create"
            editBasePath="/podcasts/edit"
            getItems={getPodcasts}
            deleteItem={deletePodcast}
            addLabel="Add Podcast"
            emptyCreateLabel="Create Podcast"
        />
    );
}
