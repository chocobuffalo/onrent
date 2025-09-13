export async function updateProject(data:any,token:string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/project/update/${data.id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
      });
    return await res.json();
}