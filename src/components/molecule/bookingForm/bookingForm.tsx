'use client';
import AddFormItems from "@/components/atoms/addFormITems/addFormItems";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";
import { countDays, fixDate } from "@/utils/compareDate";
import { useState, useEffect } from "react";
import DateRentInput from "../dateRentInput/dateRentInput";
import useAddFormItems from "@/hooks/frontend/buyProcess/useAddFormItems";
import useBookingPreorder from "@/hooks/frontend/buyProcess/useBookingPreorder";
import { useToast } from "@/hooks/frontend/ui/useToast";

import PricingSection from "../PricingSection/PricingSection";
import DurationSection from "../DurationSection/DurationSection";
import LocationSection from "../LocationSection/LocationSection";
import ExtrasSection from "@/components/atoms/ExtrasSection/ExtrasSection";
import NotesSection from "@/components/atoms/NotesInputSection/NotesInputSection";
import SubmitSection from "@/components/atoms/SubmitSection/SubmitSection";

interface BookingFormProps {
  machine: any;
  router: any;
  projectId?: string;
  getLocationForBooking?: () => {lat: number, lng: number} | null;
  validateLocation?: () => boolean;
  extras?: {
    operador: boolean;
    certificado: boolean;
    combustible: boolean;
  };
  getWorkData?: () => {
    workImage: string | null;
    projectName: string;
    referenceAddress: string;
    projectId: number;
    responsibleName: string;
  };
  projectData?: any;
  selectedLocation?: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
  projectName?: string;
}

