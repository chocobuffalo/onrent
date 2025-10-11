'use client';

import { CheckoutWithLogicProps } from '@/types/checkout';
import BackButton from '@/components/atoms/BackButton/BackButton';
import ProjectInfoTable from '@/components/molecule/ProjectInfoTable/ProjectInfoTable';
import CheckoutSummary from '@/components/molecule/CheckoutSummary/CheckoutSummary';
import { Suspense, use, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import StripeForm from '@/components/molecule/stripeForm/stripeForm';
import { useSession } from 'next-auth/react';
import { Elements } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/frontend/ui/useToast';

export interface CheckoutSummaryProps {
   amount: number;
   currency: string;
   session_id: string;
   preorder_id: string;
   user_id: number | null;
   method: 'card' | 'bank_transfer';
   url: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout({
  order,
  router,
  register,
  errors,
  handleSubmit,
  isSubmitting,
  handleBack,
  onSubmit,
}: CheckoutWithLogicProps) {
  const [loading, setLoading] = useState(false);
  const { toastError, toastSuccess } = useToast();
  
  console.log(order,'order in checkout')
  console.log('order.contract_total:', order?.contract_total);
  
  const {project_name, project_responsible, project_location, client_notes,items,preorder_id,session_id, ui_notice} = order || {};
  const {data:session} = useSession(); 
  console.log(session?.user)
  
  const [getCheckSummary, setGetCheckSummary] = useState<CheckoutSummaryProps>({
    amount: 0,
    currency: 'mxn',
    user_id: (session?.user && 'user_id' in session.user) ? parseInt((session.user as any).user_id) : null,
    preorder_id: preorder_id || '',
    session_id: session_id || '',
    method: 'card',
    url: process.env.NEXT_PUBLIC_SITE_URL || ''
  });
  
  const [clientSecret, setClientSecret] = useState('');

  // Determinar si es mensual
  const isMonthly = items && items.length > 0 && (items[0].duration_days || 0) >= 30;

  useEffect(() => {
    if (ui_notice && ui_notice !== null) {
      if (isMonthly) {
        // Toast para rentas mensuales (>= 30 días)
        toastSuccess(ui_notice); // Muestra: "Solo se cobrará el primer mes ahora. Los meses siguientes se cobrarán mes a mes."
      } else {
        // Toast para rentas cortas (< 30 días)
        toastSuccess("Se aplicó automáticamente una tarifa con descuento por duración ¡Te ahorras 6,300 MXN!");
      }
    }
  }, [ui_notice, isMonthly]);
 
  const fetchClientSecret = async () => {
    try {
      console.log(getCheckSummary, 'fetchClientSecret called');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/stripe/create-intent`, {
        method: 'POST',
        body: JSON.stringify(getCheckSummary),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user?.access_token}`
        }
      });
    
      const json = await response.json();

      // Verificar si hay error de región/ubicación
      if (!response.ok) {
        const errorMessage = json.error || json.message || json.detail || '';
      
        if (errorMessage.includes('región') || 
            errorMessage.includes('region') || 
            errorMessage.includes('ubicacion') || 
            errorMessage.includes('ubicación') ||
            errorMessage.includes('cobertura') ||
            errorMessage.includes('coverage') ||
            errorMessage.includes('determinar') ||
            errorMessage.includes('calcular precios') ||
            response.status === 422) {
          toastError("La región está fuera de cobertura. Por favor, intente con otra ubicación.");
          return;
        }
        // Otros errores
        toastError(`Error al procesar la solicitud: ${errorMessage}`);
        return;
      }
    
      setClientSecret(json.client_secret);
      return json.client_secret;
    } catch (error) {
      console.error('Error in fetchClientSecret:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');
    console.log('session?.user?.access_token:', session?.user?.access_token);
    console.log('getCheckSummary.amount:', getCheckSummary.amount);
    console.log('session:', session);
    console.log('getCheckSummary:', getCheckSummary);
  
    if (session?.user?.access_token) {
      console.log('Conditions met, calling fetchClientSecret');
      fetchClientSecret()
    } else {
      console.log('Conditions NOT met for fetchClientSecret - no access_token');
    }
  },[getCheckSummary, session]) 

  // Opciones para Elements
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#f97316',
        colorBackground: '#ffffff',
        colorText: '#374151',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Input': {
          borderColor: '#d1d5db',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
        '.Input:focus': {
          borderColor: '#f97316',
          boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)',
        },
        '.Label': {
          fontWeight: '500',
          marginBottom: '8px',
        }
      }
    },
    loader: 'auto' as const,
  };
  
  return typeof window !== 'undefined' && (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton onClick={handleBack} />

        <div >
          <div className="space-y-6">
            <ProjectInfoTable 
              project_name={project_name} 
              responsible_name={project_responsible} 
              project_location={project_location} 
            />
           
            <CheckoutSummary 
              items={items} 
              order={order}
              setGetCheckSummary={setGetCheckSummary} 
              preorder_id={preorder_id} 
              url={getCheckSummary.url} 
              session_id={session_id} 
            />
            
            {/*stripe here - Solo mostrar si tenemos clientSecret*/ }
            {clientSecret ? (
              <Elements stripe={stripePromise} options={options}>
                <StripeForm getCheckSummary={getCheckSummary} stripeSecret={clientSecret} />
              </Elements>
            ) : (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-600">Cargando formulario de pago...</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
