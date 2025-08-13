import MachineDetail from "@/components/organism/MachineDetail/MachineDetail";
import { sampleData } from "@/components/organism/Catalogue/sampleCatalogueData";

interface MachineDetailPageProps {
  params: Promise<{ machinetype: string; id: string }>;
}

export default async function MachineDetailPage({ params }: MachineDetailPageProps) {
  const { machinetype, id } = await params;

  const res = await fetch(`http://18.117.182.83:8010/api/catalog/${id}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    return <div className="text-red-500 text-center mt-10">Error al cargar datos</div>;
  }

  const machine = await res.json();

  if (!machine) {
    return <div className="text-red-500 text-center mt-10">Máquina no encontrada</div>;
  }

  return <MachineDetail machine={{ ...machine, machinetype }} />;
}
