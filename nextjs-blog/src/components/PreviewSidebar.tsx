import styles from "./PreviewSidebar.module.css";
import { Composer, Thread } from "@liveblocks/react-comments";
import { useThreads } from "@/liveblocks.config";

type Props = {
  onClose: () => void;
};

export function PreviewSidebar({ onClose }: Props) {
  const threads = useThreads();

  return (
    <div className={styles.sidebar}>
      <div>
        <button onClick={onClose}>X</button>
      </div>
      <div>
        {threads.map((thread) => (
          <Thread key={thread.id} thread={thread} />
        ))}
        <Composer />
      </div>
    </div>
  );
}
