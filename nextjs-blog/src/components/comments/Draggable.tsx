import { ComponentProps, useEffect, useRef, useState } from "react";
import { getCoordsFromPointerEvent } from "@/lib/coords";

interface RootProps extends ComponentProps<"div"> {
  draggingOnStart: (e: PointerEvent) => void;
  draggingOnMove: (e: PointerEvent) => void;
  draggingOnStop: (e: PointerEvent) => void;
}

export function Root(props: RootProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  draggingRef.current = dragging;

  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: -10000,
    y: -10000,
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    function handlePointerDown(e: PointerEvent) {
      if (!ref.current) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.pageX - rect.left - window.scrollX,
        y: e.pageY - rect.top - window.scrollY,
      };
      dragStart.current = {
        x: e.pageX,
        y: e.pageY,
      };
      setDragging(true);
      draggingRef.current = true;
    }

    function handlePointerUp(e: PointerEvent) {
      if (!draggingRef.current) {
        return;
      }

      onDragChange(false);
      setDragging(false);
      draggingRef.current = false;

      const accurateCoords = getCoordsFromPointerEvent(e, dragOffset.current);
      if (!accurateCoords) {
        return;
      }

      const { cursorSelectors, cursorX, cursorY } = accurateCoords;

      console.log(cursorSelectors);
    }

    function handlePointerMove(e: PointerEvent) {
      if (!draggingRef.current) {
        return;
      }

      onDragChange(true);

      const { x, y } = dragOffset.current;
      setCoords({
        x: e.pageX - x,
        y: e.pageY - y,
      });
    }

    const handle = ref.current.querySelector("[data-drag-handle]");

    if (handle instanceof HTMLElement) {
      handle.addEventListener("pointerdown", handlePointerDown);
    }

    document.documentElement.addEventListener("pointerup", handlePointerUp);
    document.documentElement.addEventListener("pointermove", handlePointerMove);

    return () => {
      if (handle instanceof HTMLElement) {
        handle.removeEventListener("pointerdown", handlePointerDown);
      }
      document.documentElement.removeEventListener(
        "pointerup",
        handlePointerUp
      );
      document.documentElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  return (
    <div {...props} ref={ref}>
      {props.children}
    </div>
  );
}

interface HandleProps extends ComponentProps<"div"> {}

export function Handle(props: HandleProps) {
  return <div data-drag-handle={true}>{props.children}</div>;
}
