import { Search } from "lucide-react";

export default function SearchButton(){
    return (
        <button 
            type="submit" 
            className="search-button flex duration-300 cursor-pointer items-center justify-center bg-secondary border  rounded-[5px] h-[40px] w-full text-[18px] font-bold text-white hover:text-secondary hover:bg-white"
        >
            <span className="mr-2">Buscar</span>
            <Search className="w-5 h-5" />
        </button>
    );
}