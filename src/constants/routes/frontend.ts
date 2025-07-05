import { RouteItem } from "@/types/menu";

export const headerLinks: RouteItem[] = [
    {id: 1, name: 'ouienes-somos', title: '¿Quienes Somos?', slug:'/quienes-somos' , target: false},
    {id: 2, name: 'ayuda', title: 'Ayuda', slug:'/ayuda', target: false},
    {id: 3, name: 'iniciar-session', title: 'Iniciar Sesión', slug:'/iniciar-session', target: false},
    {id: 4, name: 'registrate', title: 'Regístrate', slug:'/registrate',extraClass:'button', target: false},
]