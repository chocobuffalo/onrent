export function formatDate(date: string): string {
    const currentDate = new Date(date);
    const formatter = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
    return formatter.format(currentDate).replace(/\//g, '-');
}

export  const chanceDateFormat = (date: string) => {
    const d = date.split('-');
    const year = d[2];
    const month = d[1];
    const day = d[0];
    return `${year}-${month}-${day}`;
};

export const reverseChangeDateFormat = (date: string) => {
    const d = date.split('-');
    const year = d[0];
    const month = d[1];
    const day = d[2];
    return `${day}-${month}-${year}`;
};