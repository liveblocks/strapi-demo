"use client";

import {
  ThreadMetadata,
  useEditThreadMetadata,
  useThreads,
  useUser,
} from "@/liveblocks.config";
import { ThreadData } from "@liveblocks/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Overlay.module.css";
import {
  getCoordsFromAccurateCursorPositions,
  getCoordsFromElement,
  getElementBeneath,
} from "@/lib/coords";
import { PinnedThread } from "@/components/comments/PinnedThread";

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
    <div style={{ pointerEvents: beingDragged ? "none" : "auto" }}>
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
  const editThreadMetadata = useEditThreadMetadata();
  const { user, isLoading } = useUser(thread.comments[0].userId);

  const threadRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: -10000,
    y: -10000,
  });

  // Update thread when another user edits, and update coords when page resizes
  useEffect(() => {
    if (draggingRef.current) {
      return;
    }
    function updateCoords() {
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
    }

    updateCoords();

    window.addEventListener("resize", updateCoords);
    window.addEventListener("orientationchange", updateCoords);

    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("orientationchange", updateCoords);
    };
  }, [thread]);

  // Start drag on pointer down
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!threadRef.current) {
        return;
      }

      e.currentTarget.setPointerCapture(e.pointerId);

      const rect = threadRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.pageX - rect.left - window.scrollX,
        y: e.pageY - rect.top - window.scrollY,
      };
      dragStart.current = {
        x: e.pageX,
        y: e.pageY,
      };
      draggingRef.current = true;
      onDragChange(true);
    },
    [onDragChange]
  );

  // Update locally on drag with easy coords
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) {
        return;
      }

      const { x, y } = dragOffset.current;
      setCoords({
        x: e.pageX - x,
        y: e.pageY - y,
      });
    },
    []
  );

  // After drag, update for everyone with accurate coords
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || !threadRef.current) {
        return;
      }

      // If no cursor movement and clicked, toggle minimized
      if (e.pageX === dragStart.current.x && e.pageY === dragStart.current.y) {
        draggingRef.current = false;
        onDragChange(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
        return;
      }

      try {
        const elementUnder = getElementBeneath(
          threadRef.current,
          e.clientX - dragOffset.current.x,
          e.clientY - dragOffset.current.y
        );

        if (!elementUnder) {
          throw new Error("Element under");
        }

        const accurateCoords = getCoordsFromElement(
          elementUnder as HTMLElement,
          e.clientX,
          e.clientY,
          dragOffset.current
        );
        if (!accurateCoords) {
          throw new Error("Accurate coords");
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
      } catch (err) {
        console.log(err);
      } finally {
        draggingRef.current = false;
        onDragChange(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
    [editThreadMetadata, maxZIndex, thread, onDragChange]
  );

  //  Increase z-index on last element updated
  const handleIncreaseZIndex = useCallback(() => {
    editThreadMetadata({
      threadId: thread.id,
      metadata: {
        zIndex: maxZIndex + 1,
      },
    });
  }, [thread.id, editThreadMetadata, maxZIndex]);

  if (!user || isLoading) {
    return null;
  }

  return (
    <div
      ref={threadRef}
      className={styles.overlayWrapper}
      style={{
        transform: `translate(${coords.x}px, ${coords.y}px)`,
        zIndex: draggingRef.current ? 9999999 : thread.metadata.zIndex,
      }}
    >
      <PinnedThread
        user={user}
        thread={thread}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onThreadFocus={handleIncreaseZIndex}
      />
    </div>
  );
}
