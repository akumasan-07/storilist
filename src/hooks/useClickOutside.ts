import { useEffect, useRef, RefObject } from "react";

/**
 * Hook that detects clicks outside a referenced element and Escape key presses.
 * Invokes the handler callback when either event occurs while active.
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  active: boolean = true
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!active) return;

    function handleClickOutside(event: MouseEvent) {
      const el = ref.current;
      const target = event.target as Node | null;

      if (!el || !target) return;

      // Ignore events whose target is inside the referenced element
      if (el === target || el.contains(target)) {
        return;
      }

      // Also verify with composedPath for SVGs and shadow DOM
      if (typeof event.composedPath === "function") {
        const path = event.composedPath();
        if (path.includes(el)) {
          return;
        }
      }

      handlerRef.current();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handlerRef.current();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  return ref;
}
