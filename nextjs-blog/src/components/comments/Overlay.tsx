"use client";

import {
  ThreadMetadata,
  useEditThreadMetadata,
  useThreads,
  useUser,
} from "@/liveblocks.config";
import { Thread } from "@liveblocks/react-comments";
import { ThreadData } from "@liveblocks/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Overlay.module.css";
import { Avatar } from "./Avatar";
import { Pointer } from "./Pointer";
import { OverlayTop } from "@/components/comments/OverlayTop";
import {
  getCoordsFromAccurateCursorPositions,
  getCoordsFromPointerEvent,
} from "@/lib/coords";

export function Overlay() {
  const threads = useThreads();
  const [beingDragged, setBeingDragged] = useState(false);

  const maxZIndex = useMemo(() => {
    let max = 0;
    for (const thread of threads) {
      if (thread.metadata.zIndex > max) {
        max = thread.metadata.zIndex;
      }
    }
    return max;
  }, [threads]);

  return (
    <div style={{ pointerEvents: beingDragged ? "none" : "initial" }}>
      {threads
        .filter((thread) => !thread.metadata.resolved)
        .map((thread) => (
          <OverlayThread
            key={thread.id}
            thread={thread}
            maxZIndex={maxZIndex}
            onDragChange={setBeingDragged}
          />
        ))}
    </div>
  );
}

type OverlayThreadProps = {
  thread: ThreadData<ThreadMetadata>;
  maxZIndex: number;
  onDragChange: (dragging: boolean) => void;
};

function OverlayThread({
  thread,
  maxZIndex,
  onDragChange,
}: OverlayThreadProps) {
  const { user, isLoading } = useUser(thread.comments[0].userId);

  const editThreadMetadata = useEditThreadMetadata();
  const [minimized, setMinimized] = useState(true);

  const threadRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: -10000,
    y: -10000,
  });

  useEffect(() => {
    if (dragging.current) {
      return;
    }

    const { cursorSelectors, cursorX, cursorY } = thread.metadata;

    if (!cursorSelectors) {
      return;
    }

    const fromAccurateCoords = getCoordsFromAccurateCursorPositions({
      cursorSelectors: cursorSelectors.split(","),
      cursorX,
      cursorY,
    });
    if (!fromAccurateCoords) {
      return;
    }
    setCoords({ x: fromAccurateCoords?.x, y: fromAccurateCoords.y });
    // setCoords({ x: thread.metadata.x, y: thread.metadata.y });
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

  const handleIncreaseZIndex = useCallback(() => {
    editThreadMetadata({
      threadId: thread.id,
      metadata: {
        zIndex: maxZIndex + 1,
      },
    });
  }, [thread.id, editThreadMetadata, maxZIndex]);

  useEffect(() => {
    function handlePointerUp(e: PointerEvent) {
      if (!dragging.current) {
        return;
      }

      onDragChange(false);
      dragging.current = false;

      const accurateCoords = getCoordsFromPointerEvent(e, dragOffset.current);
      if (!accurateCoords) {
        return;
      }

      const { cursorSelectors, cursorX, cursorY } = accurateCoords;

      const metadata = {
        cursorSelectors: cursorSelectors.join(","),
        cursorX,
        cursorY,
        zIndex: maxZIndex + 1,
      };

      editThreadMetadata({
        threadId: thread.id,
        metadata,
      });
    }

    function handlePointerMove(e: PointerEvent) {
      if (!dragging.current) {
        return;
      }

      onDragChange(true);

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
  }, [thread.id, editThreadMetadata, maxZIndex, onDragChange]);

  if (!user || isLoading) {
    return null;
  }

  return (
    <div
      ref={threadRef}
      className={styles.overlayWrapper}
      style={{
        transform: `translate(${coords.x}px, ${coords.y}px)`,
        zIndex: dragging.current ? 9999999 : thread.metadata.zIndex,
      }}
      onClick={handleIncreaseZIndex}
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
          <OverlayTop
            onPointerDown={handlePointerDown}
            onClose={() => setMinimized(true)}
          />
          <div className={styles.overlayThreadMain}>
            <Thread thread={thread} onFocus={handleIncreaseZIndex} />
          </div>
        </div>
      )}
    </div>
  );
}
