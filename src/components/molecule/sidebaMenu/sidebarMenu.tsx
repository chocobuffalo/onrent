import SidebarLink from "@/components/atoms/sidebarLink/sidebarLink";
import { dashboardRoutes } from "@/constants/routes/dashboard";
import { SidebarMenuProps } from "@/types/menu";


export default function SidebarMenu(){
    return(
      <div className="db-content db-list-menu">
        <h6 className="db-title">Menu</h6>
        <div className="db-dashboard-menu">
          {/* si es tipo proveedor */ }
          <ul>
            {
              dashboardRoutes.map((route) => <SidebarLink key={route.title} route={route} />)
            }
            
          </ul>
        </div>
      </div>
    )
}