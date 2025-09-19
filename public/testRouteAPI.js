// Test para validar el endpoint de rutas AWS Location Services

async function testRouteAPI() {
  const origin = { lat: 19.427, lng: -99.167 };
  const destination = { lat: 19.4326, lng: -99.1332 };

  try {
    const res = await fetch("/api/get-map/route/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination }),
    });
    if (!res.ok) {
      console.error("Error HTTP:", res.status);
      return;
    }
    const data = await res.json();
    console.log("Respuesta de la API de rutas:", data);
    if (data?.Legs?.[0]?.Geometry?.LineString) {
      console.log("Coordenadas de la ruta:", data.Legs[0].Geometry.LineString);
    } else {
      console.warn("No se encontró la ruta en la respuesta");
    }
  } catch (err) {
    console.error("Error al probar el endpoint de rutas:", err);
  }
}

testRouteAPI();
