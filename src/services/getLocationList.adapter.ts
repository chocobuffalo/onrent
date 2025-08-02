/* eslint-disable @typescript-eslint/no-explicit-any */
export const getLocationList = async (query: string) => {
  const response = await fetch(
    `/api/get-autocomplete?query=${encodeURIComponent(query)}`
  );

  const { data } = await response.json();

  console.log(data.ResultItems);
  const mapData = data.ResultItems.map((location: any) => {
    const label = `${location.Title}`;
    const value = `${location.PlaceId}`;
    return {
      label,
      value,
      color: "#fff",
    };
  });

  return mapData;
};
