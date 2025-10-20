'use client';
import AddFormItems from "@/components/atoms/addFormITems/addFormItems";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";
import { countDays, fixDate } from "@/utils/compareDate";
import { useState, useEffect } from "react";
import DateRentInput from "../dateRentInput/dateRentInput";
import useAddFormItems from "@/hooks/frontend/buyProcess/useAddFormItems";
import useBookingPreorder from "@/hooks/frontend/buyProcess/useBookingPreorder";
import { useToast } from "@/hooks/frontend/ui/useToast";
import { useSession } from "next-auth/react";
import { useRouter as useNextRouter } from "next/navigation";

import PricingSection from "../PricingSection/PricingSection";
import DurationSection from "../DurationSection/DurationSection";
import LocationSection from "../LocationSection/LocationSection";
import ExtrasSection from "@/components/atoms/ExtrasSection/ExtrasSection";
import NotesSection from "@/components/atoms/NotesInputSection/NotesInputSection";
import SubmitSection from "@/components/atoms/SubmitSection/SubmitSection";
import { AddedItemsList } from "@/components/molecule/AddedItemsList/AddedItemsList";
import { AddMoreMachinesModal } from "@/components/organism/AddMoreMachinesModal/AddMoreMachinesModal";

import { useUIAppDispatch, useUIAppSelector } from '@/libs/redux/hooks';
import { 
  initBookingSession, 
  addItemToBooking, 
  incrementItemQuantity,
  incrementItemQuantityById,
  decrementItemQuantity,
  removeItemFromBooking, 
  clearBookingSession 
} from '@/libs/redux/features/booking/bookingSessionSlice';

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
    const [showCatalogModal, setShowCatalogModal] = useState(false);

    // ✅ SOLUCIÓN: Estados para valores calculados
    const [dayLength, setDayLength] = useState(0);
    const [price, setPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Redux
    const dispatch = useUIAppDispatch();
    const bookingSession = useUIAppSelector(state => state.bookingSession);
    const bookingItems = bookingSession.items;

    const { count, increment, decrement, disableTop, disableBottom } = useAddFormItems();
    const { createPreorder, loading, error } = useBookingPreorder();
 
    const { toastSuccess, toastSuccessAction, toastError, toastWarning } = useToast();
    const { data: session, status } = useSession();
    const nextRouter = useNextRouter();

    const unitPrice = machine?.pricing?.price_per_day || 0;

    const hasProject = Boolean(projectId && projectData);
    const isManualMode = !hasProject;

    useEffect(() => {
        console.log("🔄 Fechas o cantidad cambiaron:", { startDate, endDate, count });
        
        if (startDate && endDate) {
            const calculatedDays = countDays(startDate, endDate);
            const calculatedPrice = unitPrice * count;
            const calculatedTotal = calculatedPrice * calculatedDays;
            setDayLength(calculatedDays);
            setPrice(calculatedPrice);
            setTotalPrice(calculatedTotal);
        } else {
            setDayLength(0);
            setPrice(unitPrice * count);
            setTotalPrice(0);
        }
    }, [startDate, endDate, count, unitPrice]);

    useEffect(() => {
        if (hasProject && selectedLocation && projectData) {
            setLocationLoaded(true);
        } else if (!hasProject) {
            setLocationLoaded(false);
        }
    }, [hasProject, selectedLocation, projectData]);

    const getProjectAddress = () => {
        if (!hasProject) return '';
        return projectData?.location || selectedLocation?.address || '';
    };

    const hasValidLocation = () => {
        if (hasProject) {
            return locationLoaded && Boolean(getProjectAddress());
        } else {
            return validateLocation ? validateLocation() : false;
        }
    };

    const formatDateForBackend = (dateString: string): string => {
        const { day, month, year } = fixDate(dateString) || { day: 0, month: 0, year: 0 };
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleAddItem = () => {
        if (!startDate || !endDate) {
            toastError("Por favor selecciona las fechas de inicio y fin");
            return;
        }

        if (count <= 0) {
            toastError("Por favor selecciona al menos una máquina");
            return;
        }

        // Inicializar sesión si es el primer item
        if (bookingItems.length === 0) {
            dispatch(initBookingSession({
                startDate,
                endDate,
                location: selectedLocation || null,
                extras: extras || { operador: false, certificado: false, combustible: false },
                projectId,
                projectData
            }));
        }

        const newItem = {
            id: `${Date.now()}-${Math.random()}`,
            machineId: machine.id,
            machineName: machine.name,
            quantity: count,
            unitPrice: unitPrice,
            startDate: startDate,
            endDate: endDate,
            dayLength: dayLength,
            totalPrice: totalPrice,
            requires_operator: extras?.operador || false,
            requires_fuel: extras?.combustible || false,
            certification_level: extras?.certificado ? "OnRentX" : "standard",
        };

        console.log("Item agregado:", newItem);
        dispatch(addItemToBooking(newItem));
        toastSuccess("Item agregado correctamente");
    };

    const handleAddMachineFromCatalog = (selectedMachine: any) => {
        const unitPrice = selectedMachine.pricing?.price_per_day 
            || parseFloat(selectedMachine.price) 
            || 0;
        
        const dayLength = countDays(bookingSession.startDate!, bookingSession.endDate!);
        
        const existingItem = bookingItems.find(
            item => item.machineId === selectedMachine.id && 
                    item.startDate === bookingSession.startDate && 
                    item.endDate === bookingSession.endDate
        );

        if (existingItem) {
            console.log("✅ Item existente encontrado, incrementando cantidad:", existingItem.machineName);
            dispatch(incrementItemQuantity({
                machineId: selectedMachine.id,
                quantityToAdd: 1
            }));
            // ✅ CAMBIO: Usar toastSuccess en lugar de toastSuccessAction
            toastSuccess(`Cantidad de ${selectedMachine.name} incrementada`);
        } else {
            const totalPrice = unitPrice * dayLength;
            
            const newItem = {
                id: `${Date.now()}-${Math.random()}`,
                machineId: selectedMachine.id,
                machineName: selectedMachine.name,
                quantity: 1,
                unitPrice: unitPrice,
                startDate: bookingSession.startDate!,
                endDate: bookingSession.endDate!,
                dayLength: dayLength,
                totalPrice: totalPrice,
                requires_operator: bookingSession.extras.operador,
                requires_fuel: bookingSession.extras.combustible,
                certification_level: bookingSession.extras.certificado ? "OnRentX" : "standard",
            };

            console.log("🆕 Creando nuevo item:", newItem);
            dispatch(addItemToBooking(newItem));
            // ✅ CAMBIO: Usar toastSuccess en lugar de toastSuccessAction
            toastSuccess(`${selectedMachine.name} agregado`);
        }
        
        setShowCatalogModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (status !== 'authenticated' || !session) {
            toastError("Para crear una reserva debes iniciar sesión");
            setTimeout(() => {
                nextRouter.push('/iniciar-session');
            }, 800);
            return;
        }

        const userRole = (session.user?.role || '').toLowerCase();
        
        if (!userRole) {
            toastError("No se pudo determinar tu rol de usuario");
            return;
        }
        
        if (userRole === 'proveedor' || userRole === 'operador') {
            toastWarning("Como Proveedor u Operador no puedes crear preórdenes. Crea un perfil de cliente para continuar.");
            return;
        }

        if (bookingItems.length === 0) {
            toastError("Por favor agrega al menos un item antes de reservar");
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
                    referenceAddress: projectData?.location || selectedLocation?.address || '',
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

            const itemsPayload = bookingItems.map(item => ({
                product_id: item.machineId,
                start_date: formatDateForBackend(item.startDate),
                end_date: formatDateForBackend(item.endDate),
                quantity: item.quantity,
                requires_operator: item.requires_operator,
                requires_fuel: item.requires_fuel,
                certification_level: item.certification_level,
            }));

            const preorderPayload = {
                project_id: projectData?.id || 0,
                location: locationData || { lat: 0, lng: 0 },
                client_notes: clientNotes,
                work_image: workData?.workImage || null,
                reference_address: workData?.referenceAddress || "",
                project_name: workData?.projectName || "",
                responsible_name: workData?.responsibleName || "",
                items: itemsPayload,
            };

            console.log("Enviando al endpoint /api/orders/preorder:", preorderPayload);

            const preorder = await createPreorder(preorderPayload);

            if (preorder?.order_id) {
                console.log("Preorden creada exitosamente:", preorder);
                dispatch(clearBookingSession());
                if (typeof window !== "undefined") {
                    localStorage.removeItem("booking_session");
                    localStorage.removeItem("booking_items");
                }
                // ✅ MANTENER toastSuccessAction aquí porque necesita redirigir
                toastSuccessAction(
                    "¡Preorden creada exitosamente! Redirigiendo...",
                    () => {
                        router.push('/checkout');
                    }
                );
            }
        } catch (err: any) {
            console.error("Error al crear preorden:", err);
            if (err.message === 'Usuario no autenticado') {
                toastError("Para crear una preorden debes iniciar sesión");
                setTimeout(() => {
                    nextRouter.push('/iniciar-session');
                }, 2.1);
            } else {
                toastError("Error al crear la reserva. Por favor, inténtalo nuevamente.");
            }
        }
    };

    const canAddItem = startDate && endDate && count > 0;

    return (
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-5 bg-white space-y-3"
      >
        <h4 className="font-medium text-sm mb-2">Detalles del precio</h4>

        {/* Sección mejorada para responsive */}
        <div className="space-y-3 mb-2">
          {/* Fila 1: Contador y nombre de máquina */}
          <div className="flex items-center gap-2">
            <AddFormItems
              name="quantity"
              increment={increment}
              count={count}
              decrement={decrement}
              disableTop={disableTop}
              disableBottom={disableBottom}
            />
            <span className="text-sm font-semibold flex-1 truncate">{machine?.name}</span>
          </div>

          {/* Fila 2: Botones - responsive */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            <button
              type="button"
              onClick={handleAddItem}
              disabled={!canAddItem}
              className="w-full sm:w-auto sm:flex-1 px-4 py-2.5 bg-white border-2 border-secondary text-secondary rounded-sm font-semibold hover:bg-secondary hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              agregar
            </button>

            {bookingItems.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCatalogModal(true)}
                className="w-full sm:w-auto sm:flex-1 px-4 py-2.5 bg-white border-2 border-orange-500 text-orange-500 rounded-sm font-semibold hover:bg-orange-500 hover:text-white transition-colors duration-300 text-sm flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <span className="text-lg">+</span>
                <span className="hidden sm:inline">Agregar desde catálogo</span>
                <span className="sm:hidden">Agregar desde catálogo</span>
              </button>
            )}
          </div>
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
              <span className="font-semibold text-green-800">
                Proyecto vinculado
              </span>
              {!locationLoaded && (
                <div className="ml-2 text-xs text-gray-500">
                  Cargando datos...
                </div>
              )}
            </div>
            <p className="text-sm text-green-700">
              <strong>Nombre:</strong>{" "}
              {projectData?.name || projectName || "Cargando..."}
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

        <AddedItemsList
          items={bookingItems}
          onRemove={(id) => dispatch(removeItemFromBooking(id))}
          onIncrement={(id) => dispatch(incrementItemQuantityById(id))}
          onDecrement={(id) => dispatch(decrementItemQuantity(id))}
        />

        <SubmitSection
            loading={loading}
            error={error}
            hasItems={bookingItems.length > 0}
        />

        <AddMoreMachinesModal
            isOpen={showCatalogModal}
            onClose={() => setShowCatalogModal(false)}
            onSelectMachine={handleAddMachineFromCatalog}
        />
      </form>
    );
};
