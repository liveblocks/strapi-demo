import { useEffect, useState } from "react";
import * as Portal from "@radix-ui/react-portal";
import styles from "./NewThreadCursor.module.css";
import { Pointer, POINTER_OFFSET } from "@/components/assorted/Pointer";

export function NewThreadCursor() {
  const [coords, setCoords] = useState({
    x: -500,
    y: -500,
  });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setCoords({
        x: e.clientX,
        y: e.clientY,
      });
    };

    document.addEventListener("mousemove", updatePosition, false);
    document.addEventListener("mouseenter", updatePosition, false);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", updatePosition);
    };
  }, []);

  return (
    <Portal.Root>
      <div
        className={styles.newThreadCursor}
        style={{
          transform: `translate(${coords.x + POINTER_OFFSET.x}px, ${
            coords.y + POINTER_OFFSET.y
          }px)`,
        }}
      >
        <Pointer />
        New comment
      </div>
    </Portal.Root>
  );
}
