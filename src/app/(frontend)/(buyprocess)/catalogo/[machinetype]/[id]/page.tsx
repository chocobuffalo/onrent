import MachineDetail from "@/components/organism/MachineDetail/MachineDetail";
import { sampleData } from "@/components/organism/Catalogue/sampleCatalogueData";

interface MachineDetailPageProps {
  params: Promise<{ machinetype: string; id: string }>;
}

export default async function MachineDetailPage({ params }: MachineDetailPageProps) {
  const { machinetype, id } = await params; // Await requerido en Next 15
  const machine = sampleData.find((item) => item.id === parseInt(id));

  if (!machine) {
    return <div className="text-red-500 text-center mt-10">Máquina no encontrada</div>;
  }

  return <MachineDetail machine={{ ...machine, machinetype }} />;
}

