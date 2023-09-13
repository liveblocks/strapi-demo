"use client";

import styles from "./Overlay.module.css";

import {
  ThreadMetadata,
  useEditThreadMetadata,
  useThreads,
} from "@/liveblocks.config";
import { Thread } from "@liveblocks/react-comments";
import { ThreadData } from "@liveblocks/client";
import { useEffect, useRef, useState } from "react";

export function Overlay() {
  const threads = useThreads();
  const editThreadMetadata = useEditThreadMetadata();
  const [dragging, setDragging] = useState(false);
  const dragTarget = useRef<string | null>(null);

  const [threadsCoords, setThreadCoords] = useState(new Map());

  useEffect(() => {
    function handlePointerUp() {
      setDragging(false);
      dragTarget.current = null;
    }

    function handlePointerMove(e: PointerEvent) {
      if (!dragTarget.current) {
        return;
      }

      editThreadMetadata({
        threadId: dragTarget.current,
        metadata: {
          x: e.clientX,
          y: e.clientY,
        },
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
  }, [editThreadMetadata]);

  return (
    <>
      {threads
        .filter((thread) => !thread.metadata.resolved)
        .map((thread) => (
          <OverlayThread
            key={thread.id}
            thread={thread}
            onDrag={(threadId) => (dragTarget.current = threadId)}
          />
        ))}
    </>
  );
}

type OverlayThreadProps = {
  thread: ThreadData<ThreadMetadata>;
  onDrag: (id: string) => void;
};

function OverlayThread({ thread, onDrag }: OverlayThreadProps) {
  const [coords, setCoords] = useState();

  function handlePointerDown() {
    onDrag(thread.id);
  }

  return (
    <div
      className={styles.overlayWrapper}
      style={{
        top: thread.metadata.y,
        left: thread.metadata.x,
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
