export default async function changePass({newPass,email,token}:{newPass:string,email:string,token:string}){
    try {
        ///api/user/update_password
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/user/update_password`,{
             method: "PUT",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": `Bearer ${token}`
             },
             body: JSON.stringify({ new_password: newPass,email })
         });
         return await res.json();
    } catch (error) {
        throw { error: "Error updating password: ",errorDetails:error };
    }

}
