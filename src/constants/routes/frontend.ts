import { RouteItem } from "@/types/menu";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

export const headerLinks: RouteItem[] = [
    {id: 1, name: 'ouienes-somos', title: '¿Quienes Somos?', slug:'/quienes-somos' , target: false,protected:false},
    {id: 2, name: 'ayuda', title: 'Ayuda', slug:'/ayuda', target: false,protected:false},
    {id: 3, name: 'iniciar-session', title: 'Iniciar Sesión', slug:'/iniciar-session', target: false, isLogged:false,protected:true},
    {id: 4, name: 'registrate', title: 'Regístrate', slug:'/registrate',extraClass:'button', target: false,isLogged:false,protected:true},
    {id: 5, name: 'Mi cuenta', title: 'Dashboard', slug:'/dashboard',extraClass:'button',protected:true, target: false,isLogged:true},
    {id: 6, name: 'logout', title: 'Cerrar Sesión', slug:'#logout', target: false, isLogged: true, protected: true},
]

/*
CONTÁCTANOS
Correo electrónico: soporte@onrentx.com

San Luis Potosí, SLP

CONTÁCTANOS AHORA
*/
export const contactLinks: RouteItem[] =[
    {id: 1, rel: 'noopener noreferrer', name: 'correo-electronico', title: 'Email: soporte@onrentx.com', slug:'mailto:soporte@onrentx.com' , target: true},
    {id: 2, rel: 'noopener noreferrer', name: 'ubicacion', title: 'San Luis Potosí, SLP', slug:'https://maps.app.goo.gl/6wNSY3JNckG33VkZ6' , target: true},
    {id: 3, name: 'contacto', title: 'CONTÁCTANOS AHORA', slug:'/contactanos' , target: false},
]

/**
 AYUDA Y LEGAL
Términos y condiciones

¿Cómo puedo ser proveedor?

¿Cómo realizo un pedido?

Derechos del cliente RGPD
 */
export const legalLinks: RouteItem[] = [
    {id: 1, name: 'terminos-y-condiciones', title: 'Términos y condiciones', slug:'/terminos-y-condiciones' , target: false},
    {id: 2, name: 'como-puedo-ser-proveedor', title: '¿Cómo puedo ser proveedor?', slug:'/como-puedo-ser-proveedor' , target: false},
    {id: 3, name: 'como-realizo-un-pedido', title: '¿Cómo realizo un pedido?', slug:'/como-realizo-un-pedido' , target: false},
    {id: 4, name: 'derechos-del-cliente', title: 'Derechos del cliente RGPD', slug:'/derechos-del-cliente' , target: false},
]

/**
 * Enlaces de interés
 * Maquinaria Pesada
 * Maquinaria Ligeras
 * Equipo de Seguridad
 * Equipo de Transporte
 * Materiales
 * 
 */

export const interestLinks: RouteItem[] = [
    {id: 2, name: 'maquinaria-ligera', title: 'Maquinarias Ligera', slug:'/catalogo/maquinaria-ligera' , target: false,image:'/images/ligera.webp',machine_category:'light',type_icon:'/typemachine/ligera.svg'},
    {id: 1, name: 'maquinaria-pesada', title: 'Maquinarias Pesada', slug:'/catalogo/maquinaria-pesada' , target: false,image:'/images/pesada.webp',machine_category:'heavy',type_icon:'/typemachine/pesada.svg'},
    {id: 3, name: 'especializada', title: 'Especializada', slug:'/catalogo/especializada' , target: false,image:'/images/materiales.webp',machine_category:'special',type_icon:'/typemachine/materiales.svg'},
    {id: 4, name: 'otros', title: 'Otros', slug:'/catalogo/otros' , target: false,machine_category:'other',type_icon:'/typemachine/materiales.svg'},
]

/**
 * Social Links
 * X
 * facebook
 * Instagram
 */

export const socialLinks:RouteItem[] =[
    {id: 1, icon:FaXTwitter, rel: 'noopener noreferrer', name: 'x', title: 'x', slug:'https://x.com/onrentx' , target: true},
    {id: 2, icon:FaFacebook, rel: 'noopener noreferrer', name: 'facebook', title: 'Facebook', slug:'https://www.facebook.com/onrentx' , target: true},
    {id: 3, icon:FaInstagram, rel: 'noopener noreferrer', name: 'instagram', title: 'Instagram', slug:'https://www.instagram.com/onrentx' , target: true},
]