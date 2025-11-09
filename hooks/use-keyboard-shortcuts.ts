"use client";
import { useEffect } from "react";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K: focus search (if you have a search bar in the future)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Placeholder for future search bar focus
        console.log("Open search...");
      }

      // Cmd/Ctrl+/: toggle chat
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        const chatHeader = document.querySelector('[aria-label*="chat"]') as HTMLElement;
        chatHeader?.click();
        console.log("Toggle chat...");
      }

      // Escape: close modals/drawers
      if (e.key === "Escape") {
        // Let individual components handle this via their own listeners
        console.log("Escape pressed...");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
