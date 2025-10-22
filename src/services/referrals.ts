export async function generateReferral(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/generate-referral`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ referral_type: "customer" }),
  });
  if (!res.ok) {
    throw new Error("Error generando referral");
  }
  return res.json();
}

export async function getReferrals(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/referrals`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Error obteniendo referrals");
  }
  return res.json();
}

export async function validateReferral(referralCode: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/validate-referral`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ referral_code: referralCode }),
  });
  if (!res.ok) {
    throw new Error("Código inválido o expirado");
  }
  return res.json();
}
