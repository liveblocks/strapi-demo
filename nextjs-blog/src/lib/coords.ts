import { AccurateCursorPositions, DragOffset } from "@/liveblocks.config";

export function getCoordsFromPointerEvent<El>(
  e: PointerEvent,
  dragOffset: DragOffset = { x: 0, y: 0 }
): AccurateCursorPositions | null {
  if (!e.target || !(e.target as any)?.getBoundingClientRect) {
    return null;
  }

  const target = e.target as HTMLElement;

  // === GET SELECTORS FOR CURRENT ELEMENT =======================================
  const pathArray: HTMLElement[] = e.composedPath
    ? e.composedPath()
    : (e as any).path;

  let nthChildFromLowestIdSelectors: string[] = [];
  let nthChildSelectors: string[] = [];
  let classNameSelectors: string[] = [];

  let reachedBody = false;
  pathArray.forEach((el) => {
    if (reachedBody) {
      return;
    }

    if (el.nodeName?.toLowerCase() === "body") {
      reachedBody = true;
    }

    // Selector with nth child and HTML element types
    // More performant than: [...el.parentNode.children].indexOf(el) + 1
    const nthIndex =
      Array.prototype.indexOf.call(el.parentNode!.children, el) + 1;
    const currentNthChild = `${el.nodeName}:nth-child(${nthIndex})`;
    nthChildSelectors.push(currentNthChild);

    // Selector same as above, but stops at nearest id
    if (el?.id) {
      nthChildFromLowestIdSelectors = [`#${el.id}`];
    }
    nthChildFromLowestIdSelectors.push(currentNthChild);

    // Selector with just class names
    // More performant than: [...el.classList].map(CSS.escape).join('.')
    const classes = Array.prototype.map
      .call(el.classList, CSS.escape)
      .join(".");
    classNameSelectors.push(el.nodeName + (classes ? "." + classes : ""));
  });

  // Create CSS selectors
  const classNamePath = classNameSelectors.reverse().join(">") || "";
  const nthChildPath = nthChildSelectors.reverse().join(">") || "";
  const nthChildPathFromLowestId =
    nthChildFromLowestIdSelectors.reverse().join(">") || "";

  // If last element has id or data-strapi-editable
  const lastElement = pathArray[pathArray.length - 1];
  const id = lastElement?.id || "";
  const strapiData = lastElement?.dataset?.["strapi-editable"] || "";

  // Get percentage across current element
  const { width, height } = target.getBoundingClientRect();
  const xPercent = (e.offsetX - dragOffset.x) / width;
  const yPercent = (e.offsetY - dragOffset.y) / height;

  return {
    cursorSelectors: [
      strapiData,
      id,
      nthChildPathFromLowestId,
      nthChildPath,
      classNamePath,
    ],
    cursorX: xPercent,
    cursorY: yPercent,
  };
}

export function getCoordsFromAccurateCursorPositions({
  cursorSelectors,
  cursorX,
  cursorY,
}: AccurateCursorPositions) {
  if (typeof window === "undefined") {
    return null;
  }

  for (const selector of cursorSelectors) {
    if (selector) {
      try {
        const el = document.querySelector(selector);

        if (el) {
          const { top, left, width, height } = el.getBoundingClientRect();
          return {
            x: left + width * cursorX + window.scrollX,
            y: top + height * cursorY + window.scrollY,
          };
        }
      } catch (err) {
        // ignore
      }
    }
  }

  return null;
}
