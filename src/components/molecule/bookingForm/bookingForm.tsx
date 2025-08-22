'use client';
import AddFormItems from "@/components/atoms/addFormITems/addFormItems";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";
import { countDays, fixDate } from "@/utils/compareDate";
import { useState } from "react";
import DateRentInput from "../dateRentInput/dateRentInput";
import useAddFormItems from "@/hooks/frontend/buyProcess/useAddFormItems";
import useBookingPreorder from "@/hooks/frontend/buyProcess/useBookingPreorder";

import PricingSection from "../PricingSection/PricingSection";
import DurationSection from "../DurationSection/DurationSection";
import LocationSection from "../LocationSection/LocationSection";
import ExtrasSection from "@/components/atoms/ExtrasSection/ExtrasSection";
import NotesSection from "@/components/atoms/NotesInputSection/NotesInputSection";
import SubmitSection from "@/components/atoms/SubmitSection/SubmitSection";

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

        if (validateLocation && !validateLocation()) {
            console.error("No se ha seleccionado una ubicación");
            return;
        }

        try {
            const selectedLocation = getLocationForBooking ? getLocationForBooking() : null;

            const preorderPayload = {
                project_id: 0,
                location: selectedLocation || { lat: 0, lng: 0 },
                client_notes: clientNotes,
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

            console.log("Payload enviado:", preorderPayload);

            const preorder = await createPreorder(preorderPayload);

            if (preorder?.id) {
                console.log("Pre-order created successfully:", preorder);
                router.push(`/catalogo/${machine.machinetype}/${machine.id}/reserva?preorderId=${preorder.id}`);
            }
        } catch (err: any) {
            console.error("Error al crear la pre-orden:", err);
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

            {getLocationForBooking && (
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
}
