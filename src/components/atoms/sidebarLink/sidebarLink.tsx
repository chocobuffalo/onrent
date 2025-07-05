'use client';


import { SidebarMenuProps } from "@/types/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";





export default function SidebarLink({route, className}:{route:SidebarMenuProps,className?:string}){
    const pathname = usePathname();
    const Icon = route.icon;
    return ( <li>
            {route.link !== '#'?(<Link
                href={route.link}
                className={`menu-index-2 ${className && className} d-flex align-center gap-2 ${
                pathname == route.link ? "active" : ""
                } `}
            >
                {Icon && <Icon />}
                {route.title}
            </Link>):
            (<button className="menu-index-2 d-flex gap-2" onClick={() => { if (route.action) route.action(); }}>

                {Icon && <Icon />}
                {route.title}
                </button>)}
            </li>)
}