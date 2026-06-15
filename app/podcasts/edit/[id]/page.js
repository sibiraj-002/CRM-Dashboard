import { EditPodcastView } from "@/components/podcasts";

export const metadata = {
    title: "Edit Podcast | Intelligence CRM",
    description: "Edit an existing podcast episode",
};

export default async function EditPodcastPage({ params }) {
    const { id } = await params;

    return <EditPodcastView podcastId={id} />;
}
