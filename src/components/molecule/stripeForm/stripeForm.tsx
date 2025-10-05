import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/frontend/ui/useToast';
import { redirect } from 'next/navigation';
import { useUIAppSelector } from "@/libs/redux/hooks";
import { countDays } from "@/utils/compareDate";
import type { PaymentIntent, StripeError } from "@stripe/stripe-js";

interface BankTransferInstructions {
    type: 'mx_bank_transfer' | 'spei';
    financial_addresses?: Array<{
        type: string;
        clabe?: string;
        bank_name?: string;
        bank_code?: string;
    }>;
    amount_remaining?: number;
    currency?: string;
    reference?: string;
    hosted_instructions_url?: string;
}

interface ExtendedNextAction {
    type: string;
    display_bank_transfer_instructions?: BankTransferInstructions;
}

function hasDisplayBankTransferInstructions(
    nextAction: PaymentIntent['next_action']
): nextAction is ExtendedNextAction & { display_bank_transfer_instructions: BankTransferInstructions } {
    return nextAction !== null && 
           nextAction !== undefined && 
           'display_bank_transfer_instructions' in nextAction;
}

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
        const rentalDays = calculateRentalDays();
        
        if (rentalDays !== null && rentalDays < 5) {
            toastWarning("Para rentas menores a 5 días, utiliza pago con tarjeta. El procesamiento de transferencias bancarias puede demorar hasta 3 días hábiles.");
            return;
        }

        if (!stripe) {
            toastError("Stripe no está cargado correctamente");
            return;
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
            console.log('🌐 Solicitando client_secret para transferencia...');
            
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
                console.log('📥 Response parseado:', data);
            } catch (parseError) {
                console.error('❌ Error al parsear JSON:', parseError);
                throw new Error('El servidor no devolvió una respuesta JSON válida');
            }

            if (!response.ok) {
                const errorMessage = data.error || data.message || data.detail || '';
                console.error('❌ Error del backend:', errorMessage);
                throw new Error(errorMessage || 'Error al crear sesión de pago');
            }

            if (!data.client_secret) {
                console.error('❌ No se recibió client_secret');
                throw new Error('No se recibió client_secret del servidor');
            }

            console.log('✅ client_secret recibido:', data.client_secret);

            // ✅ PASO 1: Recuperar el PaymentIntent
            console.log('📋 Paso 1: Recuperando PaymentIntent...');
            const retrieveResult = await stripe.retrievePaymentIntent(data.client_secret);

            if (!retrieveResult.paymentIntent) {
                throw new Error('No se pudo recuperar el PaymentIntent');
            }

            const paymentIntent = retrieveResult.paymentIntent;
            console.log('📋 PaymentIntent recuperado. Status:', paymentIntent.status);

            // ✅ PASO 2: Si requiere payment_method → confirmar con customer_balance
            if (paymentIntent.status === "requires_payment_method") {
                console.log('⚠️ Paso 2A: PaymentIntent requiere payment_method, confirmando con customer_balance...');
                
                // ✅ CORRECCIÓN: Crear payment method primero, luego confirmar
                const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'customer_balance',
                    customer_balance: {},
                    billing_details: {
                        name: session?.user?.name || '',
                        email: session?.user?.email || '',
                    }
                });

                if (pmError) {
                    console.error("❌ Error creando payment method:", pmError);
                    throw new Error(pmError.message || 'Error al crear método de pago');
                }

                console.log('✅ Payment method creado:', paymentMethod?.id);

                // Ahora confirmar el PaymentIntent con el payment_method_id
                const confirmResult = await stripe.confirmPayment({
                    clientSecret: data.client_secret,
                    confirmParams: {
                        payment_method: paymentMethod!.id,
                        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`,
                    },
                    redirect: 'if_required'
                });

                if (confirmResult.error) {
                    console.error("❌ Error confirmando transferencia:", confirmResult.error);
                    throw new Error(confirmResult.error.message || 'Error al confirmar el pago');
                }

                if (!confirmResult.paymentIntent) {
                    throw new Error('No se recibió PaymentIntent confirmado');
                }
                const confirmed = confirmResult.paymentIntent;

                console.log('✅ PaymentIntent confirmado. Nuevo status:', confirmed.status);

                // ✅ Verificar instrucciones de transferencia
                if (hasDisplayBankTransferInstructions(confirmed.next_action)) {
                    console.log("✅ Instrucciones SPEI:", confirmed.next_action.display_bank_transfer_instructions);
                    
                    toastSuccess("Transferencia iniciada. Redirigiendo a instrucciones de pago...");
                    setTimeout(() => {
                        window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?payment_intent=${confirmed.id}`;
                    }, 1500);
                } else if (confirmed.status === 'processing') {
                    toastSuccess("Transferencia en proceso. Redirigiendo...");
                    setTimeout(() => {
                        window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?payment_intent=${confirmed.id}`;
                    }, 1500);
                } else {
                    toastSuccess("Pago procesado exitosamente");
                    setTimeout(() => {
                        window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`;
                    }, 1500);
                }
            }
            // ✅ PASO 3: Si requiere acción → manejar la acción
            else if (paymentIntent.status === "requires_action") {
                console.log('⚠️ Paso 2B: PaymentIntent requiere acción...');
                
                // Si ya tiene las instrucciones, no necesitamos confirmar de nuevo
                if (hasDisplayBankTransferInstructions(paymentIntent.next_action)) {
                    console.log("✅ Instrucciones SPEI ya disponibles:", paymentIntent.next_action.display_bank_transfer_instructions);
                    
                    toastSuccess("Transferencia iniciada. Redirigiendo a instrucciones de pago...");
                    setTimeout(() => {
                        window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?payment_intent=${paymentIntent.id}`;
                    }, 1500);
                } else {
                    // Si no, intentar manejar la acción
                    const handleResult = await stripe.handleNextAction({
                        clientSecret: data.client_secret
                    });

                    if (handleResult.error) {
                        console.error("❌ Error manejando acción:", handleResult.error);
                        throw new Error(handleResult.error.message || 'Error al manejar la acción');
                    }

                    const handled = handleResult.paymentIntent;
                    
                    if (handled && hasDisplayBankTransferInstructions(handled.next_action)) {
                        console.log("✅ Instrucciones SPEI:", handled.next_action.display_bank_transfer_instructions);
                        
                        toastSuccess("Transferencia iniciada. Redirigiendo a instrucciones de pago...");
                        setTimeout(() => {
                            window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?payment_intent=${handled.id}`;
                        }, 1500);
                    } else {
                        toastSuccess("Pago procesado exitosamente");
                        setTimeout(() => {
                            window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`;
                        }, 1500);
                    }
                }
            }
            // ✅ PASO 4: Si ya está en processing → solo mostrar instrucciones
            else if (paymentIntent.status === "processing") {
                console.log('✅ Paso 3: PaymentIntent en processing');
                
                if (hasDisplayBankTransferInstructions(paymentIntent.next_action)) {
                    console.log("✅ Instrucciones SPEI:", paymentIntent.next_action.display_bank_transfer_instructions);
                }
                
                toastSuccess("Transferencia en proceso. Redirigiendo a instrucciones de pago...");
                setTimeout(() => {
                    window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?payment_intent=${paymentIntent.id}`;
                }, 1500);
            }
            // ✅ PASO 5: Si ya está en succeeded → el pago ya entró
            else if (paymentIntent.status === "succeeded") {
                console.log("✅ Paso 4: Pago ya confirmado por Stripe");
                
                toastSuccess("Pago confirmado exitosamente");
                setTimeout(() => {
                    window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/thank-you?payment_intent=${paymentIntent.id}`;
                }, 1500);
            }
            // Cualquier otro estado
            else {
                console.log('⚠️ Estado inesperado:', paymentIntent.status);
                throw new Error(`Estado no manejado: ${paymentIntent.status}`);
            }

        } catch (error: any) {
            console.error('❌ Error en transferencia bancaria:', error.message);
            toastError(`Error: ${error.message}`);
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
            console.log('📅 Días de renta:', days);
            return days;
        } catch (error) {
            console.error('❌ Error al calcular días de renta:', error);
            return null;
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Métodos de pago</h3>
                
                <div className="mb-6">
                    <img 
                        src="/images/payment/payment-gateway.png" 
                        alt="Métodos de pago disponibles" 
                        className="h-auto max-w-full"
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

                <button
                    type="button"
                    disabled={loadingTransfer}
                    onClick={handleBankTransfer}
                    className="w-full py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {loadingTransfer ? "Procesando..." : "Pagar por transferencia bancaria"}
                </button>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                >
                    {loading ? "Procesando..." : "Pagar"}
                </button>

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