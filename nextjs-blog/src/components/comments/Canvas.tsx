"use client";

import { useThreads } from "@/liveblocks.config";
import { Thread } from "@liveblocks/react-comments";

export function Canvas() {
  const threads = useThreads();

  return (
    <div>
      {threads.map((thread) => (
        <Thread
          style={{
            position: "absolute",
            top: thread.metadata.y,
            left: thread.metadata.x,
          }}
          key={thread.id}
          thread={thread}
        />
      ))}
    </div>
  );
}
