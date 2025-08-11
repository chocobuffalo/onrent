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

    // Creación de objetos Date (nota: los meses en Date son 0-indexed)
    const start = new Date(startDay.year, startDay.month - 1, startDay.day);
    const end = new Date(endDay.year, endDay.month - 1, endDay.day);

    // Comparación directa sin usar librerías externas
    return start.getTime() !== end.getTime();
}


export function fixDate(dateString: string): {day:number,month:number,year:number} {
    
    const [day, month, year] = dateString.split('-').map(Number);
    return{
        month,
        day,
        year
    }
}


export function shortDate(stringDate:string){
    const {day, month, year} = fixDate(stringDate);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short'  };
    //reemplazamos el espacio por un  " de "
    return date.toLocaleDateString('es-ES', options).replace(' ', ' de ');

}

export function countDays(startDate: string, endDate: string): number {
    const firstDate = fixDate(startDate);
    const start = new Date(firstDate.year, firstDate.month - 1, firstDate.day);

    const secondDate = fixDate(endDate);
    const end = new Date(secondDate.year, secondDate.month - 1, secondDate.day);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
}