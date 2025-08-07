import ChangePassForm from "@/components/organism/backoffice/backoffice/chancePass/changePassForm";
import { Metadata } from "next";


export const metadata:Metadata ={
    title: 'Cambiar Contraseña',
    description: 'Página para cambiar la contraseña del usuario',
}


export default function ChangePass() {
return <ChangePassForm />
}
