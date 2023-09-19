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
  getCoordsFromElement,
  getElementBeneath,
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
    <div>
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

  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);

  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: -10000,
    y: -10000,
  });

  // Update thread when another user edits
  useEffect(() => {
    if (draggingRef.current) {
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

    console.log("update");
    setCoords({ x: fromAccurateCoords?.x, y: fromAccurateCoords.y });
  }, [thread]);

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

      console.log("down");
    },
    []
  );

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

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || !threadRef.current) {
        return;
      }

      // If no cursor movement and a quick click, toggle minimized
      if (e.pageX === dragStart.current.x && e.pageY === dragStart.current.y) {
        draggingRef.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
        setMinimized(false);
        return;
      }

      try {
        const elementUnder = getElementBeneath(
          threadRef.current,
          e.clientX - dragOffset.current.x,
          e.clientY - dragOffset.current.y
        );

        if (!elementUnder?.element) {
          throw new Error("Element under");
        }

        const accurateCoords = getCoordsFromElement(
          elementUnder.element as HTMLElement,
          e.clientX,
          e.clientY,
          dragOffset.current
        );
        if (!accurateCoords) {
          throw new Error("Accurate coords");
        }

        const { cursorSelectors, cursorX, cursorY } = accurateCoords;

        console.log(cursorSelectors);

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
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
    [editThreadMetadata, maxZIndex, thread]
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
      onClick={handleIncreaseZIndex}
    >
      <Pointer />
      {minimized ? (
        <div
          // onPointerUp={handleMinimizedPointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
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
            // onPointerDown={handlePointerDown}
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
