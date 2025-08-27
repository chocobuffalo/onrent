/***********************************************************************
 * src/constants/routes/dashboard.ts
 * Menú lateral del dashboard con control granular por rol.
 * 
 * SISTEMA DE ROLES IMPLEMENTADO:
 * - 'cliente'          → usuarios que alquilan maquinaria
 * - 'proveedor'        → usuarios que publican/rentan maquinaria  
 * - 'cliente_proveedor'→ usuarios híbridos (acceso completo a ambas funcionalidades)
 * - 'operador'         → operadores creados y gestionados por proveedores
 * 
 * FLUJO DE OPERADORES:
 * - Proveedor crea perfil básico (nombre, email, teléfono)
 * - Operador recibe email y crea su contraseña
 * - Operador completa su perfil y gestiona sus operaciones
 * 
 * LÓGICA DE FILTRADO:
 * - Si un elemento NO tiene 'roles', se muestra a TODOS los usuarios
 * - Si un elemento SÍ tiene 'roles', solo se muestra a esos roles específicos
 * - El rol 'cliente_proveedor' tiene acceso tanto a funciones de cliente como proveedor
 **********************************************************************/

import BulldozerIcon from "@/components/atoms/customIcons/bulldozers";
import DashboardIcon from "@/components/atoms/customIcons/dashboard";
import HearthIcon from "@/components/atoms/customIcons/hearthIcon";
import PencilWrite from "@/components/atoms/customIcons/pencilWrite";
import EnvelopeIcon from "@/components/atoms/customIcons/reviewIcon";
import UserProfileIcon from "@/components/atoms/customIcons/userProfileIcon";
import WrenckIcon from "@/components/atoms/customIcons/wrenkIcon";
import { SidebarMenuProps } from "@/types/menu";

/**
 * Configuración del menú del dashboard según roles.
 * 
 * IMPORTANTE: El orden de los elementos define el orden en el menú.
 * Mantener agrupados por funcionalidad para mejor UX.
 */
export const dashboardRoutes: SidebarMenuProps[] = [
  
  /* ----------------------------------------------------
   * SECCIÓN COMÚN - Accesible para cliente, proveedor y cliente_proveedor
   * Estas son funcionalidades básicas que todos los usuarios necesitan
   * -------------------------------------------------- */

    {
    link: "/dashboard",
    title: "Dashboard",
    icon: DashboardIcon,
roles: ["cliente", "cliente_proveedor"],
  },
  {
    link: "/dashboard/profile",
    title: "Perfil",
    icon: UserProfileIcon,
    // Gestión de perfil universal
  },
  {
    link: "/dashboard/changepass",
    title: "Cambio de contraseña",
    icon: WrenckIcon,
     // Gestión de perfil universal
  },
 
  /* ----------------------------------------------------
   * SECCIÓN CLIENTE - Funcionalidades para usuarios que alquilan
   * También accesible para cliente_proveedor (usuarios híbridos)
   * -------------------------------------------------- */
  {
    link: "/dashboard/projects",
    title: "Mis proyectos",
    icon: PencilWrite,
    roles: ["cliente", "cliente_proveedor"], // Gestión de proyectos del cliente
  },
  {
    link: "/dashboard/orders",
    title: "Mis ordenes",
    icon: EnvelopeIcon,
    roles: ["cliente", "cliente_proveedor"], // Órdenes de alquiler realizadas
  },
  {
    link: "/dashboard/tracking",
    title: "Seguimiento de orden y logística",
    icon: WrenckIcon,
    roles: ["cliente", "cliente_proveedor", "proveedor"], // Tracking de órdenes activas
  },
  {
    link: "/dashboard/support",
    title: "Soporte",
    icon: HearthIcon,
    roles: ["cliente", "cliente_proveedor"], // Soporte técnico/comercial
  },
  {
    link: "/dashboard/notifications",
    title: "Notificaciones",
    icon: HearthIcon,
    roles: ["cliente", "cliente_proveedor"], // Notificaciones específicas de cliente
  },

  /* ----------------------------------------------------
   * SECCIÓN PROVEEDOR - Funcionalidades para usuarios que rentan maquinaria
   * También accesible para cliente_proveedor (usuarios híbridos)
   * -------------------------------------------------- */
  {
    link: "/dashboard/equipaments",
    title: "Gestionar maquinaria",
    icon: BulldozerIcon,
    roles: ["proveedor", "cliente_proveedor"], // CRUD de maquinaria disponible
  },
  {
    link: "/dashboard/operators",
    title: "Gestionar operadores",
    icon: WrenckIcon,
    roles: ["proveedor", "cliente_proveedor"], // Gestión de operadores asignados
  },
  {
    link: "/dashboard/rentals",
    title: "Gestionar rentas",
    icon: PencilWrite,
    roles: ["proveedor", "cliente_proveedor"], // Gestión de contratos de renta
  },
  {
    link: "/dashboard/referrals",
    title: "Mis referidos",
    icon: HearthIcon,
    roles: ["proveedor", "cliente_proveedor"], // Sistema de referidos para proveedores
  },
  {
    link: "/dashboard/notifications-provider",
    title: "Notificaciones",
    icon: HearthIcon,
    roles: ["proveedor", "cliente_proveedor"], // Notificaciones específicas de proveedor
  },

  /* ----------------------------------------------------
   * SECCIÓN OPERADORES - Funcionalidades específicas para operadores
   * Los operadores son creados por proveedores y tienen un conjunto específico de funcionalidades
   * -------------------------------------------------- */
  {
    link: "/dashboard/operator/profile",
    title: "Perfil",
    icon: UserProfileIcon,
    roles: ["operador"], // Gestión del perfil del operador (completar datos que el proveedor no llenó)
  },
  {
    link: "/dashboard/operator/assigned-tasks",
    title: "Tareas asignadas",
    icon: PencilWrite,
    roles: ["operador"], // Tareas asignadas por el proveedor
  },
  {
    link: "/dashboard/operator/operational-log",
    title: "Registro operativo",
    icon: BulldozerIcon,
    roles: ["operador"], // Registro de operaciones realizadas
  },
  {
    link: "/dashboard/operator/guided-navigation",
    title: "Navegación guiada",
    icon: WrenckIcon,
    roles: ["operador"], // Sistema de navegación/GPS para operaciones
  },
  {
    link: "/dashboard/operator/incident-report",
    title: "Reporte de incidencias",
    icon: EnvelopeIcon,
    roles: ["operador"], // Reportar problemas, fallas, incidentes
  },
  {
    link: "/dashboard/operator/notifications",
    title: "Notificaciones",
    icon: HearthIcon,
    roles: ["operador"], // Notificaciones específicas para operadores
  },
  {
    link: "/dashboard/operator/operational-check",
    title: "Check operativo y seguridad",
    icon: WrenckIcon,
    roles: ["operador"], // Checklist de seguridad y operativo antes de iniciar trabajo
  },

  /* ----------------------------------------------------
   * FUNCIONALIDADES FUTURAS - Comentadas temporalmente
   * Estas funcionalidades se implementarán en versiones posteriores
   * -------------------------------------------------- */
  // {
  //   link: "/dashboard/bitacora",
  //   title: "Bitacora digital",
  //   icon: BulldozerIcon,
  //   roles: ["proveedor", "cliente_proveedor"], // Registro digital de operaciones
  // },

] satisfies SidebarMenuProps[];