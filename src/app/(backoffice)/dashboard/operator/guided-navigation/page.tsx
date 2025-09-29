import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Navegación Guiada',
  description: 'Sistema de navegación/GPS para operaciones',
};

export default function GuidedNavigation() {
  return (
    <div className="container">
      <h1>Navegación Guiada</h1>
    </div>
  );
}