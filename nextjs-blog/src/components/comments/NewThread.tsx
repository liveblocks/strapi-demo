import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Composer } from "@liveblocks/react-comments";
import * as Portal from "@radix-ui/react-portal";
import { useCreateThread } from "@/liveblocks.config";
import { ComposerSubmitComment } from "@liveblocks/react-comments/primitives";
import { CommentIcon } from "@/components/icons/CommentIcon";
import styles from "./NewThread.module.css";
import { Pointer, POINTER_OFFSET } from "@/components/assorted/Pointer";
import { OverlayTop } from "@/components/comments/OverlayTop";
import { NewThreadCursor } from "@/components/comments/NewThreadCursor";

type ComposerCoords = null | { x: number; y: number };

export function NewThread() {
  const [creatingCommentState, setCreatingCommentState] = useState<
    "placing" | "placed" | "complete"
  >("complete");
  const [composerCoords, setComposerCoords] = useState<ComposerCoords>(null);
  const createThread = useCreateThread();
  const composerRef = useRef<HTMLDivElement>(null);

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDownOverlay = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      console.log("down");
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
    if (creatingCommentState === "complete") {
      return;
    }

    function newComment(e: MouseEvent) {
      if (dragging.current) {
        return;
      }

      console.log("new");
      e.preventDefault();
      setCreatingCommentState("placed");
      setComposerCoords({
        x: e.clientX,
        y: e.clientY,
      });
    }

    document.documentElement.addEventListener("click", newComment);

    return () => {
      document.documentElement.removeEventListener("click", newComment);
    };
  }, [creatingCommentState]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      console.log("move");
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
        return;
      }
      console.log("up");

      setTimeout(() => {
        dragging.current = false;
      });
      //setCreatingComment(false);
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
          x: composerCoords.x + POINTER_OFFSET.x,
          y: composerCoords.y + POINTER_OFFSET.y,
        },
      });

      setComposerCoords(null);
      setCreatingCommentState("complete");
    },
    [createThread, composerCoords]
  );

  const handleOverlayClose = useCallback(() => {
    setCreatingCommentState("complete");
    setComposerCoords(null);
  }, []);

  return (
    <>
      <button
        onClick={() =>
          setCreatingCommentState(
            creatingCommentState !== "complete" ? "complete" : "placing"
          )
        }
        style={{ opacity: creatingCommentState !== "complete" ? 0.7 : 1 }}
      >
        <CommentIcon />
      </button>
      {composerCoords && creatingCommentState === "placed" ? (
        <Portal.Root
          className={styles.composerWrapper}
          style={{
            transform: `translate(${composerCoords.x + POINTER_OFFSET.x}px, ${
              composerCoords.y + POINTER_OFFSET.y
            }px)`,
          }}
          asChild
        >
          <div ref={composerRef} className={styles.composer}>
            <OverlayTop
              onPointerDown={handlePointerDownOverlay}
              onClose={handleOverlayClose}
            />
            <Pointer />
            <Composer onComposerSubmit={handleComposerSubmit} />
          </div>
        </Portal.Root>
      ) : null}
      {creatingCommentState === "placing" ? <NewThreadCursor /> : null}
    </>
  );
}
