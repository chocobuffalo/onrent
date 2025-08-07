import FrontSectionWrapper from "@/components/molecule/frontSectionWrapper/frontSectionWrapper";
import './footerBanner.css'
import AOSWrapper from "@/components/atoms/aosWrapper";
import Link from "next/link";

export default function FooterBanner(){
    return(
        <FrontSectionWrapper identicator='footer-banner' extraClass="py-10">
            <AOSWrapper  animation="fade-in" duration={1000} >
                <div className="banner-card px-3.5 py-16 min-h-[300px] flex items-center relative rounded-2xl" style={{backgroundImage:'url(/images/home/banner-abajo.webp)'}}>

                    <div className="mx-auto flex flex-col gap-3 items-center justify-center relative z-10">
                        <AOSWrapper  animation="zoom-in" duration={500} >
                            <h2 className='text-5xl font-bold text-white text-center pb-6'>
                                Rentar maquinaria es fácil, regístrate
                            </h2>
                        </AOSWrapper>
                        <AOSWrapper  animation="zoom-in" duration={500} delay={200}>
                            <Link href={'/registrate'} className="w-fit px-6 font-bold py-2 text-white   uppercase border-2 duration-300 border-secondary bg-secondary hover:border-white hover:bg-transparent rounded-lg" >
                                Regístrate                          
                            </Link>
                        </AOSWrapper>
                    </div>
                </div>      
            </AOSWrapper>
        </FrontSectionWrapper>
    )
}