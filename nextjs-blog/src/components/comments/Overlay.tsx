"use client";

import {
  ThreadMetadata,
  useEditThreadMetadata,
  useThreads,
  useUser,
} from "@/liveblocks.config";
import { Thread } from "@liveblocks/react-comments";
import { ThreadData } from "@liveblocks/client";
import { useEffect, useRef, useState } from "react";
import styles from "./Overlay.module.css";
import { CloseIcon } from "@/components/icons/CloseIcon";

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
  const { user, isLoading } = useUser(thread.comments[0].userId);

  const editThreadMetadata = useEditThreadMetadata();
  const [minimized, setMinimized] = useState(true);

  const threadRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
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

  if (!user || isLoading) {
    return null;
  }

  return (
    <div
      ref={threadRef}
      className={styles.overlayWrapper}
      style={{
        top: coords.y,
        left: coords.x,
      }}
    >
      {minimized ? (
        <div
          onPointerDown={handlePointerDown}
          className={styles.overlayDragHandle}
        >
          <img
            src={user.avatar}
            style={{ userSelect: "none" }}
            draggable={false}
          />
          <button onClick={() => setMinimized(false)}>open</button>
        </div>
      ) : (
        <div className={styles.overlayThread}>
          <div>
            <div
              className={styles.overlayDragHandle}
              onPointerDown={handlePointerDown}
            >
              drag
            </div>
            <button onClick={() => setMinimized(true)}>
              <CloseIcon />
            </button>
          </div>
          <Thread thread={thread} />
        </div>
      )}
    </div>
  );
}
