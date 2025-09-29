import ChangePassForm from "@/components/organism/backoffice/backoffice/chancePass/changePassForm";
import { Metadata } from "next";


export const metadata:Metadata ={
    title: 'Cambiar Contraseña',
    description: 'Cambia la contraseña de tu cuenta de forma segura',
}

export default function ChangePass() {
return <ChangePassForm />
}
