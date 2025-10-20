"use client";

import { useState } from "react";
import AddOperator from "@/components/atoms/AddOperator/AddOperator";
import OperatorForm from "@/components/organism/OperatorForm/OperatorForm";
import OperatorTable from "@/components/organism/OperatorTable/OperatorTable";

export default function OperatorUI() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Operadores</h1>
        <AddOperator func={() => setShowForm(true)} active={showForm} />
      </div>

      <OperatorTable />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-2xl relative">
            {/* Botón de cerrar en la esquina superior derecha */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <OperatorForm
              onCreated={() => {
                setShowForm(false);
                // 🔹 Dispara evento global para refrescar tabla
                window.dispatchEvent(new CustomEvent("operatorCreated"));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
