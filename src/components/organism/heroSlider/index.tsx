"use client";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { sliderItems } from "@/constants/routes/home";
import { SliderInterface } from "@/types/iu";
import SliderPanel from "@/components/molecule/sliderPanel";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import AdvanceFinder from "@/components/molecule/advanceFinder";

export default function HeroSlider() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] max-h-[700px]">
      <Swiper
        effect="fade"
        modules={[Pagination, Autoplay, EffectFade]}
        spaceBetween={20}
        slidesPerView={1}
        className="relative h-full"   // 👈 Swiper ocupa todo el alto del section
        speed={1000}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}" style="background:#ea6300; width: 12px; height: 12px;"></span>`;
          },
        }}
      >
        {sliderItems.map((item: SliderInterface) => {
          return (
            <SwiperSlide className="w-full h-full" key={item.id}> {/* 👈 cada slide respeta el alto */}
              <SliderPanel sliderItem={item} />
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Overlay oscuro para mejorar contraste */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/40 z-20"></div>

      {/* Contenido encima del overlay */}
      <div className="px-3.5 h-full flex absolute bottom-0 left-0 w-full items-end justify-start z-30
                      pt-10 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-18
                      pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28">
        <div className="container mx-auto text-left">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight">
            Encuentra y renta maquinaria
            <br /> cerca de tu obra
          </h1>
          <h2 className="mt-2 text-base sm:text-lg md:text-2xl text-white">
            La plataforma líder para renta de maquinaria en México
          </h2>
          <div className="mt-6">
            <AdvanceFinder />
          </div>
        </div>
      </div>
    </section>
  );
}
