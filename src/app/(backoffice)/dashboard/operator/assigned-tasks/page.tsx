import { Metadata } from "next"

 export const metadata:Metadata = {
  title: 'Tareas Asignadas',
  description: 'Tareas asignadas por el proveedor',
};
export default function AssignedTasks() {
  return (
    <div className="container">
      <h1>Tareas Asignadas</h1>
    </div>
  );
}
