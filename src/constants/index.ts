import { CustomMetadata } from "@/types";

export const customMetadata:CustomMetadata = {
    siteName: "OnRentX",
    
    icons:{
        icon:[
            {url:'/favicon.png',type: 'image/png'}
        ]
    }
}


export const currency = {
    symbol: "$",
    code: "MXN",
    name: "Peso mexicano"
} 



export const terrainTypes:{label:string,value:string}[] = [
    {label:'Firme',value:'firm'},
    {label:'Lodoso',value:'mud'},
    {label:'Inclinado',value:'inclined'},
    {label:'Obstáculos',value:'obstacles'}
]