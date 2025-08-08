import { useState } from "react";
import { useParams } from "next/navigation"; // ← Necesario en Next 15
import { sampleData } from "@/components/organism/Catalogue/sampleCatalogueData";
import { CatalogueItem } from "@/components/organism/Catalogue/types";
import SeguimientoMapa from "@/components/organism/MapSLA/seguimientoMapa";
import Image from "next/image";
export default function ReserveForm(){
// Obtener params desde la URL

  const [showSeguimiento, setShowSeguimiento] = useState(false);
  const [nombreResponsable, setNombreResponsable] = useState("");
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [ubicacionObra, setUbicacionObra] = useState("");
  const [duracion, setDuracion] = useState("");

  const handleGuardar = () => {
    // Simula guardar la info
    console.log("Guardando proyecto:", nombreProyecto);

    // Mostrar el modal del mapa
    setShowSeguimiento(true);
  };
  const params = useParams();
  const machineId = parseInt(params.id as string);

  // Buscar máquina
  const machine: CatalogueItem | undefined = sampleData.find(
    (item) => item.id === machineId
  );

  // Estados básicos del formulario

  // Si no se encuentra la máquina
  if (!machine) {
    return (
      <div className="text-center text-red-500 mt-10">
        Máquina no encontrada
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 py-20 space-y-8">
      {/* Resumen de la máquina */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={machine.image}
          alt={machine.name}
          className="w-24 h-24 object-cover rounded-lg border"
        />
        <div>
          <h1 className="text-xl font-bold">{machine.name}</h1>
          <p className="text-green-600 font-semibold">
            {machine.price} USD/Día
          </p>
          <p className="text-sm text-gray-500">{machine.location}</p>
        </div>
      </div>

      {/* 1. Datos Básicos */}
      <section>
        <h2 className="text-xl font-semibold mb-4">1. Datos Básicos</h2>

        {/* Nombre del responsable */}
        <label className="block text-sm font-medium mb-1">
          Nombre del responsable
        </label>
        <input
          type="text"
          value={nombreResponsable}
          onChange={(e) => setNombreResponsable(e.target.value)}
          placeholder="Ej: Erik González"
          className="w-full border rounded-lg p-2 mb-4"
        />

        {/* Nombre del proyecto */}
        <label className="block text-sm font-medium mb-1">
          Nombre del proyecto
        </label>
        <input
          type="text"
          value={nombreProyecto}
          onChange={(e) => setNombreProyecto(e.target.value)}
          placeholder="Construcción de edificio"
          className="w-full border rounded-lg p-2 mb-4"
        />

        {/* Ubicación */}
        <label className="block text-sm font-medium mb-1">
          Ubicación de la obra
        </label>
        <input
          type="text"
          value={ubicacionObra}
          onChange={(e) => setUbicacionObra(e.target.value)}
          placeholder="San Pedro Garza García 967, Nuevo León, México"
          className="w-full border rounded-lg p-2 mb-4"
        />

        {/* Duración */}
        <label className="block text-sm font-medium mb-1">
          Duración estimada
        </label>
        <input
          type="text"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          placeholder="20 semanas"
          className="w-full border rounded-lg p-2"
        />
      </section>

      {/* 2. Condiciones del sitio */}
      <section>
        <h2 className="text-xl font-semibold mb-4">2. Condiciones del sitio</h2>

        {/* Tipo de trabajo */}
        <label className="block text-sm font-medium mb-1">
          Tipo de trabajo
        </label>
        <input
          type="text"
          placeholder="Verter cimientos"
          className="w-full border rounded-lg p-2 mb-4"
        />

        {/* Condiciones del terreno */}
        <label className="block text-sm font-medium mb-1">
          Condiciones del terreno
        </label>
        <div className="flex gap-2 mb-4">
          {["Firme", "Lodoso", "Inclinado", "Obstáculos"].map((cond) => (
            <button
              key={cond}
              className="px-3 py-1 border rounded-full text-sm text-orange-500 border-orange-400 hover:bg-orange-100"
            >
              {cond}
            </button>
          ))}
        </div>

        {/* Lugar del resguardo */}
        <label className="block text-sm font-medium mb-1">
          Lugar del resguardo
        </label>
        <input type="file" className="w-full border rounded-lg p-2 mb-2" />
        <p className="text-xs text-gray-400 mb-4">
          Esto nos ayuda a validar el terreno y asignar maquinaria compatible
        </p>

        {/* Seguridad en el sitio */}
        <label className="block text-sm font-medium mb-1">
          Seguridad en el sitio
        </label>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-1">
            <input type="radio" name="seguridad" /> Sí
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="seguridad" /> No
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="seguridad" /> Otro
          </label>
        </div>

        {/* Acceso a la obra */}
        <label className="block text-sm font-medium mb-1">
          Acceso a la obra
        </label>
        <input
          type="text"
          placeholder="Describa el acceso al sitio"
          className="w-full border rounded-lg p-2"
        />
      </section>

      {/* 3. Requerimientos de maquinaria */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          3. Requerimientos de maquinaria
        </h2>

        {/* Tipo de maquinaria */}
        <label className="block text-sm font-medium mb-1">
          Tipo de maquinaria requerida
        </label>
        <select className="w-full border rounded-lg p-2 mb-4">
          <option>Seleccione el tipo de maquinaria</option>
          <option>Retroexcavadora</option>
          <option>Camión de carga</option>
          <option>Grúa</option>
        </select>

        {/* Repuestos requeridos */}
        <label className="block text-sm font-medium mb-1">
          Repuestos requeridos
        </label>
        <input
          type="text"
          placeholder="Ej: 2 baldes, filtros..."
          className="w-full border rounded-lg p-2 mb-4"
        />
      </section>
      <button
        onClick={handleGuardar}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        Guardar y ver seguimiento
      </button>

      {/* Modal con mapa y barra */}
      {showSeguimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-6xl relative">
            {/* Botón cerrar */}
            <button
              onClick={() => setShowSeguimiento(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Seguimiento de Proveedor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna izquierda: barra de progreso */}
              <div className="space-y-6">
                <p className="font-semibold">
                  Buscando proveedores más cercanos
                </p>
                <p className="text-sm text-gray-500">
                  El proveedor ha aceptado tu solicitud
                </p>

                {/* Barra de progreso tipo puntos */}
                <div className="flex items-center justify-between">
                  {[1, 2, 3, 4, 5].map((step, index) => (
                    <div key={index} className="flex-1 flex items-center">
                      {/* Punto */}
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index < 4 ? "bg-indigo-900" : "bg-gray-300"
                        }`}
                      ></div>
                      {/* Línea entre puntos */}
                      {index < 4 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            index < 3 ? "bg-indigo-900" : "bg-gray-300"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Estado actual */}
                <p className="font-medium">
                  Estado:{" "}
                  <span className="bg-indigo-900 text-white px-2 py-1 rounded text-sm">
                    Completo
                  </span>
                </p>
              </div>

              {/* Columna derecha: mapa */}
              <div className="md:col-span-2 h-[450px] rounded-lg overflow-hidden shadow border">
                <SeguimientoMapa />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}