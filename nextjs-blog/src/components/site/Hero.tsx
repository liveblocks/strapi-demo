import { EditableText } from "../editable/EditableText";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.Hero}>
      <div className={styles.HeroWrapper}>
        <div className={styles.HeroSubtitle}>
          <EditableText
            strapiApiId={"marketing-text"}
            attribute={"HeroSubtitle"}
          />
        </div>
        <h1>
          <EditableText
            strapiApiId={"marketing-text"}
            attribute={"HeroTitle"}
          />
        </h1>
        <p className={styles.HeroDescription}>
          <EditableText
            strapiApiId={"marketing-text"}
            attribute={"HeroDescription"}
          />
        </p>
        <div className={styles.HeroButtons}>
          <button className="button">Get Started</button>
          <button className="button button-secondary">Read Docs</button>
        </div>
      </div>
    </div>
  );
}
