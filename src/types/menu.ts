


import React from "react";
import { ReactElement, ElementType } from "react";

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

export interface SidebarMenuProps extends sideBarLink {
    childrens?:sideBarLink[];
    icon?: ElementType
    action?: (() => void) | (() => string);
}

export interface RouteItem extends LinkItem {
    description?: string;
    rel?: string;
    image?: string;
    extraClass?:string;
}
export interface LinkItem{
    id: number;
    name: string;
    title: string;
    slug: string;
    target?: boolean;
}