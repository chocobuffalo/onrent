interface SubmitSectionProps {
  loading: boolean;
  error: string | null;
}

export default function SubmitSection({ loading, error }: SubmitSectionProps) {
  return (
    <div className="pt-10">
      <button
        type="submit"
        disabled={loading}
        className="w-full px-10 cursor-pointer block bg-secondary lg:w-fit hover:text-secondary border-1 duration-300 border-secondary hover:bg-transparent text-white py-3 rounded-sm font-semibold mt-4 mx-auto disabled:opacity-50"
      >
        {loading ? "Procesando..." : "RESERVAR"}
      </button>
      {error && (
        <div className="mt-2">
          <p className="text-red-600 text-sm font-semibold">Error:</p>
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
