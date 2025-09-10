export async function setCompanyInfoData({token,empresa,rfc_empresa,direccion_empresa,contacto_fiscal,telefono_contacto,representante_legal,empleados}:{token:string,empresa?:string,rfc_empresa?:string,direccion_empresa?:string,contacto_fiscal?:string,telefono_contacto?:string,representante_legal?:string,empleados?:number}){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/company_info`, {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({
            empresa,
            rfc_empresa,
            direccion_empresa,
            contacto_fiscal,
            telefono_contacto,
            representante_legal,
            empleados
        })
    })
    return response.json()
}
