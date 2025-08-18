'use client'

import { useState } from "react"

export function useFileConvert() {
  const [base64File, setBase64File] = useState('')

    const convertFileToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
        setBase64File(reader.result as string);
        };
        reader.readAsDataURL(file);
        // guardar el archivo en base64 en el estado
        
    };
    // This function can be used to reset the base64 file state

  return{base64File, convertFileToBase64}
}