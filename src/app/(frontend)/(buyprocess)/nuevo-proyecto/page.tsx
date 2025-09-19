import BackButton from "@/components/atoms/BackButton/BackButton";
import NewProjectForm from "@/components/organism/NewProjectForm/NewProjectForm";
interface NewProjectPageProps {
  searchParams: Promise<{ 
    machineId?: string; 
    machinetype?: string;
    projectId?: string;
  }>;
}

export const metadata = {
    title: "Nuevo Proyecto",
    description: "Crea un nuevo proyecto y reserva tu espacio.",
}

export default async function NuevoProyecto({ searchParams }: NewProjectPageProps) {
    const { machineId, machinetype, projectId } = await searchParams;
    
    return(
        <>
         <BackButton size={24} className="pl-10 pt-4" />
        <section className="py-[70px] px-4">
            <div className="mx-auto container">
            <h1 className="text-2xl font-bold  mb-6">
              {projectId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h1>
                <NewProjectForm 
                  projectID={projectId}
                  machineId={machineId}
                  machinetype={machinetype}
                />
            </div>
       </section>        
        </>
    );
}