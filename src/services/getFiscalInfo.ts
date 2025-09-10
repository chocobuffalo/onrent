export const getFiscalInfo = async (token: string) => {
  const axiosInstance = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/fiscal_info`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const response = await axiosInstance.json();
  return response;
}