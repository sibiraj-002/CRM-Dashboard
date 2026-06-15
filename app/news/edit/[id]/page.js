import { EditNewsView } from "@/components/news";

export const metadata = {
    title: "Edit News | Intelligence CRM",
    description: "Edit an existing news update",
};

export default async function EditNewsPage({ params }) {
    const { id } = await params;

    return <EditNewsView newsId={id} />;
}
