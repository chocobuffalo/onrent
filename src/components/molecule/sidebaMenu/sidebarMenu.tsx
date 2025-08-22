"use client";

import SidebarLink from "@/components/atoms/sidebarLink/sidebarLink";
import { dashboardRoutes } from "@/constants/routes/dashboard";
import { useUIAppSelector } from "@/libs/redux/hooks";
import useLogout from "@/hooks/frontend/auth/logout/useLogout";
import type { UserRole } from "@/types/menu";
import ExitIcon from "@/components/atoms/customIcons/ExitIcon";

export default function SidebarMenu() {
  const isLogin = useUIAppSelector((state) => state.auth.isLogin);
  const role = useUIAppSelector((state) => state.auth.profile.role) as UserRole;
  const userName = useUIAppSelector((state) => state.auth.profile.name);
  
  const { handleLogout, isLoading: isLogoutLoading } = useLogout();

  const visibleRoutes = dashboardRoutes.filter((route) => {
    if (!route.roles || route.roles.length === 0) return true;
    if (role && route.roles.includes(role)) return true;
    return false;
  });

  if (!isLogin) {
    return (
      <nav className="db-content db-list-menu">
        <h6 className="db-title">Menú</h6>
        <p className="text-sm text-gray-500 px-3">Cargando sesión…</p>
      </nav>
    );
  }

  return (
    <nav className="db-content db-list-menu">
      <h6 className="db-title">Menú</h6>

      <ul className="db-dashboard-menu">
        {visibleRoutes.map((route) => (
          <SidebarLink key={route.title} route={route} />
        ))}
        
        {visibleRoutes.length === 0 && (
          <li className="text-sm text-gray-500 px-3 py-2">
            No hay opciones de menú disponibles para este rol
          </li>
        )}
        
        <li>
          <button 
            onClick={handleLogout}
            disabled={isLogoutLoading}
            className="menu-index-2 d-flex gap-2"
            title={`Cerrar sesión de ${userName || 'usuario'}`}
          >
            <ExitIcon/> 
            {isLogoutLoading ? 'Cerrando...' : 'Salir'}
          </button>
        </li>
      </ul>
    </nav>
  );
}