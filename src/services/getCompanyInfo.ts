export async function getCompanyInfo(token:string){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/company_info`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
    })
    if(res.status === 200){
        return res.json();
    }
    return null;
    
}