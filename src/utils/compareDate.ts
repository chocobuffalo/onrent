/**
 * Compara dos fechas y devuelve true si son diferentes o si la fecha de inicio es anterior
 * @param startDate Fecha de inicio en formato string (debe ser parseable por fixDate)
 * @param endDate Fecha de fin en formato string (debe ser parseable por fixDate)
 * @returns true si las fechas son diferentes o si startDate es anterior a endDate
 */
/**
 * Compara dos fechas y devuelve true si son diferentes
 */
export function compareDate(startDate: string, endDate: string): boolean {
    if (!startDate || !endDate) return false;
  
    const startDay = fixDate(startDate);
    const endDay = fixDate(endDate);
    if (!startDay || !endDay) return false;
  
    const start = new Date(startDay.year, startDay.month - 1, startDay.day);
    const end = new Date(endDay.year, endDay.month - 1, endDay.day);
  
    return start.getTime() !== end.getTime();
  }
  
  export function fixDate(dateString: string) {
    const [day, month, year] = dateString.split("-").map(Number);
    if (!day || !month || !year) return false;
    return { day, month, year };
  }
  
  export function shortDate(stringDate: string) {
    const day = fixDate(stringDate);
    if (!day) return "";
    const date = new Date(day.year, day.month - 1, day.day);
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
    return date.toLocaleDateString("es-ES", options).replace(" ", " de ");
  }
  
  /**
   * Cuenta días de forma inclusiva. Si ambas fechas son iguales → 1 día.
   * Evita desfases por zonas horarias y espacios con un guard explícito.
   */
  export function countDays(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
  
    const s = fixDate(startDate);
    const e = fixDate(endDate);
    if (!s || !e) return 0;
  
    // Construye fechas en formato YYYY-MM-DD y fuerza medianoche local
    const start = new Date(`${s.year}-${String(s.month).padStart(2, "0")}-${String(s.day).padStart(2, "0")}T00:00:00`);
    const end   = new Date(`${e.year}-${String(e.month).padStart(2, "0")}-${String(e.day).padStart(2, "0")}T00:00:00`);
  
    const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
    // Inclusivo: mismo día = 1, dos días = 2, etc.
    return diffDays + 1;
  }  
  