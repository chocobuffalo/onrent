// src/components/organism/NotificationToast/NotificationToast.tsx
"use client";
import React, { useState } from "react";

type Props = {
  message: string | null;
  onClose: () => void;
  // Tailwind max-w-* opcional; si lo pasas, sobreescribe el default
  maxWidth?: string;
};

export default function NotificationToast({ message, onClose, maxWidth = "max-w-md" }: Props) {
  const [expanded, setExpanded] = useState(false);
  if (!message) return null;

  const PREVIEW_CHARS = 600;
  const isLong = message.length > PREVIEW_CHARS;
  const preview = isLong && !expanded ? message.slice(0, PREVIEW_CHARS) + "…" : message;

  return (
    <div
      className={`fixed bottom-4 right-4 ${maxWidth} w-full z-[99999]`}
      aria-live="polite"
      role="dialog"
      aria-label="Notificación"
    >
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        {/* Header: close y toggle siempre visibles */}
        <div className="flex items-start justify-between px-4 py-2 border-b border-gray-100 sticky top-0 bg-white">
          <div className="text-sm font-medium text-gray-800">Notificación</div>
          <div className="flex items-center gap-2">
            {isLong && (
              <button
                onClick={() => setExpanded((s) => !s)}
                className="text-xs text-blue-600 hover:underline"
                aria-expanded={expanded}
              >
                {expanded ? "Ver menos" : "Leer más"}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Cerrar notificación"
              className="text-gray-500 hover:text-gray-800 p-1 rounded"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body: forzamos wrap y limitamos altura con scroll interno */}
        <div
          className="px-4 py-3 text-sm text-gray-700 break-words whitespace-pre-wrap"
          style={{
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {preview}
        </div>
      </div>
    </div>
  );
}
