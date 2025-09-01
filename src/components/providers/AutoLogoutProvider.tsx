// src/components/auth/AutoLogoutProvider.tsx
"use client";

import useAutoLogout from '@/hooks/frontend/auth/useAutoLogout';

export default function AutoLogoutProvider() {
  useAutoLogout();
  return null; // Este componente no renderiza nada visible
}