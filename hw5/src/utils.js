const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
 
 /**
     * Button component
     * @param text {string}
     * @param onClick {export function}
     * @returns {HTMLButtonElement} - Button element
     */
 export function Button({ text, onClick }) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.onclick = onClick;
    return button;
}
export function Container({ classNames }) {
    const div = document.createElement("div");
    div.classList.add(...classNames);
    return div;
}
export function Paragraph({ text }) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = text;
    return paragraph;
}
export function Heading({ text, type }) {
    if (type > 0 && type < 7) {
        let tag = "h" + type;
        const paragraph = document.createElement(tag);
        paragraph.innerHTML = text;
        return paragraph;
    }else {
        throw new Error("Invalid type value. Type should be between 1 and 6.");
      }
}

export function SearchInput(placeholder) {
    const search = document.createElement("input");
    search.type = "search";
    search.placeholder = placeholder;
    return search;
}

export function Header() {
    const header = document.createElement("header");
    header.classList.add("header")
    return header;
}


export function extractDayAndName(date) {
    let month = date.getMonth();
    let dayName = date.getDay();
    let day = date.getDate();
    return [dayName, day, month];
}
export function extractDateWithZeroes(date) {
    let month = date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    // [DD,MM,YYYY]
    return [day, month, date.getFullYear()];
}
export function numberToMonth(num) {
    return months[num];
}
export function numberToDay(num) {
    return dayNames[num];
}