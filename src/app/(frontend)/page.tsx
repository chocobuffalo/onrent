// src/app/page.tsx
"use client";

import BenefitsComponent from "@/components/organism/benefitsComponent";
import CategoriesSection from "@/components/organism/categoriesSection";
import FooterBanner from "@/components/organism/footerBanner";
import HeroSlider from "@/components/organism/heroSlider";
import ProcessComponent from "@/components/organism/processComponent";
import { useGeolocation } from "@/hooks/frontend/ui/UseGeolocation";
import { useToast } from "@/hooks/frontend/ui/useToast";
import { useEffect, useRef } from "react";

export default function Home() {
  const { location, error, loading } = useGeolocation();
  const { toastSuccess, toastError } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (location && !hasShownToast.current) {
      console.log('✅ [Home] Ubicación obtenida:', location);
      toastSuccess('Ubicación detectada correctamente');
      hasShownToast.current = true;
    }
  }, [location, toastSuccess]);

  useEffect(() => {
    if (error && !loading && !hasShownToast.current) {
      console.error('❌ [Home] Error de geolocalización:', error);
      toastError('No pudimos obtener tu ubicación. Puedes buscar manualmente tu zona.');
      hasShownToast.current = true;
    }
  }, [error, loading, toastError]);

  return (
    <>
      <HeroSlider />
      <CategoriesSection />
      <ProcessComponent />
      <BenefitsComponent />
      <FooterBanner />
    </>
  );
}