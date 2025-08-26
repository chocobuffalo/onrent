export default function MapLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  );
}
