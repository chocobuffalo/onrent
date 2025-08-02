"use client";

import { ReactNode } from "react";

interface FrontSectionWrapperProps {
  identicator?: string; // ID opcional para tracking o secciones
  extraClass?: string;  // Clases adicionales
  children: ReactNode;  // Contenido dentro del wrapper
}

export default function FrontSectionWrapper({
  identicator,
  extraClass = "",
  children,
}: FrontSectionWrapperProps) {
  return (
    <section
      id={identicator}
      className={`w-full mx-auto ${extraClass}`}
    >
      {children}
    </section>
  );
}
