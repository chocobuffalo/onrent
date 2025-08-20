'use client';
import AddFormItems from "@/components/atoms/addFormITems/addFormItems";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";
import { countDays, shortDate, fixDate } from "@/utils/compareDate";
import { useState } from "react";
import DateRentInput from "../dateRentInput/dateRentInput";
import useAddFormItems from "@/hooks/frontend/buyProcess/useAddFormItems";
import useBookingPreorder from "@/hooks/frontend/buyProcess/useBookingPreorder";
import { currency } from "@/constants";

// Props actualizadas para incluir las nuevas funciones de ubicación
interface BookingFormProps {
  machine: any;
  router: any;
  getLocationForBooking?: () => {lat: number, lng: number} | null;
  validateLocation?: () => boolean;
  extras?: {
    operador: boolean;
    certificado: boolean;
    combustible: boolean;
  };
}

export function BookingForm({
  machine,
  router,
  getLocationForBooking,
  validateLocation,
  extras
}: BookingFormProps) {
    const { startDate, endDate } = useDateRange();
    const [open, setOpen] = useState(false);
    const [clientNotes, setClientNotes] = useState("");

    const { count, increment, decrement, disableTop, disableBottom } = useAddFormItems();
    const { createPreorder, loading, error } = useBookingPreorder();

    const unitPrice = machine?.pricing?.price_per_day || 0;
    const price = unitPrice * count;

    const dayLength = startDate && endDate ? countDays(startDate, endDate) + 1 : 0;
    const totalPrice = price * dayLength;

    function formatDateForBackend(dateString: string): string {
        const { day, month, year } = fixDate(dateString);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            console.error("Faltan fechas");
            alert("Por favor selecciona las fechas de inicio y fin");
            return;
        }

        if (!machine?.id) {
            console.error("Falta ID de la máquina");
            alert("Error: No se pudo identificar la máquina");
            return;
        }

        if (count <= 0) {
            console.error("Cantidad inválida");
            alert("Por favor selecciona al menos una máquina");
            return;
        }

        // NUEVA VALIDACIÓN DE UBICACIÓN
        if (validateLocation && !validateLocation()) {
            // El error ya se muestra en la UI del componente padre
            console.error("No se ha seleccionado una ubicación");
            return;
        }

        try {
            // OBTENER UBICACIÓN SELECCIONADA
            const selectedLocation = getLocationForBooking ? getLocationForBooking() : null;

            const preorderPayload = {
                project_id: 0,
                // USAR UBICACIÓN REAL O FALLBACK A COORDENADAS POR DEFECTO
                location: selectedLocation || { lat: 0, lng: 0 },
                client_notes: clientNotes,
                items: [
                    {
                        product_id: machine.id,
                        start_date: formatDateForBackend(startDate),
                        end_date: formatDateForBackend(endDate),
                        quantity: count,
                        // USAR EXTRAS SI ESTÁN DISPONIBLES
                        requires_operator: extras?.operador || false,
                        requires_fuel: extras?.combustible || false,
                        certification_level: extras?.certificado ? "OnRentX" : "standard",
                    },
                ],
            };

            console.log("Payload enviado:", preorderPayload);

            console.log("Date validation:", {
                startDate: startDate,
                endDate: endDate,
                formattedStartDate: formatDateForBackend(startDate),
                formattedEndDate: formatDateForBackend(endDate),
                dayLength: dayLength,
                machineId: machine.id,
                count: count,
                selectedLocation: selectedLocation // LOG DE LA UBICACIÓN
            });

            const preorder = await createPreorder(preorderPayload);

            if (preorder?.id) {
                console.log("Pre-order created successfully:", preorder);
                router.push(`/catalogo/${machine.machinetype}/${machine.id}/reserva?preorderId=${preorder.id}`);
            }
        } catch (err: any) {
            console.error("Error al crear la pre-orden:", err);

            console.error("Machine data:", machine);
            console.error("Form state:", {
                startDate,
                endDate,
                count,
                unitPrice,
                totalPrice,
                dayLength,
                selectedLocation: getLocationForBooking ? getLocationForBooking() : null
            });
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

            <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
                <p className="text-black">Precio unidad:</p>
                <p className="text-red-500 text-sm">
                    <span className="font-bold">{unitPrice.toLocaleString('es-ES')} {currency.code}/Día</span>
                </p>
            </div>

            <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
                <p className="text-black">Precio por {count} máquinas:</p>
                <p className="text-red-500 text-sm">
                    <span className="font-bold">{price.toLocaleString('es-ES')} {currency.code}/Día</span>
                </p>
            </div>

            <div className="py-5 flex flex-col gap-3.5 w-full border-b border-[#bbb]">
                <div className="flex justify-between w-full items-center">
                    <div>
                        <p className="text-md">
                            Duración: {dayLength} {dayLength === 1 ? 'día' : 'días'}
                        </p>
                        <p className="text-sm text-gray-600">
                            {startDate && endDate ? `Desde el ${shortDate(startDate)} al ${shortDate(endDate)}` : "Selecciona fechas"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="py-2 px-4 bg-[#bbb]"
                    >
                        Cambiar fecha
                    </button>
                </div>
                {open && <DateRentInput grid={true} />}
            </div>

            {/* NUEVA SECCIÓN: Mostrar información de ubicación si está disponible */}
            {getLocationForBooking && getLocationForBooking() && (
                <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
                    <div>
                        <p className="text-black">Ubicación confirmada:</p>
                        <p className="text-xs text-green-600">
                            ✓ Coordenadas: {getLocationForBooking()!.lat.toFixed(4)}, {getLocationForBooking()!.lng.toFixed(4)}
                        </p>
                    </div>
                    <div className="text-green-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                </div>
            )}

            {/* NUEVA SECCIÓN: Mostrar extras seleccionados si están disponibles */}
            {extras && (
                <div className="py-5 flex flex-col gap-2 w-full border-b border-[#bbb]">
                    <p className="text-black font-medium">Extras incluidos:</p>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Operador:</span>
                            <span className={extras.operador ? "text-green-600" : "text-gray-500"}>
                                {extras.operador ? "✓ Incluido" : "No incluido"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Combustible:</span>
                            <span className={extras.combustible ? "text-green-600" : "text-gray-500"}>
                                {extras.combustible ? "✓ Incluido" : "No incluido"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Certificación OnRentX:</span>
                            <span className={extras.certificado ? "text-green-600" : "text-gray-500"}>
                                {extras.certificado ? "✓ Incluido" : "Estándar"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
                <p className="text-black">Precio total:</p>
                <p className="text-green-600 font-bold text-base">
                    {totalPrice.toLocaleString('es-ES')} {currency.code}
                </p>
            </div>

            <div className="py-5 border-b border-[#bbb]">
                <label htmlFor="clientNotes" className="block text-sm font-medium mb-2">
                    Notas adicionales (opcional)
                </label>
                <textarea
                    id="clientNotes"
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Añade cualquier información adicional sobre tu reserva..."
                    className="w-full border rounded-lg p-3 text-sm resize-none"
                    rows={3}
                />
            </div>

            <div className="pt-10">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-10 cursor-pointer block bg-secondary lg:w-fit hover:text-secondary border-1 duration-300 border-secondary hover:bg-transparent text-white py-3 rounded-sm font-semibold mt-4 mx-auto disabled:opacity-50"
                >
                    {loading ? "Procesando..." : "RESERVAR"}
                </button>
                {error && (
                    <div className="mt-2">
                        <p className="text-red-600 text-sm font-semibold">Error:</p>
                        <p className="text-red-600 text-xs">{error}</p>
                    </div>
                )}
            </div>
        </form>
    );
}
