import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/frontend/ui/useToast';
import { redirect } from 'next/navigation';
import { useUIAppSelector } from "@/libs/redux/hooks";
import { countDays } from "@/utils/compareDate";


const StripeForm = ({getCheckSummary,stripeSecret}:{getCheckSummary:{amount:number,currency:string,user_id:number | null,method:string,preorder_id:string,session_id:string,url:string},stripeSecret:string}) => {
    console.log('getCheckSummary in StripeForm:', getCheckSummary);
    console.log('stripeSecret in StripeForm:', stripeSecret);


    const { toastSuccess,toastError, toastWarning } = useToast();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [loadingTransfer, setLoadingTransfer] = useState(false);
    const [message, setMessage] = useState("");
    const {data:session} = useSession(); 
    console.log(session?.user)

    const startDate = useUIAppSelector((state) => state.filters.startDate);
    const endDate = useUIAppSelector((state) => state.filters.endDate);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("Procesando pago...");


        if (!stripe || !elements) {
            setMessage("Stripe.js no está cargado todavía.");
            setLoading(false);
            return;
        }


        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`,
                },
                redirect: 'if_required'
            });


            if (error) {
                console.error(error);
                setMessage(`Error: ${error.message}`);
                toastError(`Error en el pago: ${error.message}`);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                setMessage("Pago completado ✅");
                toastSuccess("Pago realizado con éxito");


                setTimeout(() => {
                    redirect('/thank-you');
                }, 3000);
            } else {
                setMessage(`Estado del pago: ${paymentIntent?.status}`);
            }
        } catch (err) {
            console.error('Error inesperado:', err);
            setMessage("Ha ocurrido un error inesperado");
            toastError("Ha ocurrido un error inesperado");
        } finally {
            setLoading(false);
        }
    };


    const handleBankTransfer = async () => {
        // ✅ VALIDACIÓN: Verificar que la renta sea de al menos 5 días
        const rentalDays = calculateRentalDays();
        
        if (rentalDays !== null && rentalDays < 5) {
            toastWarning("Para rentas menores a 5 días, utiliza pago con tarjeta. El procesamiento de transferencias bancarias puede demorar hasta 3 días hábiles.");
            return; // Detener ejecución
        }

        setLoadingTransfer(true);

        const payloadToSend = {
            amount: getCheckSummary.amount,
            currency: getCheckSummary.currency,
            user_id: getCheckSummary.user_id,
            preorder_id: getCheckSummary.preorder_id,
            session_id: getCheckSummary.session_id,
            method: 'bank_transfer',
            email: session?.user?.email || '',
            name: session?.user?.name || '',
        };

        try {
            console.log('🌐 Haciendo fetch...');
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/stripe/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.access_token}`
                },
                body: JSON.stringify(payloadToSend)
            });

            const textResponse = await response.text();
            let data;
            try {
                data = JSON.parse(textResponse);
                console.log('📥 Response parseado como JSON:', data);
            } catch (parseError) {
                console.error('❌ Error al parsear JSON:', parseError);
                console.error('❌ La respuesta NO es JSON válido');
                console.error('❌ Respuesta completa:', textResponse);
                throw new Error('El servidor no devolvió una respuesta JSON válida');
            }


            if (!response.ok) {
                const errorMessage = data.error || data.message || data.detail || '';
                console.error('❌ Error del backend:', errorMessage);
                console.error('❌ Data completa del error:', data);
                throw new Error(errorMessage || 'Error al crear sesión de pago');
            }

            if (data.url) {
                console.log('🔀 Redirigiendo a:', data.url);
                window.location.href = data.url;
            } else {
                console.error('❌ No se recibió URL en la respuesta');
                throw new Error('No se recibió URL de checkout');
            }


        } catch (error: any) {;
            console.error('❌ Mensaje:', error.message);
        } finally {
            setLoadingTransfer(false);
        }
    };

    const calculateRentalDays = (): number | null => {
        try {
            if (!startDate || !endDate) {
                console.warn('⚠️ No hay fechas seleccionadas');
                return null;
            }

            const days = countDays(startDate, endDate) + 1;  
            return days;
        } catch (error) {
            console.error('❌ Error al calcular días de renta:', error);
            return null;
        }
    };


    return (
        <div className="w-full">
            {/* Título de métodos de pago */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Métodos de pago</h3>
                
                {/* Imagen de métodos de pago */}
                <div className="mb-6">
                    <img 
                        src="/images/payment/payment-gateway.png" 
                        alt="Métodos de pago disponibles" 
                        className="h-auto max-w-full"
                    />
                </div>
            </div>


            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Element de Stripe */}
                <div className="p-6 border border-gray-200 rounded-lg bg-white">
                    <PaymentElement 
                        options={{
                            layout: 'tabs',
                            defaultValues: {
                                billingDetails: {
                                    name: session?.user?.name || '',
                                    email: session?.user?.email || '',
                                    address: {
                                        country: 'MX'
                                    }
                                }
                            }
                        }}
                    />
                </div>


                {/* Botón de transferencia bancaria */}
                <button
                    type="button"
                    disabled={loadingTransfer}
                    onClick={handleBankTransfer}
                    className="w-full py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {loadingTransfer ? "Procesando..." : "Pagar por transferencia bancaria"}
                </button>


                {/* Botón de pagar */}
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                >
                    {loading ? "Procesando..." : "Pagar"}
                </button>


                {/* Mensaje de estado */}
                {message && (
                    <div className={`text-sm text-center ${
                        message.includes('Error') ? 'text-red-600' : 'text-green-600'
                    }`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};


export default StripeForm;
