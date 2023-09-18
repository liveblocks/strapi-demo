"use client";

import Cursor from "./Cursor";
import { useEffect } from "react";
import { getCoordsFromPointerEvent } from "@/lib/coords";
import {
  useOthers,
  useOthersConnectionIds,
  useUpdateMyPresence,
} from "@/liveblocks.config";

export function Cursors() {
  /**
   * useMyPresence returns the presence of the current user and a function to update it.
   * updateMyPresence is different than the setState function returned by the useState hook from React.
   * You don't need to pass the full presence object to update it.
   * See https://liveblocks.io/docs/api-reference/liveblocks-react#useMyPresence for more information
   */
  const updateMyPresence = useUpdateMyPresence();

  /**
   * Return all the other users in the room and their presence (a cursor position in this case)
   */
  const othersConnectionIds = useOthersConnectionIds();
  const others = useOthers();

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      e.preventDefault();
      const cursor = getCoordsFromPointerEvent(e);
      updateMyPresence({ cursor });
    }

    function handlePointerLeave() {
      updateMyPresence({ cursor: null });
    }

    document.documentElement.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      document.documentElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, [updateMyPresence]);

  return (
    <>
      {
        /**
         * Iterate over other users and display a cursor based on their presence
         */
        others.map(({ connectionId, presence }) => {
          if (presence.cursor === null) {
            return null;
          }

          return <Cursor key={connectionId} connectionId={connectionId} />;
        })
      }
    </>
  );
}
