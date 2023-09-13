import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Composer } from "@liveblocks/react-comments";
import * as Portal from "@radix-ui/react-portal";
import { useCreateThread } from "@/liveblocks.config";
import { ComposerSubmitComment } from "@liveblocks/react-comments/primitives";
import { CommentIcon } from "@/components/icons/CommentIcon";
import styles from "./NewCommentButton.module.css";
import { Pointer } from "@/components/assorted/Pointer";

type ComposerCoords = null | { x: number; y: number };

export function NewCommentButton() {
  const [creatingComment, setCreatingComment] = useState(false);
  const [composerCoords, setComposerCoords] = useState<ComposerCoords>(null);
  const createThread = useCreateThread();
  const composerRef = useRef(null);

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
        >
          <Pointer />
          <Composer
            onBlur={() => setCreatingComment(false)}
            className={styles.composer}
            onComposerSubmit={handleComposerSubmit}
          />
        </Portal.Root>
      ) : null}
    </>
  );
}
