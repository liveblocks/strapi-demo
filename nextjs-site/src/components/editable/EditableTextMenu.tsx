"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import styles from "./EditableTextMenu.module.css";

export function EditableTextMenu({ children }: { children: ReactNode }) {
  return (
    <ClientSideSuspense fallback={<>{children}</>}>
      {() => <LoadedEditableTextMenu>{children}</LoadedEditableTextMenu>}
    </ClientSideSuspense>
  );
}

function LoadedEditableTextMenu({ children }: { children: ReactNode }) {
  const [editableElements, setEditableElements] = useState<Element[]>([]);
  const getCurrentElements = useCurrentElements();

  const handleOpen = useCallback(
    (open: boolean) => {
      if (!open) {
        setEditableElements([]);
        return;
      }

      setEditableElements(getCurrentElements());
    },
    [getCurrentElements]
  );

  const handleSelect = useCallback((element: Element) => {
    console.log(element);
  }, []);

  return (
    <ContextMenu.Root onOpenChange={handleOpen}>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={styles.menu}>
          {editableElements.map((editable: Element, index) => (
            <ContextMenu.Item
              key={index}
              onSelect={() => handleSelect(editable)}
              className={styles.menuItem}
            >
              {(editable as HTMLElement)?.innerText || editable.innerHTML}
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

function useCurrentElements() {
  const [currentElements, setCurrentElements] = useState<Element[]>([]);
  const coords = useRef({ x: -10000, y: -10000 });

  // Get current page coords
  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      coords.current = { x: e.clientX, y: e.clientY };
    }

    window.addEventListener("pointermove", onPointerMove);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const getCurrentElements = useCallback(() => {
    const { x, y } = coords.current;
    const allElements = document.elementsFromPoint(x, y);

    const editableElements: Element[] = [];
    let hidableElements: Element[] = [];

    // Find all editable text elements
    allElements.forEach((el) => {
      const isEditable = (el as HTMLElement)?.dataset.strapiEditable;
      if (isEditable) {
        editableElements.push(el);
      } else {
        hidableElements.push(el);
      }
    });

    // Don't hide children of editable elements, e.g. the contentEditable element
    hidableElements = hidableElements.filter((hidable) => {
      return !editableElements.some((editable) => editable.contains(hidable));
    });

    // Make non-current elements click-through
    // for (const el of hidableElements) {
    //   if ("style" in (el as HTMLElement)) {
    //     (el as HTMLElement).style.pointerEvents = "none";
    //   }
    // }

    return editableElements;
  }, []);

  return getCurrentElements;
}

function useSelectElementsBelow() {
  const state = useRef<"default" | "selecting">("default");
  const elements = useRef<Element[]>([]);
  const hiddenElements = useRef<Element[]>([]);
  const elementsPointerState = useRef<WeakMap<Element, string>>(new WeakMap());
  const elementIndex = useRef<number>(0);
  const selectedElement = useRef<Element | null>(null);
  const coords = useRef({ x: -10000, y: -10000 });

  useEffect(() => {
    function resetPointerEvents() {}

    // When mouse move, go back to default state
    function onPointerMove(e: PointerEvent) {
      const { x, y } = coords.current;

      if (state.current === "selecting") {
        if (e.clientX !== x || e.clientY !== y) {
          state.current = "default";
          elementIndex.current = 0;

          console.log("reset");
          elementsPointerState.current;
          unstyleCurrent(selectedElement.current);
          hiddenElements.current.forEach((el) => {
            if ("style" in (el as HTMLElement)) {
              (el as HTMLElement).style.pointerEvents = "auto";
            }
          });
          elements.current = [];
          hiddenElements.current = [];
        }
      }

      coords.current = { x: e.clientX, y: e.clientY };
    }

    function selectNextElement(e: KeyboardEvent) {
      if (e.key !== "Shift") {
        return;
      }

      if (state.current !== "selecting") {
        state.current = "selecting";
        console.log(2, state.current);
      }

      if (!elements.current.length) {
        const { x, y } = coords.current;
        elements.current = document.elementsFromPoint(x, y);
      }

      const editableElements: Element[] = [];
      let hidableElements: Element[] = [];

      // Find all editable text elements
      elements.current.forEach((el) => {
        const isEditable = (el as HTMLElement)?.dataset.strapiEditable;
        if (isEditable) {
          editableElements.push(el);
        } else {
          hidableElements.push(el);
        }
      });

      // Don't hide children of editable elements, e.g. the contentEditable element
      hidableElements = hidableElements.filter((hidable) => {
        return !editableElements.some((editable) => editable.contains(hidable));
      });
      hiddenElements.current = hidableElements;

      selectedElement.current = editableElements[
        elementIndex.current % editableElements.length
      ] as HTMLElement;

      // Make non-current elements click-through
      for (const el of hidableElements) {
        if ("style" in (el as HTMLElement)) {
          (el as HTMLElement).style.pointerEvents = "none";
        }
      }

      styleCurrent(selectedElement.current);

      console.log(editableElements);

      // Increment element for next time
      elementIndex.current++;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", selectNextElement);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", selectNextElement);
    };
  }, []);

  // return { x: coords.x, y: coords.y, show: state === "menu" }
}

function styleCurrent(currentElement: Element | null) {
  if (currentElement) {
    if ("style" in (currentElement as HTMLElement)) {
      const el = currentElement as HTMLElement;
      el.style.pointerEvents = "auto";
      el.style.display = "block";
      el.style.outline = "2px solid rgba(255, 255, 255, 0.4)";
    }
  }
}

function unstyleCurrent(currentElement: Element | null) {
  if (currentElement) {
    if ("style" in (currentElement as HTMLElement)) {
      const el = currentElement as HTMLElement;
      el.style.removeProperty("pointerEvents");
      el.style.removeProperty("display");
      el.style.removeProperty("outline");
    }
  }
}
