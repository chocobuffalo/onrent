import ProfileForm from "@/components/organlism/backoffice/backoffice/profileForm/profileForm"
import { Metadata } from "next"

export const metadata:Metadata ={
    title: 'Cambiar Contraseña',
    description: 'Página para cambiar la contraseña del usuario',
}
export default function Profile(){
    return(
        <>
            <h1 className="admin-title">Perfil</h1>
            <ProfileForm/>
        </>
    )
}