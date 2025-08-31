"use client";

import DynamicTable from "@/components/atoms/DynamicTable/DynamicTable";
import AddEnginery from "@/components/atoms/AddEnginery/AddEnginery";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { toggleModal } from "@/libs/redux/features/ui/modalSlicer";
import useMachineryList from "@/hooks/backend/useMachineryList";

export default function MachineTable() {
  const active = useUIAppSelector((state) => state.modal.isOpen);
  const dispatch = useUIAppDispatch();

  const handleAddEnginery = () => {
    dispatch(toggleModal());
  };

  // Hook con toda la lógica de maquinarias
  const machineryData = useMachineryList();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de maquinaria</h1>
      
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <DynamicTable
            title="Lista de Maquinarias"
            items={machineryData.items}
            isLoading={machineryData.isLoading}
            error={machineryData.error}
            searchValue={machineryData.searchValue}
            columns={machineryData.columns}
            statusField={machineryData.statusField}
            statusOptions={machineryData.statusOptions}
            statusColors={machineryData.statusColors}
            actionButtons={machineryData.actionButtons}
            onSearch={machineryData.onSearch}
            onStatusChange={machineryData.onStatusChange}
          />
        </div>
        <div className="flex-shrink-0">
          <AddEnginery active={active} func={handleAddEnginery} />
        </div>
      </div>
    </div>
  );
}