'use client';
import { useState } from "react";

export default function useFiscalInfo() {
    const [isLoading, setIsLoading] = useState(false);

    return {
        isLoading
    };
}