"use client";

import { ContentList } from "@/components/content/ContentList";
import { deleteArticle, getArticles } from "@/services/articleService";

export function ArticlesList() {
    return (
        <ContentList
            title="Articles"
            description="Manage long-form articles and editorial content."
            listTitle="All Articles"
            contentType="articles"
            createPath="/articles/create"
            editBasePath="/articles/edit"
            getItems={getArticles}
            deleteItem={deleteArticle}
            addLabel="Add Article"
            emptyCreateLabel="Create Article"
        />
    );
}
