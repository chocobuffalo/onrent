export async function newRole(data: { new_role: string,token:string }) {
    const { token, new_role } = data; // Extract token from data
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL_ORIGIN + "/api/user/change_role", {
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
            method: "PUT",
            body: JSON.stringify({ new_role }),
        });
        return   response.json();
    } catch (error) {
        return { error: "Error updating role" };
    }
}