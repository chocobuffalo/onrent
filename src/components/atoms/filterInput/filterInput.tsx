'use client';

import { useUIAppSelector } from "@/libs/redux/hooks";
import { useState } from "react";

export default function FilterInput() {
    const getLocation = useUIAppSelector((state) => state.filters.location);
    const [inputValue, setInputValue] = useState<string>(getLocation?.label || '');
    return (
        <div className="search-input">
            <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Buscar..."
            className="border border-gray-300 rounded-md p-2 w-full"
        />
        <ul className="listen-items">
            <li className="list-item"><button className="item"></button></li>
        </ul>
        </div>
    );
}
