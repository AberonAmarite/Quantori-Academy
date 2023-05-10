import React, { useEffect, useState } from "react";
import "./WeatherWidget.css";

const defaultLatitude = 41.6938,
  defaultLongitude = 44.8015;

const prepareData = (): Promise<any> => {
  return getUserLocation()
    .then((location: { latitude: number; longitude: number }) => {
      return getWeatherData(location.latitude, location.longitude);
    })
    .catch(() => {
      return getWeatherData(defaultLatitude, defaultLongitude);
    });
};

const WeatherWidget = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    prepareData().then((result) => setData(result));
  }, []);

  if (!data) {
    return <div></div>;
  }
  return (
    <div className="row header__weather">
      <img src={data.current.condition.icon} alt="" width="57" />
      <div className="header__weather-temperature">
        {data.current.temp_c + "°C"}
      </div>
      <div className="header__city">{data.location.name}</div>
    </div>
  );
};

function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          resolve({ latitude, longitude });
        },
        (error) => {
          console.log("Unable to retrieve your location");
          reject(error);
        }
      );
    }
  });
}
function getWeatherData(
  latitude: number,
  longitude: number
): Promise<{ location: any; current: any }> {
  return fetch(
    `https://api.weatherapi.com/v1/current.json?key=65617eb0a32644169e561914231904&q=${latitude},${longitude}&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => {
      const location = data.location;
      const current = data.current;
      console.log({ location, current });
      return { location, current };
    });
}

export default WeatherWidget;
