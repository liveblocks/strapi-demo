"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type DraggableContextType = {
  registerHandle: (handle: HTMLElement) => void;
  unregisterHandle: () => void;
};

const DraggableContext = createContext<DraggableContextType | null>(null);

export const Root: React.FC = ({ children }) => {
  const [handle, setHandle] = useState<HTMLElement | null>(null);

  const contextValue: DraggableContextType = {
    registerHandle: (newHandle) => setHandle(newHandle),
    unregisterHandle: () => setHandle(null),
  };

  return (
    <DraggableContext.Provider value={contextValue}>
      {children}
    </DraggableContext.Provider>
  );
};

export const Handle: React.FC = ({ children }) => {
  const context = useContext(DraggableContext);

  if (!context) {
    throw new Error("Draggable.Handle must be used within Draggable.Root");
  }

  const { registerHandle, unregisterHandle } = context;

  const handleRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (handleRef.current) {
      registerHandle(handleRef.current);
    }

    return () => {
      unregisterHandle();
    };
  }, [registerHandle, unregisterHandle]);

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();

    if (handleRef.current) {
      const rect = handleRef.current.getBoundingClientRect();
      startPosRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    document.documentElement.setPointerCapture(event.pointerId);
    document.documentElement.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (handleRef.current && startPosRef.current) {
      const x = event.clientX - startPosRef.current.x;
      const y = event.clientY - startPosRef.current.y;
      handleRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handlePointerUp = () => {
    startPosRef.current = null;
    document.documentElement.removeEventListener(
      "pointermove",
      handlePointerMove
    );
    document.documentElement.removeEventListener("pointerup", handlePointerUp);
  };

  return (
    <div ref={handleRef} onPointerDown={handlePointerDown}>
      {children}
    </div>
  );
};
