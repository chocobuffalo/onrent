/**
 * Compara dos fechas y devuelve true si son diferentes o si la fecha de inicio es anterior
 * @param startDate Fecha de inicio en formato string (debe ser parseable por fixDate)
 * @param endDate Fecha de fin en formato string (debe ser parseable por fixDate)
 * @returns true si las fechas son diferentes o si startDate es anterior a endDate
 */
export function compareDate(startDate: string, endDate: string): boolean {
    // Validación de parámetros
    if (!startDate || !endDate) {
        return false;
    }

    // Parseo de fechas
    const startDay = fixDate(startDate);
    const endDay = fixDate(endDate);

    if (!startDay || !endDay) {
        return false;
    }

    // Creación de objetos Date (nota: los meses en Date son 0-indexed)
    const start = new Date(startDay.year, startDay.month - 1, startDay.day);
    const end = new Date(endDay.year, endDay.month - 1, endDay.day);

    // Comparación directa sin usar librerías externas
    return start.getTime() !== end.getTime();
}


export function fixDate(dateString: string) {

    const [day, month, year] = dateString.split('-').map(Number);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return false;
    }

    return{
        month,
        day,
        year
    }
}


export function shortDate(stringDate:string){
    const day = fixDate(stringDate);
    if(!day) return "";
    const date = new Date(day.year, day.month - 1, day.day);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short'  };
    //reemplazamos el espacio por un  " de "
    return date.toLocaleDateString('es-ES', options).replace(' ', ' de ');

}

export function countDays(startDate: string, endDate: string): number {
    const firstDate = fixDate(startDate);
    const secondDate = fixDate(endDate);
    if (!firstDate || !secondDate) return 0;
  
    const startUTC = Date.UTC(firstDate.year, firstDate.month - 1, firstDate.day);
    const endUTC = Date.UTC(secondDate.year, secondDate.month - 1, secondDate.day);
  
    const diff = (endUTC - startUTC) / (1000 * 60 * 60 * 24);
  
    // Inclusivo: siempre sumamos 1 día
    return Math.max(1, Math.floor(diff) + 1);
  }
  
  
