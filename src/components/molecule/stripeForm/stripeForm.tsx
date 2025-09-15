
import {useCheckout, PaymentElement} from '@stripe/react-stripe-js/checkout';

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from 'next-auth/react';

const StripeForm = ({getCheckSummary}:{getCheckSummary:{amount:number,currency:string,user_id:number | null,method:string}}) => {
    console.log('getCheckSummary in StripeForm:', getCheckSummary);


   const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
   const {data:session} = useSession(); 
      console.log(session?.user)

  const fetchClientSecret = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/stripe/create-intent`, {
    method: 'POST',
    credentials: 'omit',
    body: JSON.stringify(getCheckSummary),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.user?.access_token}`
    }
  });
  const json = await response.json();
  return json.client_secret; // 🔹 devolvemos solo el string
};
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Creando intento de pago...");

    // 1️⃣ Llamar a tu backend para crear el PaymentIntent
    const resp = await fetchClientSecret()

    if (!resp.ok) {
      setMessage("Error creando PaymentIntent");
      setLoading(false);
      return;
    }

   
  
    // 2️⃣ Confirmar el pago con la tarjeta
    if (!stripe || !elements) {
      setMessage("Stripe.js no está cargado todavía.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMessage("No se pudo obtener el elemento de la tarjeta.");
      setLoading(false);
      return;
    }

 

    console.log(resp,'resp client secret')
    const { paymentIntent, error } = await stripe.confirmCardPayment(resp, {
      payment_method: { card: cardElement }
    });

    if (error) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setMessage("Pago completado ✅");
    } else {
      setMessage(`Estado del pago: ${paymentIntent.status}`);
    }

    setLoading(false);
  };

  return (
    <form  onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      <button className='cursor-pointer hover:bg-transparent hover:text-secondary w-full max-w-[250px] mx-auto bg-secondary text-white py-2 rounded-lg border-1 border-secondary' type="submit" disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar"}
      </button>
      <div style={{ marginTop: "8px" }}>{message}</div>
    </form>
  );
};

export default StripeForm;