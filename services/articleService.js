import { createContentService } from "./contentServiceFactory";

const articleService = createContentService("articles", "Article");

export const createArticle = articleService.createItem;
export const getArticles = articleService.getItems;
export const getArticleById = articleService.getItemById;
export const updateArticle = articleService.updateItem;
export const deleteArticle = articleService.deleteItem;
