"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { CatalogueItem } from "../Catalogue/types";
import ToggleButton from "@/components/atoms/toggleButton/toggleButton";
import useMachineDetail from "@/hooks/frontend/buyProcess/useMachineDetail";
import DateRentInput from "@/components/molecule/dateRentInput/dateRentInput";
import { BookingForm } from "@/components/molecule/bookingForm/bookingForm";
import SpecsDetail from "@/components/molecule/specsDetail/specsDetail";
import PriceDetail from "@/components/atoms/priceDetail/priceDetail";
import AmazonLocationMap from "@/components/organism/AmazonLocationService/amazonLocationMap";
import { getImageUrl } from "@/utils/imageUrl";
import { useGetProject } from "@/hooks/component/useGetProject";
import DropdownList from "@/components/atoms/dropdownList/dropdownList";

interface MachineDetailProps {
  machine: CatalogueItem;
  projectId?: string; 
}

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export default function MachineDetail({ machine, projectId  }: MachineDetailProps) {
  
  const {
    extras,
    saveAddress,
    toggleExtra,
    toggleSaveAddress,
    router,
    error,
    loading,
    selectedLocation,
    handleLocationSelect,
    getLocationForBooking,
    validateLocation,
    clearLocation,
    machineData,
    workImage,
    workImageBase64,
    projectName,
    setProjectName,
    responsibleName,
    setResponsibleName,
    handleImageChange,
    clearWorkImage,
    getWorkData,
    projectData,
    setProjectId

  } = useMachineDetail(machine.id, projectId);

  const [workImagePreview, setWorkImagePreview] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  
  const {project, projects, loadingProject, openProjects,setLoadingProject, setOpenProjects,setSelectedProject} = useGetProject({projectName});

  console.log(project,'project')

  const currentMachine = machineData || machine;

  const imageUrl = currentMachine.image
    ? getImageUrl(currentMachine.image)
    : "/images/catalogue/machine5.jpg";

  const onMapLocationSelect = (locationData: LocationData) => {
    handleLocationSelect(locationData);
  };

  const handleImageChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setWorkImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    clearWorkImage();
    setWorkImagePreview(null);
    const input = document.getElementById('work-image') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handlerProjectSelect = (value:any) => {
    setProjectName(value); 
    setOpenProjects(false);
    setSelectedProject(value);
  }

  
  useEffect(()=>{
    if(project){
      setProjectId(project.id.toString());
    }
  },[project]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && !error.includes('ubicación')) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="machine-detail py-5 px-4">
      <div className="container mx-auto lg:flex gap-4">
        <div className="lg:w-2/3">
          <div className="w-full h-100 relative rounded-xl overflow-hidden shadow-md">
            <Image
                src={imageUrl}
                alt={currentMachine.name}
                width={850}
                height={330}
                className="object-cover object-center aspect-[16/6] w-full h-full"
                priority
                unoptimized
            />
            </div>

          {/* Mobile info */}
          <div className="block lg:hidden mt-6">
            <h2 className="text-2xl font-bold">{currentMachine.name}</h2>
            {currentMachine.specs && <SpecsDetail specsMachinary={currentMachine.specs} />}
          </div>

          {/* Descripción */}
          <div className="mt-6 block">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Descripción:</span>{" "}
              {currentMachine.description?.trim()
                ? currentMachine.description
                : `La ${currentMachine.name} combina potencia, versatilidad y eficiencia en un solo equipo. Ideal para excavación, carga y transporte en obras civiles, agrícolas y de construcción.`}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Ubicación de la máquina:</span>{" "}
              {currentMachine.location || "Ubicación no especificada"}
            </p>
          </div>

          {/* Fechas */}
          <div className="mt-6 flex flex-col gap-3.5">
            <div className="block lg:hidden mb-6">
              <PriceDetail
                price={
                  currentMachine.pricing?.price_per_day ??
                  parseFloat(currentMachine.price || "0")
                }
              />
            </div>
            <p className="font-semibold mb-2">
              Disponible del 5 de agosto al 23 diciembre
            </p>
            <div className="flex flex-col gap-3.5 w-full">
              <DateRentInput grid={true}/>
            </div>
          </div>

          {/* Complementos */}
          <div className="mt-6 space-y-4">
            <p className="font-semibold">Complementos para tu renta</p>

            {/* Operador */}
            <div className="flex items-center justify-between border-[#B2B2B2] border-b pb-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/user.svg"
                  alt="Operator"
                  width={35}
                  height={35}
                />
                <div>
                  <p className="text-sm font-semibold">Operador</p>
                  <p className="text-xs text-gray-500 italic">
                    Incluye un operador certificado
                  </p>
                  {currentMachine.pricing?.no_operator_discount && (
                    <p className="text-xs italic text-green-600">
                      -{currentMachine.pricing.no_operator_discount}% si no incluye operador
                    </p>
                  )}
                </div>
              </div>
              <ToggleButton
                isChecked={extras.operador}
                onChange={() => toggleExtra("operador")}
              />
            </div>

            {/* Certificado */}
            <div className="flex items-center justify-between border-[#B2B2B2] border-b pb-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/certificade.svg"
                  alt="Certificado"
                  width={50}
                  height={50}
                />
                <div>
                  <p className="text-sm font-semibold">Certificado OnRentX</p>
                  <p className="text-xs text-gray-500 italic">
                    Estándar de calidad superior
                  </p>
                </div>
              </div>
              <ToggleButton
                isChecked={extras.certificado}
                onChange={() => toggleExtra("certificado")}
              />
            </div>

            {/* Combustible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/fuel.svg"
                  alt="Combustible"
                  width={35}
                  height={35}
                />
                <div>
                  <p className="text-sm font-semibold">Combustible incluido</p>
                  {currentMachine.pricing?.no_fuel_discount && (
                    <p className="text-xs italic text-green-600">
                      -{currentMachine.pricing.no_fuel_discount}% si no incluye combustible
                    </p>
                  )}
                </div>
              </div>
              <ToggleButton
                isChecked={extras.combustible}
                onChange={() => toggleExtra("combustible")}
              />
            </div>
          </div>

          {/* Sección integrada de ubicación y datos de reserva */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Datos de reserva
              </h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ubicación y datos de tu obra
              </h3>
              <p className="text-sm text-gray-600">
                Proporciona la información de tu obra para calcular el costo de flete y coordinar la entrega.
              </p>
            </div>

            {/* Campo de dirección de entrega integrado con el mapa */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">
                  Dirección de entrega
                </label>

                {/* Mapa */}
                <AmazonLocationMap
                  center={[-123.115898, 49.295868]}
                  zoom={11}
                  height="320px"
                  onLocationSelect={onMapLocationSelect}
                  initialLocation={selectedLocation}
                  showLocationInfo={false}
                  showSearchField={true}
                  searchPlaceholder="Buscar dirección de entrega, ciudad o punto de referencia..."
                  className="shadow-sm border-gray-200"
                />
              </div> 

              {/* Estado de la ubicación */}
              {selectedLocation ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-green-500 rounded-full">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 mb-1">
                          Ubicación confirmada
                        </p>
                        <p className="text-sm text-green-700 mb-1">
                          <strong>Dirección:</strong> {selectedLocation.address || "Ubicación personalizada"}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-green-600">
                          <span><strong>Latitud:</strong> {selectedLocation.lat.toFixed(6)}</span>
                          <span><strong>Longitud:</strong> {selectedLocation.lng.toFixed(6)}</span>
                        </div>
                        <p className="text-xs text-green-600 mt-2 italic">
                          Esta ubicación se usará para calcular el costo de flete y programar la entrega
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearLocation}
                      className="ml-3 px-3 py-1 text-xs text-green-700 hover:text-green-900 hover:bg-green-100 border border-green-300 rounded transition-colors flex-shrink-0"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500 rounded-full">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.228 2.5 1.732 2.5z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-800 mb-1">
                        Selecciona la ubicación de tu obra
                      </p>
                      <p className="text-sm text-amber-700 mb-2">
                        Es necesario especificar dónde necesitas la maquinaria para:
                      </p>
                      <ul className="text-xs text-amber-600 space-y-1 ml-4">
                        <li>• Calcular el costo exacto de flete</li>
                        <li>• Programar la entrega y recolección</li>
                        <li>• Coordinar la logística del transporte</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Error de ubicación */}
              {error && error.includes('ubicación') && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-red-500 rounded-full">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">Error de ubicación</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nombre del proyecto con toggle manual/búsqueda */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del proyecto
                  </label>
                  {!projectId && ( 
                    <button
                      type="button"
                      onClick={() => setIsManualMode(!isManualMode)}
                      className="text-xs text-orange-600 hover:text-orange-800"
                    >
                      {isManualMode ? 'Buscar proyecto existente' : 'Escribir manualmente'}
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    onClick={() => {
                      if (!isManualMode && !projectId) {
                        setOpenProjects(true);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={
                      isManualMode || projectId 
                        ? "Ej: Obra Residencial Sur, Proyecto Plaza Central, etc."
                        : "Buscar proyecto existente o escribir manualmente"
                    }
                  />
                  
                  {/* Solo mostrar dropdown si NO está en modo manual y NO hay projectId */}
                  {!isManualMode && !projectId && (
                    <DropdownList 
                      open={openProjects} 
                      options={projects || []} 
                      handlerChange={handlerProjectSelect} 
                      isLoading={loadingProject} 
                    />
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-1">
                  {isManualMode || projectId 
                    ? 'Nombre del proyecto de la obra'
                    : 'Busca un proyecto existente o cambia a modo manual'
                  }
                </p>
              </div>

              {/* Nombre del responsable */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Nombre del responsable
                </label>
                <input
                  type="text"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez, María González, etc."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Persona responsable de la obra o proyecto.
                </p>
              </div>

              {/* Imagen de la obra */}
              {!projectId && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Imagen de la obra
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChangeLocal}
                      className="hidden"
                      id="work-image"
                    />

                    {workImagePreview ? (
                      <div className="relative">
                        <Image
                          src={workImagePreview}
                          alt="Preview de la obra"
                          width={200}
                          height={150}
                          className="mx-auto rounded-lg object-cover"
                        />
                        <button
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                          Haz clic en la X para cambiar la imagen
                        </p>
                      </div>
                    ) : (
                      <label
                        htmlFor="work-image"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-sm text-gray-600">
                          Haz clic para seleccionar una imagen
                        </span>
                        <span className="text-xs text-gray-400">
                          JPG, PNG o WebP • Máximo 5MB
                        </span>
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Esto nos ayuda a validar el terreno, determinar la accesibilidad y asignar la maquinaria más compatible con las condiciones del sitio.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de reserva */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <BookingForm
              machine={currentMachine}
              router={router}
              projectId={projectId}
              getLocationForBooking={getLocationForBooking}
              validateLocation={validateLocation}
              extras={extras}
              getWorkData={getWorkData}
              projectData={projectData}
              selectedLocation={selectedLocation}
              projectName={projectName}
            />
          </div>

        </div>

        {/* Columna derecha - Desktop */}
        <div className="lg:w-1/3 hidden lg:block">
          <div className="sticky top-6">
            <h1 className="text-2xl font-bold">{currentMachine.name}</h1>
            {currentMachine.specs && <SpecsDetail specsMachinary={currentMachine.specs} />}
            <PriceDetail
              price={
                currentMachine.pricing?.price_per_day ??
                parseFloat(currentMachine.price || "0")
              }
            />
          </div>
        </div>

      </div>
    </section>
  );
}