'use client'
import FrontendLogo from "@/components/atoms/frontendLogo/frontendLogo";
import Navbar from "@/components/molecule/navbar/navbar";
import { useEffect, useState } from "react";

export default function Header(){
    const [top,setTop] =useState<number>(-200)
    const handleScroll = () => {
        const element = document.getElementById('top-header')!;
        if (window.scrollY > 300) {
        
         
          setTop(0)
        } else {
            setTop(-200)
       
           
        }
      };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
        };
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
    return(
        <>
            <header id="top-header" className="top-0 z-10 fixed left-0 w-full px-3.5 py-2 bg-primary" style={{top:`${top}px`,zIndex:99999}}>
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <FrontendLogo/>
                        </div>
                        <Navbar isTop={true}/>
                    </div>
                </div>
            </header>
            <header id="header" className="z-10 top-0 left-0 w-full px-3.5 py-2 bg-primary" style={{zIndex:300}}>
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <FrontendLogo/>
                        </div>
                         <Navbar isTop={true}/>
                    </div>
                </div>
            </header>
        </>
    )
}