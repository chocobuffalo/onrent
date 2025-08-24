export default function currentDate():{day:number,month:number,year:number}{
    const today = new Date();
    return{
        day: today.getDate(),
        month: today.getMonth() + 1, // Los meses en JavaScript son 0-indexed
        year: today.getFullYear()
    }
}