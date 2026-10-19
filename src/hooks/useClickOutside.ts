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

  useEffect(() => {
    if (!active) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handler, active]);

  return ref;
}
