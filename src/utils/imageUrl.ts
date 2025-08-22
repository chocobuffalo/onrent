export function getImageUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return `${baseUrl}${path}`;
}
