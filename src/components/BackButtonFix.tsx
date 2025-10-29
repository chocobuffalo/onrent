"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function BackButtonFix() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // Si venías de dashboard y ahora estás en cualquier ruta pública → reload
    if (prevPath.current?.startsWith("/dashboard") && pathname && !pathname.startsWith("/dashboard")) {
      console.log("Detectado back desde dashboard hacia front/público → forzando reload");
      window.location.reload();
    }
    prevPath.current = pathname || null;
  }, [pathname]);

  return null;
}
