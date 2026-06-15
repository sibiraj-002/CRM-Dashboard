"use client";

import { ContentList } from "@/components/content/ContentList";
import { deleteNews, getNews } from "@/services/newsService";

export function NewsList() {
    return (
        <ContentList
            title="News"
            description="Publish and organize news updates and announcements."
            listTitle="All News"
            contentType="news"
            createPath="/news/create"
            editBasePath="/news/edit"
            getItems={getNews}
            deleteItem={deleteNews}
            addLabel="Add News"
            emptyCreateLabel="Create News"
        />
    );
}
