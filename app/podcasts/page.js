import { PodcastsList } from "@/components/podcasts";

export const metadata = {
  title: "Podcasts | Intelligence CRM",
  description: "Manage podcast episodes and show metadata",
};

export default function PodcastsPage() {
  return <PodcastsList />;
}
