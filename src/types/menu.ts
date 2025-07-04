import React from "react";

export type Menu = ListinsMenu[]

export interface LinkInterface{
    href:string;
    text:string;
}
export interface ListinsMenuInterface{
    className: string,
    title: string,
    links: Menu,
}

export type ListinsMenu =  ListinsMenuInterface | LinkInterface


export interface sideBarLink{
    link:string,
    title:string,
}

export interface SidebarMenuProps extends sideBarLink{
    childrens:null| sideBarLink[];
    icon?: () => React.JSX.Element
    function: null | (() => void) | (()=>string)
}
