// NotificationToast.tsx
"use client";
import React from "react";

type Props = {
  message: string | null;
  onClose: () => void;
};

export default function NotificationToast({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg border p-4 rounded z-50">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-sm text-red-500 hover:text-red-700"
      >
        Cerrar
      </button>
    </div>
  );
}
