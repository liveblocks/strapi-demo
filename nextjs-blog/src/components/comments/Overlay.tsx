"use client";

import {
  ThreadMetadata,
  useEditThreadMetadata,
  useThreads,
  useUser,
} from "@/liveblocks.config";
import { Thread } from "@liveblocks/react-comments";
import { ThreadData } from "@liveblocks/client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Overlay.module.css";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { Avatar } from "@/components/assorted/Avatar";
import { DragHandleIcon } from "@/components/icons/DragHandleIcon";
import { Pointer } from "@/components/assorted/Pointer";

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
  const dragStart = useRef({ x: 0, y: 0 });
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

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!threadRef.current) {
        return;
      }

      const rect = threadRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.pageX - rect.left - window.scrollX,
        y: e.pageY - rect.top - window.scrollY,
      };
      dragStart.current = {
        x: e.pageX,
        y: e.pageY,
      };
      dragging.current = true;
    },
    []
  );

  const handleMinimizedPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pageX === dragStart.current.x && e.pageY === dragStart.current.y) {
        setMinimized(false);
      }
    },
    []
  );

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
          x: e.pageX - x,
          y: e.pageY - y,
        },
      });
    }

    function handlePointerMove(e: PointerEvent) {
      if (!dragging.current) {
        return;
      }

      const { x, y } = dragOffset.current;
      setCoords({
        x: e.pageX - x,
        y: e.pageY - y,
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
      <Pointer />
      {minimized ? (
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handleMinimizedPointerUp}
          className={styles.minimizedThread}
        >
          <Avatar
            src={user.avatar}
            name={user.name}
            tooltip={false}
            size={24}
          />
          <div>{user.name}</div>
        </div>
      ) : (
        <div className={styles.overlayThread}>
          <div
            className={styles.overlayThreadTop}
            onPointerDown={handlePointerDown}
          >
            <div className={styles.overlayDragHandle}>
              <DragHandleIcon />
            </div>
            <button
              className={styles.overlayMinimizeButton}
              onClick={() => setMinimized(true)}
            >
              <span className="sr-only">Minimize</span>
              <CloseIcon />
            </button>
          </div>
          <div className={styles.overlayThreadMain}>
            <Thread thread={thread} />
          </div>
        </div>
      )}
    </div>
  );
}
