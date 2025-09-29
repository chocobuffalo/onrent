// services/locationService.ts
export async function getAvailableDevices(token?: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/location/sync/list`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Si se proporciona token, agregarlo a los headers
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers,
  });
  
  if (response.ok) {
    const data = await response.json();
    
    // Normalizar la estructura de datos para que coincida con lo que espera el componente
    const normalizedData = {
      count: data.count || 0,
      locations: [
        ...(data.machines || []).map((machine: any) => ({
          entity_id: machine.entity_id,
          entity_type: 'maquinaria',
          timestamp: machine.timestamp,
          status: machine.status,
          location: {
            latitude: machine.latitude,
            longitude: machine.longitude
          },
          // Campos adicionales de máquinas
          model: machine.model,
          brand: machine.brand,
          name: machine.name,
          machine_type: machine.machine_type,
          daily_rate: machine.daily_rate,
          provider_id: machine.provider_id,
          certified: machine.certified
        })),
        ...(data.operators || []).map((operator: any) => ({
          entity_id: operator.entity_id,
          entity_type: 'operador',
          timestamp: operator.timestamp,
          status: operator.status,
          location: {
            latitude: operator.latitude,
            longitude: operator.longitude
          }
        }))
      ]
    };
    
    return normalizedData;
  }
  
  throw new Error(`Error fetching devices: ${response.status} ${response.statusText}`);
}