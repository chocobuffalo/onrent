import { ProcessItemInterface } from "@/types/iu";
import Image from "next/image";

export default function ProcessItem({item}:{item:ProcessItemInterface}){
    return(
        <div className="flex gap-3.5 p-5 items-center justify-start">
            <Image src={item.image} alt={item.description||''} width={50} height={50} />
            <p className="text-left xl:text-lg mt-2">{item.description}</p>
        </div>
    )
}