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

export const terrainTypes:string[] = [
    'Firme',
    'Lodoso',
    'Inclinado',
    'Obstáculos'
]