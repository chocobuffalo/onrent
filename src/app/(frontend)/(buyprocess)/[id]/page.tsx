import MachineDetail from "@/components/organism/MachineDetail/MachineDetail";
import BackButton from '../../../../components/atoms/BackButton/BackButton';

interface MachineDetailPageProps {
  params: Promise<{ machinetype: string; id: string }>;
  searchParams: Promise<{ projectId?: string }>;
}

export default async function MachineDetailPage({ 
  params, 
  searchParams 
}: MachineDetailPageProps) {
  const { machinetype, id } = await params;
  const { projectId } = await searchParams;

  const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN;
  const res = await fetch(`${apiBase}/api/catalog/${id}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    return <div className="text-red-500 text-center mt-10">Error al cargar datos</div>;
  }

  const machine = await res.json();

  if (!machine) {
    return <div className="text-red-500 text-center mt-10">Máquina no encontrada</div>;
  }

  const machineWithType = {
    ...machine,
    machinetype
  };

  return (
    <>
      <BackButton size={24} className="pl-10 pt-4" />
      <MachineDetail 
        machine={machineWithType} 
        projectId={projectId}
      />
    </>
  );
}