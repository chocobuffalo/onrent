"use client";

import { useState } from "react";
import "./RatingModal.scss";

interface RatingModalProps {
  isOpen: boolean;
  orderId: number | null;
  orderName?: string;
  onSubmit: (rating: number) => Promise<boolean> | boolean;
  onDismiss: () => Promise<boolean> | boolean;
  onClose: () => void;
}

export default function RatingModal({
  isOpen,
  orderId,
  orderName,
  onSubmit,
  onDismiss,
  onClose,
}: RatingModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !orderId) return null;

  const handleSubmit = async () => {
    setLoading(true);
    const ok = await onSubmit(rating);
    setLoading(false);
    if (ok) onClose();
  };

  const handleDismiss = async () => {
    setLoading(true);
    const ok = await onDismiss();
    setLoading(false);
    if (ok) onClose();
  };

  return (
    <div className="rating-modal__overlay" onClick={onClose}>
      <div className="rating-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="rating-modal__header">
          <h3>Califica tu orden {orderName ? `(${orderName})` : `#${orderId}`}</h3>
          <button className="rating-modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="rating-modal__body">
          <p className="rating-modal__hint">
            ¿Cómo fue tu experiencia? Tu opinión nos ayuda a mejorar.
          </p>
          <div className="rating-modal__stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`rating-modal__star ${n <= rating ? "is-active" : ""}`}
                onClick={() => setRating(n)}
                aria-label={`${n} estrellas`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="rating-modal__footer">
          <button
            className="rating-modal__button rating-modal__button--primary"
            onClick={handleSubmit}
            disabled={loading || rating === 0}
          >
            {loading ? "Guardando..." : "Enviar calificación"}
          </button>
          <button
            className="rating-modal__button"
            onClick={handleDismiss}
            disabled={loading}
          >
            {loading ? "Procesando..." : "No ahora"}
          </button>
        </div>
      </div>
    </div>
  );
}
