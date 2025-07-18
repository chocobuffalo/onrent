/***********************************************************************
 * SidebarMenu
 * - Renderiza el menú lateral del dashboard.
 * - Filtra los enlaces según el `role` guardado en la sesión NextAuth.
 * - Muestra un pequeño texto mientras la sesión está cargando.
 **********************************************************************/
"use client"; // Necesario porque usamos `useSession()` (hook de cliente)

import { signOut, useSession } from "next-auth/react";
import SidebarLink from "@/components/atoms/sidebarLink/sidebarLink";
import { dashboardRoutes } from "@/constants/routes/dashboard";
import type { UserRole } from "@/types/menu"; // 'PROVIDER' | 'CLIENT'
import ExitIcon from "@/components/atoms/customIcons/ExitIcon";

export default function SidebarMenu() {
  /* ------------------------------------------------------------------
   * 1. Obtener la sesión ↴ { status: 'loading' | 'authenticated' | ... }
   * ----------------------------------------------------------------*/
  const { data: session, status } = useSession();
  const role = session?.user?.role as UserRole | undefined;

  /* ------------------------------------------------------------------
   * 2. Filtrar las rutas:
   *    - Si el objeto tiene `roles`, lo mostramos solo si incluye el rol.
   *    - Si NO tiene `roles`, se muestra a todos.
   * ----------------------------------------------------------------*/
  const visibleRoutes = dashboardRoutes.filter((route) =>
    route.roles ? role && route.roles.includes(role) : true
  );

  /* ------------------------------------------------------------------
   * 3. Render
   * ----------------------------------------------------------------*/
  return (
    <nav className="db-content db-list-menu">
      <h6 className="db-title">Menú</h6>

      {status === "loading" ? (
        /* Opcional: reemplázalo por un Skeleton si usas shadcn/ui */
        <p className="text-sm text-gray-500 px-3">Cargando menú…</p>
      ) : (
        <ul className="db-dashboard-menu">
          {visibleRoutes.map((route) => (
            <SidebarLink key={route.title} route={route} />
          ))}
          <li>
            <button onClick={() => signOut({ redirect: true, callbackUrl: '/' })} className="menu-index-2 d-flex gap-2">
              <ExitIcon/> Salir
            </button>
            </li>
        </ul>
      )}
    </nav>
  );
}

// Extiende el tipo User para incluir 'role'
declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
}
