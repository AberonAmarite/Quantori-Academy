const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function extractDayAndName(date: Date): [number, number, number] {
    let month = date.getMonth();
    let dayName = date.getDay();
    let day = date.getDate();
    return [dayName, day, month];
}
export function extractDateWithZeroes(date: Date): [string, string, string] {
    let month = (date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1))+"";
    let day = (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())+"";
    // [DD,MM,YYYY]
    return [day, month, ""+ date.getFullYear()];
}
export function numberToMonth(num: number): string {
    return months[num];
}
export function numberToDay(num: number): string {
    return dayNames[num];
}