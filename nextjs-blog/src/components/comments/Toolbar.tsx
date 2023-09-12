"use client";

import { useState } from "react";
import { Sidebar } from "@/components/comments/Sidebar";
import * as Collapsible from "@radix-ui/react-collapsible";
import styles from "./Toolbar.module.css";
import { NewCommentButton } from "@/components/comments/NewCommentButton";
import { SidebarIcon } from "@/components/icons/SidebarIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";

export function Toolbar() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className={styles.toolbar} data-reverse-theme="true">
        <NewCommentButton />
        <Collapsible.Trigger asChild>
          <button>{open ? <CloseIcon /> : <SidebarIcon />}</button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <Sidebar onClose={() => setOpen(false)} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
