import { SliderInterface } from "@/types/iu";
import Image from "next/image";
export default function SliderPanel({
  sliderItem,
}: {
  sliderItem: SliderInterface;
}) {
  return (
    <article>
      <Image
        src={sliderItem.image}
        alt={sliderItem.title}
        className="h-[60vh] md:h-[70vh] object-cover w-full"
      />
    </article>
  );
}
