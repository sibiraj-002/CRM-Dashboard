import { EditBlogView } from "@/components/blogs";

export const metadata = {
    title: "Edit Blog | Intelligence CRM",
    description: "Edit an existing blog post",
};

export default async function EditBlogPage({ params }) {
    const { id } = await params;

    return <EditBlogView blogId={id} />;
}
