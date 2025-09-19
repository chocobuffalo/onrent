import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/frontend/ui/useToast';
import { redirect } from 'next/navigation';

const StripeForm = ({getCheckSummary,stripeSecret}:{getCheckSummary:{amount:number,currency:string,user_id:number | null,method:string},stripeSecret:string}) => {
    console.log('getCheckSummary in StripeForm:', getCheckSummary);
    console.log('stripeSecret in StripeForm:', stripeSecret);

    const { toastSuccess,toastError } = useToast();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const {data:session} = useSession(); 
    console.log(session?.user)

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

                {/* Botón alternativo de transferencia bancaria */}
                <button
                    type="button"
                    className="w-full py-3 px-4 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                    onClick={() => {
                        toastError("Método de pago no disponible por el momento");
                    }}
                >
                    Pagar por transferencia bancaria
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