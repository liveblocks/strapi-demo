import { ArticleList } from "@/components/ArticleList";
import styles from "./PageHome.module.css";
import { getMarketingText } from "@/strapi";

export async function PageHome() {
  const marketingText = await getMarketingText();

  return (
    <main className={styles.home}>
      <div className={styles.homeHeader}>
        <h1 className={styles.homeTitle}>
          {marketingText.attributes.BlogTitle}
        </h1>
        <div className={styles.homeDescription}>
          {marketingText.attributes.BlogDescription}
        </div>
      </div>
      <ArticleList />
    </main>
  );
}
