import { getArticles } from "@/strapi";
import styles from "./ArticleList.module.css";

export async function ArticleList() {
  const articles = await getArticles();
  return (
    <div className={styles.articleList}>
      {articles.map(({ id, attributes }) => {
        const date = new Date(attributes.Date);
        console.log(attributes);
        return (
          <article key={id}>
            <a
              className={styles.articleInfo}
              href={`/article/${attributes.Slug}`}
            >
              <time
                dateTime={date.toISOString()}
                className={styles.articleDate}
              >
                {date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <h2 className={styles.articleTitle}>{attributes.Title}</h2>
              <p className={styles.articleDescription}>
                {attributes.Description}
              </p>
              {/*{attributes.authors ? (*/}
              {/*  <div>*/}
              {/*    {attributes.authors.map((author) => (*/}
              {/*      <div>{author.name}</div>*/}
              {/*    ))}*/}
              {/*  </div>*/}
              {/*) : null}*/}
            </a>
          </article>
        );
      })}
    </div>
  );
}
