import { Button } from "./Button";
import styles from "./Toolbar.module.css";

import { List, More, Plus } from "@strapi/icons";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { NewThread } from "@/components/comments/NewThread";
import { AvatarStack } from "@/components/comments/AvatarStack";
import { SidebarIcon } from "@/components/icons/SidebarIcon";
import { Sidebar } from "@/components/comments/Sidebar";

export function Toolbar({ ...props }) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} {...props}>
      <div className={styles.Toolbar}>
        <div className={styles.ToolbarActions}>
          <NewThread>
            <Button variant="ghost" square>
              <Plus width={12} height={12} />
            </Button>
          </NewThread>
          <Collapsible.Trigger asChild>
            <Button variant="ghost" square>
              <List width={12} height={12} />
            </Button>
          </Collapsible.Trigger>
        </div>
        <div className={styles.ToolbarSeparator} />
        <div className={styles.ToolbarAvatars}>
          <img
            src="https://pbs.twimg.com/profile_images/1401194362927816708/0c3yTtri_400x400.jpg"
            width="28px"
            height="28px"
          />
          <img
            src="https://pbs.twimg.com/profile_images/1463879059138617359/QxrFz5rr_400x400.jpg"
            width="28px"
            height="28px"
          />
        </div>
        <div className={styles.ToolbarSeparator} />
        <div className={styles.ToolbarActions}>
          <Button variant="secondary">Save</Button>
          <Button>Publish</Button>
          <Button variant="ghost" square>
            <More width={12} height={12} />
          </Button>
        </div>
      </div>
      <Collapsible.Content>
        <Sidebar onClose={() => setOpen(false)} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function ToolbarOld2() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className={styles.toolbar}>
        <NewThread />
        <AvatarStack />
        <Collapsible.Trigger asChild>
          <button style={{ opacity: open ? "0.6" : "1" }}>
            <SidebarIcon />
          </button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <Sidebar onClose={() => setOpen(false)} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
