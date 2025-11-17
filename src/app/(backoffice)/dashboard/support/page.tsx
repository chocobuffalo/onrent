// app/dashboard/support/page.tsx
"use client";
import React from "react";
import IncidentForm from "@/components/organism/Support/IncidentForm"; 

export default function SupportPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Soporte</h1>
      <p className="text-sm text-gray-500 mb-6">Reporta incidentes, solicita cancelaciones o eliminación de cuenta.</p>

      <section className="max-w-2xl">
        <IncidentForm />
      </section>
    </main>
  );
}
