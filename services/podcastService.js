import { createContentService } from "./contentServiceFactory";

const podcastService = createContentService("podcasts", "Podcast");

export const createPodcast = podcastService.createItem;
export const getPodcasts = podcastService.getItems;
export const getPodcastById = podcastService.getItemById;
export const updatePodcast = podcastService.updateItem;
export const deletePodcast = podcastService.deleteItem;
