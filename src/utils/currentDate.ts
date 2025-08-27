export default function currentDate(){
    const today = new Date();
    const dateObject = {
        year: today.getFullYear(),
        month: today.getMonth() + 1, // Los meses en JavaScript son 0-indexed
        day: today.getDate(),
    }
    return dateObject
}