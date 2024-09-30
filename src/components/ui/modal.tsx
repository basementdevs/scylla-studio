"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEscape);
    } else {
      window.removeEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
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
