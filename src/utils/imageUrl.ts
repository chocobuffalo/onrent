
export function getImageUrl(path: string): string {
  if (!path) return "/images/catalogue/machine5.jpg";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      new URL(path);
      return path;
    } catch (error) {
      console.warn("URL inválida:", path);
      return "/images/catalogue/machine5.jpg";
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const fullUrl = path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`;

  try {
    new URL(fullUrl);
    return fullUrl;
  } catch (error) {
    console.warn("No se pudo construir URL válida:", fullUrl);
    return "/images/catalogue/machine5.jpg";
  }
}
