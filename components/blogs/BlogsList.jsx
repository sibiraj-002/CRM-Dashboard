"use client";

import { ContentList } from "@/components/content/ContentList";
import { deleteBlog, getBlogs } from "@/services/blogService";

export function BlogsList() {
    return (
        <ContentList
            title="Blogs"
            description="Manage and publish blog content."
            listTitle="All Blogs"
            contentSingular="blog"
            contentPlural="blogs"
            contentType="blogs"
            createPath="/blogs/create"
            editBasePath="/blogs/edit"
            getItems={getBlogs}
            deleteItem={deleteBlog}
            addLabel="Add Blog"
            emptyCreateLabel="Create Blog"
        />
    );
}
