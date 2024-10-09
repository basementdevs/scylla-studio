"use client";

import { ReactNode, useEffect } from "react";

interface ModalProperties {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProperties) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      globalThis.addEventListener("keydown", handleEscape);
    } else {
      globalThis.removeEventListener("keydown", handleEscape);
    }

    return () => globalThis.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black backdrop-blur-sm bg-opacity-50">
      <div className="rounded-xl bg-card p-6 rounded w-full max-w-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:hover:text-white"
          >
            &#x2715;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
