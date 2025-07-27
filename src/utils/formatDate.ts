export function formatDate(date: string): string {
    const currentDate = new Date(date);
    const formatter = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
    return formatter.format(currentDate).replace(/\//g, '-');
}