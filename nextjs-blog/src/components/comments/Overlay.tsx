"use client";

import {
  ThreadMetadata,
  useEditThreadMetadata,
  useThreads,
} from "@/liveblocks.config";
import { Thread } from "@liveblocks/react-comments";
import { ThreadData } from "@liveblocks/client";
import { useEffect, useRef, useState } from "react";
import styles from "./Overlay.module.css";

export function Overlay() {
  const threads = useThreads();

  return (
    <>
      {threads
        .filter((thread) => !thread.metadata.resolved)
        .map((thread) => (
          <OverlayThread key={thread.id} thread={thread} />
        ))}
    </>
  );
}

type OverlayThreadProps = {
  thread: ThreadData<ThreadMetadata>;
};

function OverlayThread({ thread }: OverlayThreadProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const editThreadMetadata = useEditThreadMetadata();
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: thread.metadata.x,
    y: thread.metadata.y,
  });

  useEffect(() => {
    if (dragging.current) {
      return;
    }

    setCoords({ x: thread.metadata.x, y: thread.metadata.y });
  }, [thread]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!threadRef.current) {
      return;
    }

    const rect = threadRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    dragging.current = true;
  }

  useEffect(() => {
    function handlePointerUp(e: PointerEvent) {
      if (!dragging.current) {
        return;
      }

      dragging.current = false;

      const { x, y } = dragOffset.current;
      editThreadMetadata({
        threadId: thread.id,
        metadata: {
          x: e.clientX - x,
          y: e.clientY - y,
        },
      });
    }

    function handlePointerMove(e: PointerEvent) {
      if (!dragging.current) {
        return;
      }

      const { x, y } = dragOffset.current;
      setCoords({
        x: e.clientX - x,
        y: e.clientY - y,
      });
    }

    document.documentElement.addEventListener("pointerup", handlePointerUp);
    document.documentElement.addEventListener("pointermove", handlePointerMove);

    return () => {
      document.documentElement.removeEventListener(
        "pointerup",
        handlePointerUp
      );
      document.documentElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, [thread.id, editThreadMetadata]);

  return (
    <div
      ref={threadRef}
      className={styles.overlayWrapper}
      style={{
        top: coords.y,
        left: coords.x,
      }}
    >
      <div
        className={styles.overlayDragHandle}
        onPointerDown={handlePointerDown}
      >
        drag
      </div>
      <Thread className={styles.overlayThread} thread={thread} />
    </div>
  );
}
