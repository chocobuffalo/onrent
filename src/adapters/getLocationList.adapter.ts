export const getLocationList = async (query:string) =>{
    const response = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_TEMP_LOCATION_API}&q=${query}`);

    const data = await response.json()
    
    const mapData = data.map((location:any)=>{
        console.log(location);
        console.log(location.address.county);
        console.log(location.address.state);
        const countyLabel = location.address.county ? location.address.county : location.address.state ?location.address.state: false

        const countyValue = countyLabel !== false ? ` - ${countyLabel}`:''

        
        const label = `${location.display_address} - ${location.display_place}`;
        const value = `${location.display_address}${location.display_place}`
        return {
                label, 
                value,
                color:"#fff",
                lon:location.lon,
                lat:location.lat
            }
    })

    return mapData;
}
