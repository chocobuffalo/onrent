export async function setFiscalInfo({token,constancia_pdf,direccion_fiscal,razon_social,rfc}:{token:string,constancia_pdf?:string,direccion_fiscal?:string,razon_social?:string,rfc?:string}) {
    /**
   * constancia_pdf:"",
   * direccion_fiscal:"",
   * razon_social:"",
   * rfc:""
   */
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/fiscal_info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          constancia_pdf,
          direccion_fiscal,
          razon_social,
          rfc
        })
    })
    return await response.json();
}