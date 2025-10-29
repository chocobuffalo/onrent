'use client';

import { useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DateInput from "@/components/atoms/dateinput/dateinput";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";
import { fixDate } from "@/utils/compareDate";

interface DateRentInputProps {
  grid?: boolean;
  projectName?: string;
  onProjectNameChange?: (value: string) => void;
  isManualMode?: boolean;
  onToggleManualMode?: () => void;
  projectId?: string;
  openProjects?: boolean;
  onOpenProjects?: (open: boolean) => void;
  projects?: { label: string; value: string }[] | null;
  onProjectSelect?: (option: { label: string; value: string }) => void;
  loadingProject?: boolean;
  DropdownComponent?: React.ComponentType<any>;
  showProjectSection?: boolean;
}

export default function DateRentInput({
  grid,
  projectName = "",
  onProjectNameChange,
  isManualMode = false,
  onToggleManualMode,
  projectId,
  openProjects = false,
  onOpenProjects,
  projects,
  onProjectSelect,
  loadingProject = false,
  DropdownComponent,
  showProjectSection = true,
}: DateRentInputProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const {
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    needProject,
  } = useDateRange();

  const fixedStartDate = typeof fixDate(startDate) === "object" ? fixDate(startDate) : undefined;

  let minDateForEnd: Date = today;
  if (fixedStartDate) {
    minDateForEnd = new Date(
      fixedStartDate.year,
      fixedStartDate.month - 1,
      fixedStartDate.day
    );
    minDateForEnd.setHours(0, 0, 0, 0);
  }

  const handleCreateProject = () => {
    const machineId = params.id;
    const machinetype = 'maquinaria';
    router.push(`/nuevo-proyecto?machineId=${machineId}&machinetype=${machinetype}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const path = event.composedPath();
      if (wrapperRef.current && !path.includes(wrapperRef.current)) {
        onOpenProjects?.(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onOpenProjects]);

  return (
    <div className="date-container w-full flex flex-col gap-3.5 items-end" ref={wrapperRef}>
      {/* Selector de fechas */}
      <div className={`date-rent-input grid w-full ${grid ? "md:grid-cols-2" : "md:grid-cols-1"} gap-2`}>
        <DateInput
          placeholder="Inicio"
          action={handleStartDateChange}
          value={startDate}
          minDate={today}
        />
        <DateInput
          placeholder="Fin"
          startDate={fixedStartDate}
          value={endDate}
          action={handleEndDateChange}
          minDate={minDateForEnd}
        />
      </div>

      {/* Sección de proyecto */}
      {needProject && showProjectSection && (
        <div className="w-full flex flex-col gap-3.5">
          <div className={`w-full gap-3 flex ${grid ? "flex-col lg:flex-row" : "flex-col"}`}>
            {/* Input de nombre del proyecto */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del proyecto
                </label>
                {!projectId && onToggleManualMode && (
                  <button
                    type="button"
                    onClick={onToggleManualMode}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    {isManualMode ? "Buscar proyecto existente" : "Escribir manualmente"}
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => onProjectNameChange?.(e.target.value)}
                  onClick={() => {
                    if (!isManualMode && !projectId && onOpenProjects) {
                      onOpenProjects(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      onOpenProjects?.(false);
                    }, 150);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={
                    isManualMode || projectId
                      ? "Ej: Obra Residencial Sur, Proyecto Plaza Central, etc."
                      : "Buscar proyecto existente o escribir manualmente"
                  }
                />

                {!isManualMode && !projectId && DropdownComponent && (
                  <DropdownComponent
                    open={openProjects}
                    options={projects || []}
                    isLoading={loadingProject}
                    handlerChange={(option: { label: string; value: string }) => {
                      onProjectNameChange?.(option.label);
                      onProjectSelect?.(option);
                      onOpenProjects?.(false);
                    }}
                  />
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {isManualMode || projectId
                  ? "Nombre del proyecto de la obra"
                  : "Busca un proyecto existente o cambia a modo manual"}
              </p>
            </div>

            {/* Botón Crear Proyecto */}
            <div className={`${grid ? "lg:w-[180px] lg:mt-[26px] w-full" : "w-full"}`}>
              <button
                onClick={handleCreateProject}
                className="bg-secondary border border-secondary duration-300 text-white cursor-pointer hover:bg-orange-700 px-4 py-3 rounded-md text-sm w-full h-[46px]"
              >
                <div className="text-center">Crear Proyecto</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
