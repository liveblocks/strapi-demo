import styles from "./Pointer.module.css";
import { PointerIcon } from "@/components/icons/PointerIcon";

export function Pointer() {
  return (
    <div className={styles.pointer}>
      <PointerIcon width="14" />
    </div>
  );
}
