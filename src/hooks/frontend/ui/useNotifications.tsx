"use client";
import { useState } from "react";
import NotificationToast from "@/components/organism/NotificationToast/NotificationToast";

export function useNotifications() {
  const [message, setMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => setMessage(msg);
  const closeNotification = () => setMessage(null);

  // 👇 Declaramos el tipo explícitamente
  const NotificationUI: React.FC = () => {
    if (message === null) return null;
    return <NotificationToast message={message} onClose={closeNotification} />;
  };

  return { showNotification, NotificationUI };
}
