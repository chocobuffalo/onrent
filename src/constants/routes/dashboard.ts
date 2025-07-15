/***********************************************************************
 * src/constants/routes/dashboard.ts
 * Menú lateral del dashboard con control granular por rol.
 **********************************************************************/
import { signOut } from "@/auth";
import BulldozerIcon from "@/components/atoms/customIcons/bulldozers";
import DashboardIcon from "@/components/atoms/customIcons/dashboard";
import ExitIcon from "@/components/atoms/customIcons/ExitIcon";
import HearthIcon from "@/components/atoms/customIcons/hearthIcon";
import PencilWrite from "@/components/atoms/customIcons/pencilWrite";
import EnvelopeIcon from "@/components/atoms/customIcons/reviewIcon";
import UserProfileIcon from "@/components/atoms/customIcons/userProfileIcon";
import WrenckIcon from "@/components/atoms/customIcons/wrenkIcon";

import type { SidebarMenuProps, UserRole } from "@/types/menu";

/**
 * Nota de roles:
 *  - 'PROVIDER'  → usuarios que publican maquinaria
 *  - 'CLIENT'    → usuarios que alquilan
 *
 */
export const dashboardRoutes: SidebarMenuProps[] = [
  /* ----------------------------------------------------
   * Comunes (PROVIDER y CLIENT)
   * -------------------------------------------------- */
  {
    link: "/dashboard",
    title: "Dashboard",
    icon: DashboardIcon,
    roles: ["PROVIDER", "CLIENT"], // explícito, pero podrías omitirlo
  },
  {
    link: "/dashboard/favorites",
    title: "Favoritos",
    icon: HearthIcon,
  },
  {
    link: "/dashboard/reviews",
    title: "Reseñas",
    icon: EnvelopeIcon,
  },
  {
    link: "/dashboard/profile",
    title: "Perfil",
    icon: UserProfileIcon,
  },
  {
    link: "/dashboard/changepass",
    title: "Cambio de contraseña",
    icon: WrenckIcon,
  },

  /* ----------------------------------------------------
   * Solo PROVEEDOR
   * -------------------------------------------------- */
  {
    link: "/dashboard/equipaments",
    title: "Gestión de maquinaria",
    icon: BulldozerIcon,
    roles: ["PROVIDER"],
  },
  {
    link: "/dashboard/orders",
    title: "Solicitudes de Renta",
    icon: PencilWrite,
    roles: ["PROVIDER"],
  },

  /* ----------------------------------------------------
   * Ejemplo solo CLIENTE (opcional)
   * -------------------------------------------------- */
  // {
  //   link: '/dashboard/my-rents',
  //   title: 'Mis rentas',
  //   icon: PencilWrite,
  //   roles: ['CLIENT'],
  // },

  /* ----------------------------------------------------
   * Salir (común)
   * -------------------------------------------------- */
  {
    link: "#",
    title: "Salir",
    icon: ExitIcon,
    action: () => signOut({ redirect: true }),
  },
] satisfies SidebarMenuProps[];
