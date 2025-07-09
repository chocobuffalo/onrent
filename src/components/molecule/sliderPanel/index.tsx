import { SliderInterface } from "@/types/iu";

export default function SliderPanel({sliderItem}:{sliderItem:SliderInterface}){
    return(
        <article >
        <img src={sliderItem.image} alt={sliderItem.title} className="h-[60vh] md:h-[70vh] object-cover" />

        </article>
    )
}