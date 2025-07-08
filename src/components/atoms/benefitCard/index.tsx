import { ProcessItemInterface } from "@/types/iu";
import Image from "next/image";

export default function BenefitCard({item}:{item:ProcessItemInterface}){
    return(
        <div className='border-secondary flex-col justify-center relative flex items-center border-1 rounded-xl p-5' style={{minHeight:'250px'}}>
            <div className='flex justify-center items-center'>
                <div className='w-20 h-20 rounded-full flex justify-center items-center'>
                    <Image src={item.image} alt={item.title||''} width={50} height={50} className='mx-auto w-15 h-15'/>
                </div>
            </div>
            <div className='text-center mt-5'>
                <h3 className='text-secondary font-bold pb-2.5'>{item.title}</h3>
                <p className='text-[#707070] text-sm'>{item.description}</p>
            </div>
        </div>
    )
}
