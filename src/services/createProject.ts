export default async function createProject(data: any,token:string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/project/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return await res.json();
}
