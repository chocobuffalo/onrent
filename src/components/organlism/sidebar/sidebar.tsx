'use client';

import DashboardAvatar from "@/components/molecule/dashboardAvatar/dashboardAvatar";
import DashboardLogo from "@/components/molecule/dashboardLogo/dashboardLogo";
import SidebarMenu from "@/components/molecule/sidebaMenu/sidebarMenu";

import { useEffect } from "react";


export default function Sidebar(){
     useEffect(() => {
        // Function to open the dashboard
        if(window !== undefined){
                const openDashboard = () => {
          document.querySelector(".sidebar-dashboard")!.classList.add("active");
          document.querySelector(".dashboard-overlay")!.classList.add("active");
        };
    
        // Function to close the dashboard
        const closeDashboard = () => {
          document.querySelector(".sidebar-dashboard")!.classList.remove("active");
          document.querySelector(".dashboard-overlay")!.classList.remove("active");
        };
    
        // Adding event listeners
        const openButton = document.querySelector(".dashboard-toggle");
        const overlay = document.querySelector(".dashboard-overlay");
    
        openButton?.addEventListener("click", openDashboard);
        overlay?.addEventListener("click", closeDashboard);
    
        // Cleanup: Remove event listeners on component unmount
        return () => {
          openButton?.removeEventListener("click", openDashboard);
          overlay?.removeEventListener("click", closeDashboard);
        };
        }
      }, []);
    return(
           <>
              <div className="dashboard-overlay" />
              <aside className="sidebar-dashboard">
                <DashboardLogo/>
                <DashboardAvatar/>
                <SidebarMenu/>
              </aside>
            </>
    )
}