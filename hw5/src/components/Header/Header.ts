import * as Utils from '../../utils';
import * as Modal from '../Modal/Modal';
import * as Interfaces from '../../interfaces';
require('./Header.css');

function WeatherWidget() {
    let defaultLatitude = 41.6938, defaultLlongitude = 44.8015;
    const displayWeather = (data: {location: any;current: any;}) => {
        const temp = Utils.Container({ classNames: ["header__weather-temperature"] });
        const cityLabel = Utils.Container({ classNames: ["header__city"] });
        const weatherIcon = document.createElement("img");
        weatherIcon.src = data.current.condition.icon; // Set the URL of the image
        weatherIcon.width = 57;
   
        cityLabel.innerText = data.location.name;
        temp.innerText = data.current.temp_c + "°C";
        row1.append(weatherIcon, temp, cityLabel);
    }
    const row1 = Utils.Container({ classNames: ["row", "header__weather"] });
    getUserLocation()
        .catch(() => { console.log("location problem")})
        .then((location: {latitude: number; longitude: number;}) => {
            getWeatherInfo(location.latitude, location.longitude)
                .then(displayWeather).catch(() => { });
        })
        .catch(() => {
            getWeatherInfo(defaultLatitude, defaultLlongitude)
                .then(displayWeather).catch(() => { });
        });
        return row1;
};

function getUserLocation(): Promise<{latitude: number; longitude: number;}>{
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation is not supported by your browser");
        } else {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    resolve({ latitude, longitude });
                },
                error => {
                    console.log("Unable to retrieve your location");
                    reject(error);
                }
            );
        }
    });
}
function getWeatherInfo(latitude: number, longitude: number):Promise<{location: any;current: any;}> {
    return fetch(`https://api.weatherapi.com/v1/current.json?key=65617eb0a32644169e561914231904&q=${latitude},${longitude}&aqi=no`)
      .then(response => response.json())
      .then(data => {
        const location = data.location;
          const current = data.current;
          console.log({ location, current });
        return { location, current };
      });
}
  
export function constructHeader(addTaskModal: HTMLElement) {
    const row1 = Utils.Container({ classNames: ["row", "header__top"] });
    const header = Utils.Header();
    const weatherWidget = WeatherWidget();
    const h1 = Utils.Heading({ text: "To Do List", type: 1 });
    h1.classList.add("header__title");
    row1.append(h1, weatherWidget);
    header.append(row1);
    const headerMain = Utils.Container({ classNames: ["header__main"] });
    const search = Utils.SearchInput("Search Task");
    search.classList.add("search-input");
    function searchResults(tasks:  HTMLCollectionOf<Element>, searchValue: string, titleSelector: string) {
        for (let i = 0; i < tasks.length; i++) {
            const taskTitle = tasks[i].querySelector(titleSelector).textContent.toLowerCase();
            if (taskTitle.includes(searchValue)) {
                tasks[i].classList.remove("display-none");
            } else {
                tasks[i].classList.add("display-none");
            }
        }
    }
    search.oninput = () => {
        const searchValue = search.value.toLowerCase();
        const currentTasks = document.getElementsByClassName("current");
        const completedTasks = document.getElementsByClassName("completed");
        searchResults(currentTasks, searchValue, ".current__title");
        searchResults(completedTasks, searchValue, ".completed__title");

    }
    const newTaskBtn =Utils.Button({
        text: "+ New Task", onClick: () => {
            Modal.showModal(addTaskModal);
        }
    });
    newTaskBtn.classList.add("header__new-task");
    headerMain.append(search, newTaskBtn);
    header.append(headerMain);
    return header;
}