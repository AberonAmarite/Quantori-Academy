import * as Utils from '../../utils';
import * as Modal from '../Modal/Modal';
import * as Interfaces from '../../interfaces';
import React, { useState } from 'react';
import './Header.css';

type HeaderProps = {
    addTaskModal: HTMLElement;
}
 function WeatherWidget() {
    let defaultLatitude = 41.6938, defaultLlongitude = 44.8015;
    const [imgSrc, setImgSrc] = useState('');
  const [locationName, setLocationName] = useState('');
  const [tempText, setTempText] = useState('');
    const displayWeather = (data: { location: any; current: any; }) => {
        setImgSrc(data.current.condition.icon);
        setLocationName(data.location.name);
        setTempText(data.current.temp_c + "°C");

    }

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

    return (
        <div className='row header__weather'>
            <img src={imgSrc} alt="" width="57" />
            <div className='header__weather-temperature'>{tempText}</div>
            <div className='header__city'>{locationName}</div>
        </div>
        );
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
        return { location, current };
      });
}
  
export function Header(props: HeaderProps): JSX.Element {
    
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
    let search = document.getElementById("search-tasks");
    const searchTasks = () => {
        
        const searchValue = search.value.toLowerCase();
        const currentTasks = document.getElementsByClassName("current");
        const completedTasks = document.getElementsByClassName("completed");
        searchResults(currentTasks, searchValue, ".current__title");
        searchResults(completedTasks, searchValue, ".completed__title");
        
    }

    const searchInput = (
        <input type="search" placeholder='Search Task' className='search-input' id="search-tasks" onInput={searchTasks} />
    );
    const addNewTask = () => {
        Modal.showModal(props.addTaskModal);
    };

    return (
        <header className='header'>
            <div className='row header__top'>
                <h1 className='header__title'>To Do List</h1>
                <WeatherWidget />
            </div>
            <div className='row header__main'>
                {searchInput}
                <button className='header__new-task' onClick={addNewTask}>+ New Task</button>
            </div>
        </header>
    );
}