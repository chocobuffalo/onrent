
export default async function getProfile(token:string) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/profile`, {
        method: 'GET',
        headers: {
                "Authorization": `Bearer ${token}`
            }
    })
    const data = await res.json();
        //console.log(data," data en ProfileForm");
    return data;
}
