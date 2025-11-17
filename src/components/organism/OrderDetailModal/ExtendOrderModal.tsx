// ExtendOrderModal.tsx (simplificado)
"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useOrders from "@/hooks/backend/useOrders";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function PaymentStep({ clientSecret, onSuccess, onError }: { clientSecret: string, onSuccess: ()=>void, onError:(e:any)=>void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href }, // if_required fallback
        redirect: "if_required"
      });
      if (error) {
        onError(error);
        toast.error(error.message || "Error en pago");
      } else {
        // si no hubo redirect y status es succeded, considerarlo success
        if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
          onSuccess();
        } else {
          // si se requiere acción, Stripe maneja redirect; puedes manejar casos intermedios aquí
          toast.info(`Estado: ${paymentIntent?.status}`);
        }
      }
    } catch (e) {
      onError(e);
      toast.error("Error confirmando pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="payment-element">
        <PaymentElement />
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={handleConfirm} disabled={loading || !stripe} className="btn btn-primary">
          {loading ? "Procesando..." : "Pagar ahora"}
        </button>
      </div>
    </div>
  );
}

export default function ExtendOrderModal({ orderId, open, onClose }: { orderId:number, open:boolean, onClose: ()=>void }) {
  const [days, setDays] = useState<number>(1);
  const [preview, setPreview] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { extendOrderById } = useOrders();

  useEffect(() => {
    if (!open) {
      setDays(1); setPreview(null); setClientSecret(null);
    }
  }, [open]);

  const fetchPreview = async () => {
    if (days <= 0) { toast.error("Ingresa días válidos (>0)"); return; }
    try {
      const res = await fetch(`/api/orders/${orderId}/extend-preview?days=${days}`);
      if (!res.ok) throw await res.json();
      const data = await res.json();
      setPreview(data);
    } catch (e:any) {
      toast.error(e?.message || "Error obteniendo preview");
    }
  };

  const createIntentAndShowPayment = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/create-extend-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days })
      });
      if (!res.ok) throw await res.json();
      const data = await res.json();
      setClientSecret(data.client_secret);
      // client_secret ready -> Stripe Elements will mount
    } catch (e:any) {
      toast.error(e?.message || "Error creando intent");
    }
  };

  const onPaymentSuccess = async () => {
    // Confirmar con backend: extendOrderById puede validar y devolver nueva order / estado
    try {
      const ok = await extendOrderById(orderId, days); // tu hook debe validar/refresh
      if (ok) {
        toast.success("Orden extendida y pagada correctamente");
        onClose();
      } else {
        toast.error("Pago registrado pero la extensión falló (ver logs)");
      }
    } catch (e:any) {
      toast.error("Error finalizando la extensión");
    }
  };

  return !open ? null : (
    <div className="modal">
      <div className="modal-content">
        <h3>Extender orden</h3>

        {!preview && !clientSecret && (
          <>
            <label>Días a extender</label>
            <input type="number" min={1} value={days} onChange={(e)=>setDays(parseInt(e.target.value||"1"))} />
            <div className="modal-actions">
              <button onClick={onClose}>Cancelar</button>
              <button onClick={fetchPreview}>Calcular monto</button>
            </div>
          </>
        )}

        {preview && !clientSecret && (
          <>
            <div>
              <p><strong>Monto a cobrar ahora:</strong> {preview.chargeNow?.toLocaleString?.() || preview.chargeNow} {preview.currency}</p>
              {preview.billingMode === "monthly_first" && <p className="text-sm text-gray-500">Se cobrará hoy el primer periodo; los siguientes se cobrarán mes a mes.</p>}
            </div>
            <div className="modal-actions">
              <button onClick={()=>{ setPreview(null); }}>Volver</button>
              <button onClick={createIntentAndShowPayment}>Pagar ahora</button>
            </div>
          </>
        )}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentStep
              clientSecret={clientSecret}
              onSuccess={onPaymentSuccess}
              onError={(e)=>console.error("stripe error", e)}
            />
            <div className="modal-actions mt-4">
              <button onClick={onClose}>Cerrar</button>
            </div>
          </Elements>
        )}
      </div>
    </div>
  );
}
