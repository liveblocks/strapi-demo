import { Article, Marketing, Payload } from "@/types";

const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL;

export async function getArticles() {
  const response = await fetch(`${STRAPI_BASE_URL}/api/articles`);

  if (!response.ok) {
    throw Error("Error fetching Articles");
  }

  return ((await response.json()) as Payload<Article[]>).data;
}

export async function getArticle(slug: string) {
  const response = await fetch(
    `${STRAPI_BASE_URL}/api/articles?filters[Slug][$eq]=${slug}`
  );

  if (!response.ok) {
    throw Error("Error fetching Article");
  }

  return ((await response.json()) as Payload<Article[]>).data[0];
}

export async function getMarketingText() {
  const response = await fetch(`${STRAPI_BASE_URL}/api/marketing-text`);

  if (!response.ok) {
    throw Error("Error fetching Marketing");
  }

  return ((await response.json()) as Payload<Marketing>).data;
}