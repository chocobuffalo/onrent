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
        childrens:null,
        function:null
    },
    {
        link:'/dashboard/equipaments',
        title:'Gestión de maquinaria',
        icon: BulldozerIcon,
        childrens: null,
        function:null
    },
    {
        link: '/dashboard/orders',
        title: 'Solicitudes de Renta',
        icon:PencilWrite,
        childrens: null,
        function:null
    },
    {
        link:'/dashboard/favorites',
        title:"Favoritos",
        icon: HearthIcon,
        childrens: null,
        function:null
    },
    {
        link:'/dashboard/reviews',
        title:"Reseñas",
        icon:EnvelopeIcon,
        childrens: null,
        function:null
    },
    {
        link:'/dashboard/profile',
        title:"Perfil",
        icon:UserProfileIcon,
        childrens: null,
        function:null
    },
    {
        link:'/dashboard/changepass',
        title:"Cambio de contraseña",
        icon:WrenckIcon,
        childrens: null,
        function:null
    },
    {
        link:'#',
        title:'Salir',
        icon:ExitIcon,
        function:()=>console.log('object'),
        childrens:null
    }
]