"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { useParams } from "next/navigation";

export default function Room({ children }: { children: ReactNode }) {
  const { slug } = useParams();

  return (
    <RoomProvider id={slug as string} initialPresence={{}} initialStorage={{}}>
      {children}
    </RoomProvider>
  );
}