export const BookingForm = ({
  machine,
  router,
  projectId,
  getLocationForBooking,
  validateLocation,
  extras,
  getWorkData,
  projectData,
  selectedLocation,
  projectName
}: BookingFormProps) => {
    const { startDate, endDate } = useDateRange();
    const [open, setOpen] = useState(false);
    const [clientNotes, setClientNotes] = useState("");
    const [locationLoaded, setLocationLoaded] = useState(false);

    const { count, increment, decrement, disableTop, disableBottom } = useAddFormItems();
    const { createPreorder, loading, error } = useBookingPreorder();
    const { toastSuccessAction, toastError } = useToast();

    const unitPrice = machine?.pricing?.price_per_day || 0;
    const price = unitPrice * count;
    const dayLength = startDate && endDate ? countDays(startDate, endDate) + 1 : 0;
    const totalPrice = price * dayLength;

    const hasProject = Boolean(projectId && projectData);
    const isManualMode = !hasProject;

    // CORRECCIÓN: Escuchar cambios en selectedLocation y projectData
    useEffect(() => {
        if (hasProject && selectedLocation && projectData) {
            setLocationLoaded(true);
            console.log('✅ Ubicación del proyecto cargada:', selectedLocation);
        } else if (!hasProject) {
            // En modo manual, resetear el estado
            setLocationLoaded(false);
        }
    }, [hasProject, selectedLocation, projectData]);

    // CORRECCIÓN: Función para obtener la dirección correcta
    const getProjectAddress = () => {
        if (!hasProject) return '';
        
        // Usar la misma lógica que getWorkData() del hook
        return projectData?.location || selectedLocation?.address || '';
    };

    // CORRECCIÓN: Función para validar si hay ubicación disponible
    const hasValidLocation = () => {
        if (hasProject) {
            // Para proyectos, verificar que los datos estén cargados y tenga dirección
            return locationLoaded && Boolean(getProjectAddress());
        } else {
            // Para modo manual, usar la validación existente
            return validateLocation ? validateLocation() : false;
        }
    };

    const formatDateForBackend = (dateString: string): string => {
        const { day, month, year } = fixDate(dateString) || { day: 0, month: 0, year: 0 };
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            toastError("Por favor selecciona las fechas de inicio y fin");
            return;
        }

        if (!machine?.id) {
            toastError("Error: No se pudo identificar la máquina");
            return;
        }

        if (count <= 0) {
            toastError("Por favor selecciona al menos una máquina");
            return;
        }

        // CORRECCIÓN: Validación mejorada de ubicación
        if (!hasValidLocation()) {
            if (hasProject) {
                toastError("Error: No se pudo cargar la ubicación del proyecto seleccionado");
            } else {
                // Para modo manual, usar la validación original que ya maneja el toast
                if (validateLocation) {
                    validateLocation(); // Esto ya maneja el error internamente
                }
            }
            return;
        }

        try {
            let locationData = null;
            let workData = null;

            if (hasProject) {
                locationData = selectedLocation ? {
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng
                } : { lat: 0, lng: 0 };
                
                workData = {
                    workImage: null,
                    projectName: projectData?.name || projectName || '',
                    referenceAddress: projectData?.location || selectedLocation?.address || '', // CORRECCIÓN: Usar misma lógica que el hook
                    projectId: projectData?.id || 0,
                    responsibleName: projectData?.responsible_name || '',
                };
                
            } else {
                locationData = getLocationForBooking ? getLocationForBooking() : null;
                workData = getWorkData ? getWorkData() : {
                    workImage: null,
                    projectName: '',
                    referenceAddress: '',
                    projectId: 0,
                    responsibleName: '',
                };
            }

            const preorderPayload = {
                project_id: projectData?.id || 0,
                location: locationData || { lat: 0, lng: 0 },
                client_notes: clientNotes,
                work_image: workData?.workImage || null,
                reference_address: workData?.referenceAddress || "",
                project_name: workData?.projectName || "",
                responsible_name: workData?.responsibleName || "",
                items: [
                    {
                        product_id: machine.id,
                        start_date: formatDateForBackend(startDate),
                        end_date: formatDateForBackend(endDate),
                        quantity: count,
                        requires_operator: extras?.operador || false,
                        requires_fuel: extras?.combustible || false,
                        certification_level: extras?.certificado ? "OnRentX" : "standard",
                    },
                ],
            };

            const preorder = await createPreorder(preorderPayload);

            if (preorder?.order_id) {
                toastSuccessAction(
                    "¡Preorden creada exitosamente! Redirigiendo...",
                    () => {
                        router.push('/checkout');
                    }
                );
            }
        } catch (err: any) {
            toastError("Error al crear la reserva. Por favor, inténtalo nuevamente.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded-lg p-5 bg-white space-y-3">
            <h4 className="font-medium text-sm mb-2">Detalles del precio</h4>

            <div className="flex items-center space-x-2 mb-2">
                <AddFormItems
                    name="quantity"
                    increment={increment}
                    count={count}
                    decrement={decrement}
                    disableTop={disableTop}
                    disableBottom={disableBottom}
                />
                <span className="text-sm font-semibold ml-2">{machine?.name}</span>
            </div>

            <PricingSection
                unitPrice={unitPrice}
                price={price}
                count={count}
                totalPrice={totalPrice}
            />

            <DurationSection
                dayLength={dayLength}
                startDate={startDate}
                endDate={endDate}
                open={open}
                onToggleOpen={() => setOpen(!open)}
                DateRentInput={<DateRentInput grid={true} />}
            />

            {hasProject && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-800">Proyecto vinculado</span>
                        {!locationLoaded && (
                            <div className="ml-2 text-xs text-gray-500">Cargando datos...</div>
                        )}
                    </div>
                    <p className="text-sm text-green-700">
                        <strong>Nombre:</strong> {projectData?.name || projectName || 'Cargando...'}
                    </p>
                    {projectData?.responsible_name && (
                        <p className="text-sm text-green-700">
                            <strong>Responsable:</strong> {projectData.responsible_name}
                        </p>
                    )}
                    {locationLoaded && getProjectAddress() && (
                        <div className="mt-2 p-2 bg-white bg-opacity-50 rounded">
                            <p className="text-sm text-green-700">
                                <strong>Ubicación confirmada:</strong> {getProjectAddress()}
                            </p>
                        </div>
                    )}
                    {locationLoaded && !getProjectAddress() && (
                        <p className="text-sm text-red-600">
                            <strong>Ubicación:</strong> No se pudo cargar la dirección del proyecto
                        </p>
                    )}
                    {!locationLoaded && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded">
                            <p className="text-sm text-yellow-700">
                                <strong>Cargando ubicación del proyecto...</strong>
                            </p>
                        </div>
                    )}
                </div>
            )}

            {isManualMode && getLocationForBooking && (
                <LocationSection getLocationForBooking={getLocationForBooking} />
            )}

            {extras && <ExtrasSection extras={extras} />}

            <NotesSection
                clientNotes={clientNotes}
                onNotesChange={setClientNotes}
            />

            <SubmitSection
                loading={loading}
                error={error}
            />
        </form>
    );
};