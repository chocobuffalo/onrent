import BulldozerIcon from "@/components/atoms/customIcons/bulldozers";
import DashboardIcon from "@/components/atoms/customIcons/dashboard";
import ExitIcon from "@/components/atoms/customIcons/ExitIcon";
import HearthIcon from "@/components/atoms/customIcons/hearthIcon";
import PencilWrite from "@/components/atoms/customIcons/pencilWrite";
import EnvelopeIcon from "@/components/atoms/customIcons/reviewIcon";
import UserProfileIcon from "@/components/atoms/customIcons/userProfileIcon";
import WrenckIcon from "@/components/atoms/customIcons/wrenkIcon";
import { SidebarMenuProps } from "@/types/menu";



export const dashboardRoutes:SidebarMenuProps[] = [
    {
        link:'/dashboard',
        title:'Dashboard',
        icon: DashboardIcon,
       
    },
    {
        link:'/dashboard/equipaments',
        title:'Gestión de maquinaria',
        icon: BulldozerIcon,
      
    },
    {
        link: '/dashboard/orders',
        title: 'Solicitudes de Renta',
        icon:PencilWrite,
       
    },
    {
        link:'/dashboard/favorites',
        title:"Favoritos",
        icon: HearthIcon,
        
    },
    {
        link:'/dashboard/reviews',
        title:"Reseñas",
        icon:EnvelopeIcon,
      
    },
    {
        link:'/dashboard/profile',
        title:"Perfil",
        icon:UserProfileIcon,
    },
    {
        link:'/dashboard/changepass',
        title:"Cambio de contraseña",
        icon:WrenckIcon,
    },
    {
        link:'#',
        title:'Salir',
        icon:ExitIcon,
        action:()=>console.log('object'),
       
    }
]