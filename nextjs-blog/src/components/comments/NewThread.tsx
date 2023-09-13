import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Composer } from "@liveblocks/react-comments";
import * as Portal from "@radix-ui/react-portal";
import { useCreateThread } from "@/liveblocks.config";
import { ComposerSubmitComment } from "@liveblocks/react-comments/primitives";
import { CommentIcon } from "@/components/icons/CommentIcon";
import styles from "./NewThread.module.css";
import { Pointer } from "@/components/assorted/Pointer";
import { OverlayTop } from "@/components/comments/OverlayTop";

type ComposerCoords = null | { x: number; y: number };

export function NewThread() {
  const [creatingComment, setCreatingComment] = useState(false);
  const [composerCoords, setComposerCoords] = useState<ComposerCoords>(null);
  const createThread = useCreateThread();
  const composerRef = useRef<HTMLDivElement>(null);

  const [minimized, setMinimized] = useState(true);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!composerRef.current) {
        return;
      }

      const rect = composerRef.current.getBoundingClientRect();
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

  useEffect(() => {
    if (!creatingComment) {
      return;
    }

    function newComment(e: MouseEvent) {
      e.preventDefault();
      setCreatingComment(false);
      setComposerCoords({ x: e.clientX, y: e.clientY });
    }

    document.documentElement.addEventListener("click", newComment);

    return () => {
      document.documentElement.removeEventListener("click", newComment);
    };
  }, [creatingComment]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      if (!dragging.current) {
        return;
      }

      const { x, y } = dragOffset.current;
      setComposerCoords({
        x: e.pageX - x,
        y: e.pageY - y,
      });
    }

    function handlePointerUp() {
      if (!dragging.current) {
        setCreatingComment(false);
        return;
      }

      dragging.current = false;
      setCreatingComment(false);
    }

    document.documentElement.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.documentElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      document.documentElement.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, []);

  const handleComposerSubmit = useCallback(
    ({ body }: ComposerSubmitComment, event: FormEvent<HTMLFormElement>) => {
      if (!composerCoords) {
        return;
      }

      event.preventDefault();

      createThread({
        body,
        metadata: {
          resolved: false,
          x: composerCoords.x,
          y: composerCoords.y,
        },
      });

      setComposerCoords(null);
    },
    [createThread, composerCoords]
  );

  return (
    <>
      <button
        onClick={() => setCreatingComment(!creatingComment)}
        style={{ opacity: creatingComment ? 0.7 : 1 }}
      >
        <CommentIcon />
      </button>
      {composerCoords ? (
        <Portal.Root
          className={styles.composerWrapper}
          style={{
            top: composerCoords.y + 12 + "px",
            left: composerCoords.x + 10 + "px",
          }}
          asChild
        >
          <div ref={composerRef} className={styles.composer}>
            <Pointer />
            <OverlayTop
              onPointerDown={handlePointerDown}
              onClose={() => setCreatingComment(false)}
            />
            <Composer onComposerSubmit={handleComposerSubmit} />
          </div>
        </Portal.Root>
      ) : null}
    </>
  );
}
