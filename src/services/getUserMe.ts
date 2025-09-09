export async function getUserMe(token: string) {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL_ORIGIN + "/api/user/me", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        method: "GET",

    });
    return response.json();
}