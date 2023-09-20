import { EditableText } from "../editable/EditableText";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.Hero}>
      <div className={styles.HeroWrapper}>
        <h1>
          <EditableText
            strapiApiId={"marketing-text"}
            attribute={"BlogTitle"}
          />
        </h1>
        <p className={styles.HeroDescription}>
          <EditableText
            strapiApiId={"marketing-text"}
            attribute={"BlogDescription"}
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
