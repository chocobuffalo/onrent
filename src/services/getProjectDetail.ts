export default async function getProjectDetail(projectId: string,token:string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/project/${projectId}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

    });
    return response.json();
  } catch (error) {
    console.error("Error fetching project details:", error);
    return { error: error || "Unknown error" };
  }
}
