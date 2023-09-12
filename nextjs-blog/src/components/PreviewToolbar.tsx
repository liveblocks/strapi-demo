"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { useState } from "react";
import { PreviewSidebar } from "@/components/PreviewSidebar";
import * as Collapsible from "@radix-ui/react-collapsible";
import styles from "./PreviewToolbar.module.css";

export function PreviewToolbar() {
  return (
    <ClientSideSuspense fallback={null}>{() => <Toolbar />}</ClientSideSuspense>
  );
}

function Toolbar() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className={styles.toolbar} data-reverse-theme="true">
        <Collapsible.Trigger asChild>
          <button>{open ? "Close comments" : "Open comments"}</button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <PreviewSidebar onClose={() => setOpen(false)} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
