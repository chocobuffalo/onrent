import SidebarLink from '@/components/atoms/sidebarLink/sidebarLink'
import { dashboardRoutes } from '@/constants/routes/dashboard'
import React from 'react'
import  './mobileNav.scss';

export default function MobileNav() {
  return (
    <div className="">
      <div
        className=""
        id="navbarSupportedContent"
      >
          <ul className={`navigation mobileNav`}>
              {dashboardRoutes.map((route) => <SidebarLink key={route.link} route={route} />)}
          </ul>
      </div>
    </div>
  )
}
