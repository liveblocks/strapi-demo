import { FormEvent, useCallback, useEffect, useState } from "react";
import { Composer } from "@liveblocks/react-comments";
import * as Portal from "@radix-ui/react-portal";
import { useCreateThread } from "@/liveblocks.config";
import { ComposerSubmitComment } from "@liveblocks/react-comments/primitives";
import { CommentIcon } from "@/components/icons/CommentIcon";
import styles from "./NewCommentButton.module.css";

type ComposerCoords = null | { x: number; y: number };

export function NewCommentButton() {
  const [creatingComment, setCreatingComment] = useState(false);
  const [composerCoords, setComposerCoords] = useState<ComposerCoords>(null);
  const createThread = useCreateThread();

  useEffect(() => {
    if (!creatingComment) {
      return;
    }

    function newComment(e: MouseEvent) {
      e.preventDefault();
      console.log("CREATE", e);
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
        <Portal.Root asChild>
          <Composer
            className={styles.composer}
            style={{
              top: composerCoords.y + "px",
              left: composerCoords.x + "px",
            }}
            onComposerSubmit={handleComposerSubmit}
          />
        </Portal.Root>
      ) : null}
    </>
  );
}
