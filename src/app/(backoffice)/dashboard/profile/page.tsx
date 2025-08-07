import ProfileForm from "@/components/organism/backoffice/backoffice/profileForm/profileForm"
import { Metadata } from "next"

export const metadata:Metadata ={
    title: 'Editar perfil',
    description: 'Página para editar el perfil del usuario',
}
export default function Profile(){
    return(
        <>
            <h1 className="admin-title mb-2">Editar perfil</h1>
            <ProfileForm/>
        </>
    )
}