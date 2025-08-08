export default function ToggleButton({ isChecked, onChange }:{ isChecked: boolean, onChange: () => void }) {
    return(
         <div className="toggle-button">
                        <button
                          onClick={onChange}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            isChecked ? "bg-orange-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 left-0 bg-white rounded-full shadow transition-transform ${
                              isChecked ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
        
                      </div>
    )
}