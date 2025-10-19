interface SubmitSectionProps {
  loading: boolean;
  error: string | null;
  hasItems?: boolean;
}

export default function SubmitSection({ 
  loading, 
  error, 
  hasItems = false
}: SubmitSectionProps) {
  return (
    <div className="pt-10">
      <button
        type="submit"
        disabled={loading || !hasItems}
        className="w-full px-10 cursor-pointer block bg-secondary lg:w-fit hover:text-secondary border-1 duration-300 border-secondary hover:bg-transparent text-white py-3 rounded-sm font-semibold mt-4 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Procesando..." : "RESERVAR"}
      </button>
      
      {!hasItems && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Haz clic en 'agregar' para comenzar tu reserva
        </p>
      )}

      {error && (
        <div className="mt-2">
          <p className="text-red-600 text-sm font-semibold">Error:</p>
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}