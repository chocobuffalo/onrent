'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { ProcessItemInterface } from "@/types/iu";
import BenefitCard from '@/components/atoms/benefitCard';

export default function BenefitsCarousel({items}:{items:ProcessItemInterface[]}){
    return(
      <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  className='relative'
                  speed={1000}
                  loop={true} // Habilita el loop infinito
                  autoplay={{
                  delay: 3000, // Cambia de slide cada 3 segundos
                  disableOnInteraction: false, // Continúa el autoplay después de interacción del usuario
                  }}
                  pagination={{
                      clickable: true,
                      renderBullet: (index, className) => {
                          return `<span class="${className}" style="background:#ea6300; width: 12px; height: 12px;"></span>`;
                      }
                  }}
                  breakpoints={{
                  // Cuando el ancho de la ventana es >= 640px
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                // Cuando el ancho de la ventana es >= 768px
                992: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                // Cuando el ancho de la ventana es >= 1024px
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }}>
                  {items.map((item) => (
                      <SwiperSlide key={item.id} >
                          <BenefitCard item={item} />
                      </SwiperSlide>
                  ))}
              </Swiper>
    )
}