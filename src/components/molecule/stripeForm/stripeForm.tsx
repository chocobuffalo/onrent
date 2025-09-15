
import {useCheckout, PaymentElement} from '@stripe/react-stripe-js/checkout';

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSession } from 'next-auth/react';

const StripeForm = ({getCheckSummary}:{getCheckSummary:{amount:number,currency:string,user_id:number | null,method:string}}) => {
    console.log('getCheckSummary in StripeForm:', getCheckSummary);

  //   const checkoutState = useCheckout();
  //   console.log(checkoutState)
    
  // const handleSubmit = async (event:any) => {
  //   // We don't want to let default form submission happen here,
  //   // which would refresh the page.
  //   event.preventDefault();

  //   if (checkoutState.type === 'loading') {
  //     return (
  //       <div>Loading...</div>
  //     );
  //   } else if (checkoutState.type === 'error') {
  //     return (
  //       <div>Error: {checkoutState.error.message}</div>
  //     );
  //   }

  //   // checkoutState.type === 'success'
  //   const {checkout} = checkoutState;
  //   const result = await checkout.confirm();

  //   if (result.type === 'error') {
  //     // Show error to your customer (for example, payment details incomplete)
  //     console.log(result.error.message);
  //   } else {
  //     // Your customer will be redirected to your `return_url`. For some payment
  //     // methods like iDEAL, your customer will be redirected to an intermediate
  //     // site first to authorize the payment, then redirected to the `return_url`.
  //   }
  // };
  // return (
  //   <form className='border flex flex-col items-center justify-center border-gray-300 rounded-lg p-6 bg-white' onSubmit={handleSubmit}>
      
  //     <CardElement />
  //     <button className='cursor-pointer hover:bg-transparent hover:text-secondary w-full max-w-[250px] mx-auto bg-secondary text-white py-2 rounded-lg border-1 border-secondary'>Submit</button>
  //   </form>
  // );


   const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
   const {data:session} = useSession(); 
      console.log(session?.user)

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
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Creando intento de pago...");

    // 1️⃣ Llamar a tu backend para crear el PaymentIntent
    const resp =await fetchClientSecret()

    if (!resp.ok) {
      setMessage("Error creando PaymentIntent");
      setLoading(false);
      return;
    }

    const { client_secret } = await resp.json();
    console.log("client_secret recibido:", client_secret);

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

    const { paymentIntent, error } = await stripe.confirmCardPayment(client_secret, {
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