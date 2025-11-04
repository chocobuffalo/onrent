// components/NotificationListener.tsx
"use client";
import { useEffect } from "react";
import { useNotifications } from "@/hooks/frontend/ui/useNotifications";

export default function NotificationListener() {
  const { showNotification, NotificationUI } = useNotifications();

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL!;
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.message) {
            showNotification(data.message);
          }
        } catch (err) {
          console.error("Error parsing WS message:", err);
        }
      };

      ws.onclose = () => {
        console.warn("🔌 WS cerrado, reconectando en 3s…");
        reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [showNotification]);

  return <NotificationUI />;
}
