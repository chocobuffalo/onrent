/***********************************************************************
 * src/types/menu.ts
 * Tipos utilitarios para menús y enlaces en el dashboard.
 **********************************************************************/

import { ElementType } from "react";

/* --------------------------------------------------------------------
 * 1. Roles disponibles en la app.  Añade más si lo necesitas (ADMIN…).
 * ------------------------------------------------------------------ */
export type UserRole = "PROVIDER" | "CLIENT";

/* --------------------------------------------------------------------
 * 2. Modelos básicos ya existentes
 * ------------------------------------------------------------------ */
export interface LinkInterface {
  /** URL absoluta o relativa */
  href: string;
  /** Texto ancla */
  text: string;
}

export interface ListinsMenuInterface {
  className: string;
  title: string;
  links: Menu;
}

export type ListinsMenu = ListinsMenuInterface | LinkInterface;
export type Menu = ListinsMenu[];

/* --------------------------------------------------------------------
 * 3. Tipado de los enlaces que usa <SidebarLink />
 * ------------------------------------------------------------------ */
/**
 * Enlace simple: se usa dentro de arrays como children.
 */
export interface SidebarChildLink {
  link: string;
  title: string;
}

/**
 * Props del objeto principal que renderiza el Sidebar.
 * - `roles` → qué tipo(s) de usuario pueden ver este elemento.
 *   Si se omite, se muestra a todos los roles.
 */
export interface SidebarMenuProps extends SidebarChildLink {
  childrens?: SidebarChildLink[];
  icon?: ElementType;
  action?: (() => void) | (() => string);
  /** Qué roles ven este ítem. Ej: ['PROVIDER'] */
  roles?: UserRole[];
}

/* --------------------------------------------------------------------
 * 4. Otros tipos auxiliares (se mantienen igual)
 * ------------------------------------------------------------------ */
export interface LinkItem {
  id: number;
  name: string;
  title: string;
  slug: string;
  target?: boolean;
}

export interface RouteItem extends LinkItem {
  description?: string;
  rel?: string;
  image?: string;
  extraClass?: string;
  icon?: ElementType;
  protected?: boolean;
  isLogged?: boolean;
  machine_category?: string;
  type_icon?: string;
}
