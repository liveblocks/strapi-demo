import styles from "./Avatar.module.css";
import { CSSProperties } from "react";

export function Avatar({
  src,
  name,
  tooltip = true,
  size = 36,
}: {
  src: string;
  name: string;
  tooltip?: boolean;
  size?: number;
}) {
  return (
    <div
      className={styles.avatar}
      data-tooltip={tooltip ? name : undefined}
      style={{ "--avatar-size": size } as CSSProperties}
    >
      <img
        width={size}
        height={size}
        alt={name}
        src={src}
        className={styles.avatar_picture}
        data-tooltip={name}
        draggable={false}
      />
    </div>
  );
}
