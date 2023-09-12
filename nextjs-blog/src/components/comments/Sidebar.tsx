"use client";

import styles from "./Sidebar.module.css";
import { Thread } from "@liveblocks/react-comments";
import { useThreads } from "@/liveblocks.config";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { useMemo } from "react";
import { DocumentMagnifyingIcon } from "@/components/icons/DocumentMagnifyingIcon";
import { DocumentCompleteIcon } from "@/components/icons/DocumentCompleteIcon";

type Props = {
  onClose: () => void;
};

export function Sidebar({ onClose }: Props) {
  const threads = useThreads();

  const resolvedThreadCount = useMemo(() => {
    return threads.filter((thread) => thread.metadata.resolved).length;
  }, [threads]);

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarThreadsResolved}>
            {resolvedThreadCount === threads.length ? (
              <DocumentCompleteIcon opacity="0.7" />
            ) : (
              <DocumentMagnifyingIcon opacity="0.7" />
            )}
            {resolvedThreadCount} / {threads.length} threads resolved
          </div>
          <button onClick={onClose} className={styles.sidebarClose}>
            <span className="sr-only">Close menu</span>
            <CloseIcon height="20" width="20" />
          </button>
        </div>
        <div className={styles.sidebarThreadList}>
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={styles.sidebarThread}
              data-thread-resolved={thread.metadata.resolved || undefined}
            >
              <Thread thread={thread} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
