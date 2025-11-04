"use client";

import SidebarLink from '@/components/atoms/sidebarLink/sidebarLink';
import { dashboardRoutes } from '@/constants/routes/dashboard';
import { useUIAppSelector } from '@/libs/redux/hooks';
import useLogout from '@/hooks/frontend/auth/logout/useLogout';
import type { UserRole } from '@/types/menu';
import ExitIcon from '@/components/atoms/customIcons/ExitIcon';
import React from 'react';
import './mobileNav.scss';

export default function MobileNav() {
  const role = useUIAppSelector((state) => state.auth.profile.role) as UserRole;
  const userName = useUIAppSelector((state) => state.auth.profile.name);
  
  console.log("ROLE:", role);

  const { handleLogout, isLoading: isLogoutLoading } = useLogout();

  const visibleRoutes = dashboardRoutes.filter((route) => {
    if (!route.roles || route.roles.length === 0) return true;
    if (role && route.roles.includes(role)) return true;
    return false;
  });

  return (
    <div className="">
      <div
        className=""
        id="navbarSupportedContent"
      >
          <ul className={`navigation mobileNav`}>
              {visibleRoutes.map((route) => <SidebarLink key={route.link} route={route} />)}
              
              <li>
                <button 
                  onClick={handleLogout}
                  disabled={isLogoutLoading}
                  className="menu-index-2 d-flex gap-2"
                  title={`Cerrar sesión de ${userName || 'usuario'}`}
                  style={{
                    color: '#2d3748',
                    fontWeight: 'bold'
                  }}
                >
                  <ExitIcon/> 
                  {isLogoutLoading ? 'Cerrando...' : 'Salir'}
                </button>
              </li>
          </ul>
      </div>
    </div>
  );
}
