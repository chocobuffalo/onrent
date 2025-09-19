import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export interface MachinePosition {
  id: string;
  lat: number;
  lng: number;
  [key: string]: any;
}

export const useMachineTracking = (serverUrl: string) => {
  const [machines, setMachines] = useState<MachinePosition[]>([]);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const socket = io(serverUrl, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("machines:update", (data: MachinePosition[]) => {
      setMachines(data);
    });

    // Opcional: recibir actualización individual
    socket.on("machine:position", (machine: MachinePosition) => {
      setMachines((prev) => {
        const idx = prev.findIndex((m) => m.id === machine.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = machine;
          return updated;
        }
        return [...prev, machine];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  return machines;
};