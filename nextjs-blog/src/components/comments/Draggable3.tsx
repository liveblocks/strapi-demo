"use client";

import React, { useRef, useState } from "react";
import {
  getCoordsFromAccurateCursorPositions,
  getCoordsFromElement,
} from "@/lib/coords";

export const Draggable = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const draggableRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e) => {
    if (draggableRef.current) {
      const rect = draggableRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !draggableRef.current) return;

    const elementBelow = document.elementFromPoint(
      e.clientX - dragOffset.x,
      e.clientY - dragOffset.y
    ) as HTMLElement;
    if (elementBelow) {
      const coords = getCoordsFromElement(
        elementBelow,
        e.clientX,
        e.clientY,
        dragOffset
      );
      if (coords) {
        const actualCoords = getCoordsFromAccurateCursorPositions(coords);
        if (actualCoords) {
          draggableRef.current.style.left = `${actualCoords.x}px`;
          draggableRef.current.style.top = `${actualCoords.y}px`;
        }
      }
    }
  };

  return (
    <div
      ref={draggableRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: "absolute",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {children}
    </div>
  );
};
