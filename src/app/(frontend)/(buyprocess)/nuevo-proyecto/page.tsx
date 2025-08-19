import ReserveForm from "@/components/organism/buyprocess/reserveform/reserveForm";
import NewProjectForm from "@/components/organism/NewProjectForm/NewProjectForm";

export const metadata = {
    title: "Nuevo Proyecto",
    description: "Crea un nuevo proyecto y reserva tu espacio.",
}

export default function NuevoProyecto() {
    
    return(
        <section className="py-[70px] px-4">
            <div className="mx-auto container">
            <h1 className="text-2xl font-bold  mb-6">Nuevo Proyecto</h1>
                <NewProjectForm />
            </div>
       </section>        
    );
}
