'use client';
import AddFormItems from "@/components/atoms/addFormITems/addFormItems";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";
import { countDays, shortDate } from "@/utils/compareDate";
import { useState } from "react";
import DateRentInput from "../dateRentInput/dateRentInput";
import useAddFormItems from "@/hooks/frontend/buyProcess/useAddFormItems";
import useBookingPreorder from "@/hooks/frontend/buyProcess/useBookingPreorder";

export function BookingForm({ machine, router }: { machine: any, router: any }) {
    const { startDate, endDate } = useDateRange();
    const [open, setOpen] = useState(false);

    const { count, increment, decrement, disableTop, disableBottom } = useAddFormItems();
    const { createPreorder, loading, error } = useBookingPreorder();

    const unitPrice = machine?.pricing?.price_per_day || 0;
    const price = unitPrice * count;

    // Si falta fecha, asumimos 0 días
    const days = startDate && endDate ? countDays(startDate, endDate) : 0;
    const totalPrice = price * days;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            console.error("Faltan fechas");
            return;
        }

        try {
            const preorderPayload = {
                session_id: "web-session",
                project_id: 0,
                client_notes: "Reserva desde el formulario",
                location: { lat: 0, lng: 0 },
                items: [
                    {
                        product_id: machine.id,
                        start_date: startDate,  // string (YYYY-MM-DD)
                        end_date: endDate,      // string (YYYY-MM-DD)
                        quantity: count,
                        requires_operator: false,
                        requires_fuel: false,
                        certification_level: "standard",
                    },
                ],
            };

            console.log("Payload enviado:", preorderPayload);

            const preorder = await createPreorder(preorderPayload);

            if (preorder?.id) {
                router.push(`/catalogo/${machine.machinetype}/${machine.id}/reserva?preorderId=${preorder.id}`);
            }
        } catch (err) {
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

            <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
                <p className="text-black">Precio unidad:</p>
                <p className="text-red-500 text-sm">
                    <span className="font-bold">{unitPrice.toLocaleString('es-ES')}$/USD</span>
                </p>
            </div>

            <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
                <p className="text-black">Precio por {count} máquinas:</p>
                <p className="text-red-500 text-sm">
                    <span className="font-bold">{price.toLocaleString('es-ES')}$/USD</span>
                </p>
            </div>

            <div className="py-5 flex flex-col gap-3.5 w-full border-b border-[#bbb]">
                <div className="flex justify-between w-full items-center">
                    <div>
                        <p className="text-md">
                            Duración: {days} {days === 1 ? 'día' : 'días'}
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

            <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
                <p className="text-black">Precio total:</p>
                <p className="text-green-600 font-bold text-base">
                    {totalPrice.toLocaleString('es-ES')}$/USD
                </p>
            </div>

            <div className="pt-10">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-10 cursor-pointer block bg-secondary lg:w-fit hover:text-secondary border-1 duration-300 border-secondary hover:bg-transparent text-white py-3 rounded-sm font-semibold mt-4 mx-auto disabled:opacity-50"
                >
                    {loading ? "Procesando..." : "RESERVAR"}
                </button>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
        </form>
    );
}
