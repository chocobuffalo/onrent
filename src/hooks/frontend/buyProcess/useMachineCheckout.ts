import { useState, useEffect } from 'react';
import { UseMachineDataReturn, Machine } from '@/types/checkout';

export function useMachineCheckout(machineId: string): UseMachineDataReturn {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (machineId) {
      const mockData: Machine = {
        id: machineId,
        name: "Retroexcavadora CAT 320D",
        price: 850,
        machinetype: "excavadoras", 
        description: "Retroexcavadora pesada para construcción",
        availability: true
      };
      setMachine(mockData);
    }
  }, [machineId]);

  return { machine, isLoading, error };
}