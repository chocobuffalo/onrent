'use client';
import AddFormItems from "@/components/atoms/addFormITems/addFormItems";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";
import { countDays, shortDate } from "@/utils/compareDate";
import { useState } from "react";
import DateRentInput from "../dateRentInput/dateRentInput";
import useAddFormItems from "@/hooks/frontend/buyProcess/useAddFormItems";

export function BookingForm({machine,router}: {machine: any, router: any}) {
    const {
        startDate,
        endDate,
    } = useDateRange();
    const [open, setOpen] = useState(false);

    const {count, increment, decrement,disableTop,disableBottom} = useAddFormItems();

    const price = machine.price * count;

    const totalPrice = price * countDays(startDate, endDate);

    return (
        <form  className="border rounded-lg p-5 bg-white space-y-3">
            <h4 className="font-medium text-sm mb-2">Detalles del precio</h4>

            <div className="flex items-center space-x-2 mb-2">
            <AddFormItems name="quantity" increment={increment} count={count} decrement={decrement} disableTop={disableTop} disableBottom={disableBottom} />
            <span className="text-sm font-semibold ml-2">{machine.name}</span>
            </div>

            <div className="normalPrice py-5 items-center flex justify-between w-full border-b border-[#bbb]">
                <p className="text-black">Precio unidad:</p>
                <p className="text-red-500 text-sm">
                    <span className="font-bold">{price.toLocaleString('es-ES')}$/USD</span>
                </p>
            </div>
            <div className="normalPrice py-5 items-center flex flex-col justify-between w-full gap-3.5 border-b border-[#bbb]">
                <div className="flex justify-between w-full items-center">
                    <div className="list">
                        <p className="text-md ">Duración: {countDays(startDate, endDate)} {countDays(startDate, endDate) === 1 ? 'día' : 'días'}</p>

                        <p className="text-sm text-gray-600">Desde el {shortDate(startDate)}  al {shortDate(endDate)}</p>

                    </div>
                    <button type="button" onClick={() => setOpen(!open)} className="py-2 px-4 bg-[#bbb]">Cambiar fecha</button>
                </div>
                {open && <DateRentInput grid={true} />}
            </div>
            <div className="normalPrice py-5 items-center flex justify-between w-full border-b border-[#bbb]">
                <p className="text-black">Precio total:</p>
                <p className="text-green-600 font-bold text-base">{totalPrice.toLocaleString('es-ES')}$/USD</p>
            </div>
            

            {/* Cambiar modal por navegación */}
           <div className="button-section pt-10">
             <button
                onClick={() => router.push(`/catalogo/${machine.machinetype}/${machine.id}/reserva`)}
                className="w-full px-10 cursor-pointer block bg-secondary lg:w-fit hover:text-secondary border-1 duration-300  border-secondary hover:bg-transparent  text-white py-3 rounded-sm font-semibold mt-4 mx-auto"
            >
                RESERVAR
            </button>
           </div>
        </form>
  );
}
