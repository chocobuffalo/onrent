"use client";

import { useState } from "react";
import useOperatorTable from "@/hooks/backend/useOperatorTable";
import { ImSpinner8 } from "react-icons/im";
import OperatorDetailModal from "@/components/organism/OperatorDetailModal/OperatorDetailModal";
import updateOperator from "@/services/updateOperator.adapter";
import deleteOperator from "@/services/deleteOperator.adapter";

export default function OperatorTable() {
  const { operators, loading, error, refetch } = useOperatorTable();
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(null);

  // Cambiar estado activo/inactivo usando adapter
  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const result = await updateOperator(token, id, { id, active: !isActive });

      if (!result.success) throw new Error(result.message || "Error al cambiar estado");

      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar operador usando adapter
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const result = await deleteOperator(token, id);

      if (!result.success) throw new Error(result.message || "Error al eliminar operador");

      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <ImSpinner8 className="animate-spin" size={24} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (operators.length === 0) {
    return <p className="text-gray-500">No hay operadores registrados</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Correo</th>
            <th className="px-4 py-2 text-left">Teléfono</th>
            <th className="px-4 py-2 text-left">Disponibilidad</th>
            <th className="px-4 py-2 text-left">Activo</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op) => (
            <tr key={op.operator_id} className="border-t">
              <td className="px-4 py-2">{op.name}</td>
              <td className="px-4 py-2">{op.email}</td>
              <td className="px-4 py-2">{op.phone}</td>
              <td className="px-4 py-2">{op.availability}</td>
              <td className="px-4 py-2">{op.active ? "Sí" : "No"}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => setSelectedOperatorId(op.operator_id)}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </button>
                <button
                  onClick={() => toggleActive(op.operator_id, op.active)}
                  className={
                    op.active
                      ? "text-red-600 hover:underline"
                      : "text-green-600 hover:underline"
                  }
                >
                  {op.active ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => handleDelete(op.operator_id)}
                  className="text-gray-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalle */}
      {selectedOperatorId && (
        <OperatorDetailModal
          operatorId={selectedOperatorId}
          onClose={() => setSelectedOperatorId(null)}
          refetch={refetch}
        />
      )}
    </div>
  );
}
