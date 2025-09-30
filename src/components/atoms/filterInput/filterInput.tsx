import useAutoComplete from "@/hooks/frontend/buyProcess/useAutoComplete";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import "./filterInput.scss";

interface FilterInputProps {
  checkpersist?: boolean;
  inputClass?: string;
  name?: string;
}

export default function FilterInput({
  checkpersist,
  inputClass,
  name = "location",
}: FilterInputProps) {
  const {
    inputValue,
    isLoading,
    handlerChange,
    handlerFocus,
    handlerInputChange,
    open,
    setOpen,
    searchResults,
  } = useAutoComplete(checkpersist);

  const inputClasses = inputClass 
    ? `${inputClass} input-item flex items-center gap-2` 
    : "input-item flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2";

  return (
    <div className="search-input relative w-full">
      <div className={inputClasses}>
        <FaMapMarkerAlt className="text-black" />
        <input
          onFocus={() => handlerFocus(inputValue)}
          type="text"
          value={inputValue}
          name={name}
          onChange={(e) => handlerInputChange(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="Indica tu ubicación"
          className="italic rounded-md p-2 w-full focus-visible:outline-none focus:border-secondary focus:ring-0"
        />
      </div>
      <ul
        className={`listen-items border-gray-300 absolute z-10 bg-white border rounded-md w-full max-h-60 overflow-y-auto shadow-lg mt-2 ${
          open ? "block" : "hidden"
        }`}
      >
        {isLoading ? (
          <li className="list-item w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors">
            <ImSpinner8 color="#ea6300" size={20} className="animate-spin mx-auto" />
          </li>
        ) : searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <li key={index} className="list-item">
              <button
                className="w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors hover:bg-gray-200 text-left"
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handlerChange(index);
                }}
              >
                {result.Place.Label}
              </button>
            </li>
          ))
        ) : inputValue.trim() !== "" ? (
          <li className="list-item w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors">
            <span>No hay resultados</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}