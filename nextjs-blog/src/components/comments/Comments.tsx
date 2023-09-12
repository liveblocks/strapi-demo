"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { Canvas } from "@/components/comments/Canvas";
import { Toolbar } from "@/components/comments/Toolbar";

export function Comments() {
  return (
    <ClientSideSuspense fallback={null}>
      {() => (
        <>
          <Toolbar />
          <Canvas />
        </>
      )}
    </ClientSideSuspense>
  );
}
