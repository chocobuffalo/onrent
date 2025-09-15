'use client';

import { CheckoutWithLogicProps } from '@/types/checkout';
import {CheckoutProvider} from '@stripe/react-stripe-js/checkout';
import BackButton from '@/components/atoms/BackButton/BackButton';
import ProjectInfoTable from '@/components/molecule/ProjectInfoTable/ProjectInfoTable';
import PaymentForm from '@/components/molecule/PaymentForm/PaymentForm';
import CheckoutSummary from '@/components/molecule/CheckoutSummary/CheckoutSummary';
import { Suspense, use, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import StripeForm from '@/components/molecule/stripeForm/stripeForm';
import { useSession } from 'next-auth/react';

export interface CheckoutSummaryProps {
   amount: number;
        currency: string;
        session_id: string;
        preorder_id: string;
        user_id: number | null;
        method: 'card',
        url:string
}

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
  console.log(order)
  const {project_name, project_responsible, project_location, client_notes,items,preorder_id,session_id} = order || {};
    const {data:session} = useSession(); 
    console.log(session?.user)
 const fleetSum = items?.reduce((sum, item) => sum + (item.estimated_fleet || 0), 0);
      const rentsSum = items?.reduce((sum, item) => sum + (item.estimated_rent || 0), 0);
      const totalSum = items?.reduce((sum, item) => sum + (item.total_estimated || 0), 0);
    
      const machinesItems = items ? items?.map((item) => ({
        id: item.product_id || Math.random().toString(36).substr(2, 9), // Generar un ID único si no existe
        name: item.product_name,
        price: item.estimated_rent,
        quantity: item.requested_quantity,
      })): [];
      
    
   
    
  const [getCheckSummary, setGetCheckSummary] = useState<CheckoutSummaryProps>({
    amount: totalSum || 0,
    currency: 'mxn',
    user_id: (session?.user && 'user_id' in session.user) ? parseInt((session.user as any).user_id) : null,
    preorder_id: preorder_id || '',
    session_id: session_id || '',
    method: 'card',
    url:process.env.NEXT_PUBLIC_SITE_URL || ''
    
  });
  //process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
const stripePromise = typeof window !== 'undefined' 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!) 
  : Promise.resolve(null);


const fetchClientSecret = async () => {
  // get
  console.log(getCheckSummary, 'fetchClientSecret called');

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/stripe/create-intent`, {
    method: 'POST',
    body: JSON.stringify(getCheckSummary),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user?.access_token}`
    }
  });
  //console.log(await response.json());
  const json = await response.json();
  return json.client_secret;
};



  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton onClick={handleBack} />

        <div >
          <div className="space-y-6">
            <ProjectInfoTable project_name={project_name} responsible_name={project_responsible} project_location={project_location} />
           
            <CheckoutSummary items={items} setGetCheckSummary={setGetCheckSummary} preorder_id={preorder_id} url={getCheckSummary.url} session_id={session_id} />
            {/*stripe here*/ }
           {/**
            * crear un suspense para el stripe
            */}
          <Suspense fallback={<div>Cargando...</div>} >
              <CheckoutProvider stripe={stripePromise} options={{fetchClientSecret, elementsOptions: {appearance: {
                theme: 'stripe',
              },},}}>
              <StripeForm getCheckSummary={getCheckSummary} />
             </CheckoutProvider>
            </Suspense>

          </div>
        </div>
      </div>
    </div>
  );
}