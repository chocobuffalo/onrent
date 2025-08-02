"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const imagenes = [
  "/images/whoweare_img1.jpg",
  "/images/pesada.webp",
  "/images/home/banner-abajo.webp",
];

export default function WhoWeAre() {
  const [indice, setIndice] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndice((prev) => (prev + 1) % imagenes.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Imagen adaptable */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-full max-h-[500px]">
          <Image
            src={imagenes[indice]}
            alt={`Imagen ${indice + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
            style={{ maxHeight: "500px" }}
          />
        </div>

        {/* Texto descriptivo */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¿Quiénes somos?
          </h2>
          <p className="text-gray-700 mb-4">
            En <strong>On Rent X</strong> revolucionamos la forma de rentar
            maquinaria y materiales para construcción. Somos una plataforma que
            conecta de manera ágil y segura a clientes con proveedores de todo
            tipo de <strong>maquinaria</strong> para tu proyecto.
          </p>
          <p className="text-gray-700 mb-4">
            Nuestro enfoque es claro: hacer que rentar sea tan fácil como pedir
            un viaje en una app. Gracias a nuestro sistema intuitivo y servicio
            personalizado, facilitamos el acceso a equipos, reduciendo tiempos
            de espera y mejorando la experiencia del usuario.
          </p>
          <p className="text-gray-700">
            En On Rent X, entendemos la urgencia del sector y respondemos con
            rapidez, eficiencia y atención humana. Somos más que una plataforma:
            somos el nuevo estándar en renta de maquinaria.
          </p>
        </div>
      </div>
    </section>
  );
}
