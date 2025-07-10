'use client'
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { sliderItems } from "@/constants/routes/home";
import { SliderInterface } from "@/types/iu";
import SliderPanel from "@/components/molecule/sliderPanel";


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import AdvanceFinder from "@/components/molecule/advanceFinder";

export default function HeroSlider(){
    return(
        <section className="relative h-[60vh] md:h-[70vh]">
            <Swiper
                effect="fade"
                modules={[ Pagination, Autoplay,EffectFade]}
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
                }}>
                {sliderItems.map((item:SliderInterface)=>{
                    return(
                        <SwiperSlide className="w-full">
                            <SliderPanel sliderItem={item} />
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <div className="px-3.5 h-full py-40 flex absolute bottom-0 left-0 w-full items-end justify-start z-30">
                <div className="container mx-auto">
                    <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white">Encuentra y renta maquinaria<br/> cerca de tu obra</h1>
                    <h2 className="text-xl text-white">
                        La plataforma líder para renta de maquinaria en México
                    </h2>
                    <AdvanceFinder/>
                </div>
            </div>
        </section>
    )
}