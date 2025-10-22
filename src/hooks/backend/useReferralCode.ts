"use client";
import { useEffect, useState } from "react";

export function useReferralCode() {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // 1. Capturar de la URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      localStorage.setItem("referral_code", code);
      setReferralCode(code);
    } else {
      // 2. Si no viene en la URL, intentar leerlo de localStorage
      const stored = localStorage.getItem("referral_code");
      if (stored) {
        setReferralCode(stored);
      }
    }
  }, []);

  return referralCode;
}
