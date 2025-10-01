import { Metadata } from "next";
import AssignedTasksTable from "@/components/organism/AssignedTasksTable/AssignedTasksTable";

export const metadata: Metadata = {
  title: 'Tareas Asignadas',
  description: 'Tareas asignadas por el proveedor',
};

export default function AssignedTasks() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">TAREAS ASIGNADAS</h1>
      <AssignedTasksTable />
    </div>
  );
}