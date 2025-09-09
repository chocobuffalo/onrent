export default async function setProfileForm({token,fullName,telephone,avatar}:{token:string,fullName?:string,telephone?:string,avatar?:string}) {
    const body: {name?: string; phone?: string; image_base64?: string} = {}
    if(fullName) body.name = fullName;
    if(telephone) body.phone = telephone;
    if(avatar) body.image_base64 = avatar;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/update_profile`, {
        method: 'PUT',
        headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        body: JSON.stringify(body)
    })
    const data = await res.json();
    return data;
}
