import { createContentService } from "./contentServiceFactory";

const newsService = createContentService("news", "News");

export const createNews = newsService.createItem;
export const getNews = newsService.getItems;
export const getNewsById = newsService.getItemById;
export const updateNews = newsService.updateItem;
export const deleteNews = newsService.deleteItem;
