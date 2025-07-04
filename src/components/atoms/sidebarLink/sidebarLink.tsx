'use client';

import { SidebarMenuProps } from "@/types/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLink({route, className}:{route:SidebarMenuProps,className?:string}){
    const pathname = usePathname();
    return ( <li>
            {route.link !== '#'?(<Link
                href={route.link}
                className={`menu-index-2 ${className && className} d-flex gap-2 ${
                pathname == route.link ? "active" : ""
                } `}
            >
                {route.icon && <route.icon />}
                {route.title}
            </Link>):
            (<button className="menu-index-2 d-flex gap-2" onClick={() => { if (route.function) route.function(); }}>

                {route.icon && <route.icon />}
                {route.title}
                </button>)}
            </li>)
}