"use client";

import useOperatorDetail from "@/hooks/backend/useOperatorDetail";
import updateOperator from "@/services/updateOperator.adapter";

interface OperatorDetailModalProps {
  operatorId: number;
  onClose: () => void;
  refetch?: () => Promise<void>; // 👈 sigue opcional
}

export default function OperatorDetailModal({
  operatorId,
  onClose,
  refetch,
}: OperatorDetailModalProps) {
  const { operator, loading, error } = useOperatorDetail(operatorId);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      // 👇 usamos el adapter en lugar de fetch directo
      const result = await updateOperator(token, operatorId, {
        id: operatorId,
        availability: "busy", // ejemplo: actualizar disponibilidad
      });

      if (!result.success) {
        throw new Error(result.message || "Error al actualizar operador");
      }

      if (refetch) {
        await refetch();
      }

      alert("Operador actualizado correctamente");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al actualizar el operador");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Detalle del Operador</h2>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {operator && (
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {operator.name}</p>
            <p><strong>Correo:</strong> {operator.email}</p>
            <p><strong>Teléfono:</strong> {operator.phone}</p>
            <p><strong>CURP:</strong> {operator.curp}</p>
            <p><strong>Licencia:</strong> {operator.license_number} ({operator.license_type})</p>
            <p><strong>Región:</strong> {operator.region_name}</p>
            <p><strong>Disponibilidad:</strong> {operator.availability}</p>
            <p><strong>Experiencia:</strong> {operator.experience_years} años ({operator.experience_level})</p>
            <p><strong>Notas:</strong> {operator.notes}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
