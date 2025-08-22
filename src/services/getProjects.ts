export default async function getProjects(token:string) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/project/list`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error("Error al obtener los proyectos");
    }
    return response.json();
}