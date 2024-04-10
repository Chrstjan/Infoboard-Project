// CURRENT WEATHER:
getWeatherData();
function getWeatherData() {
  console.log();

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Aalborg&appid=4d58d6f0a435bf7c5a52e2030f17682d&units=metric`;

  // fetching API data & turning it into JSON format
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      receiveWeatherData(data);
    })
    .catch((error) => {
      console.error("error fetching data", error);
      // return null;
    });
}

function receiveWeatherData(weatherData) {
  let temperature = Math.round(weatherData.main.temp); // Math.round rounds up/down to nearest temperature /PO
  let weatherIcon = weatherData.weather[0].icon;
  console.log(weatherData);

  displayTemp(temperature);
  displayIcon(weatherIcon);
}

// view code
// function to display current temperature
function displayTemp(myTemp) {
  console.log(myTemp);

  // making variable and calling html id to show current temperature in Celsius
  const myCurrentWeather = document.getElementById("currentWeather");
  myCurrentWeather.innerText = `${myTemp}°C`;
}

// function to display current weather corresponding icon
function displayIcon(myIcon) {
  console.log(myIcon);

  // making variable and calling html id to show current weather icon
  const myCurrentIcon = document.getElementById("currentIcon");

  // corresponding svg icons to api weather conditions icons
  const weatherIconsList = {
    "01d": "sunny.svg",
    "02d": "sunny_cloudy.svg",
    "03d": "2clouds.svg",
    "04d": "cloudy.svg",
    "09d": "shower_rain.svg",
    "10d": "rain.svg",
    "11d": "thunderstorm.svg",
    "13d": "snow.svg",
    "15d": "fog.svg",
    "50d": "light_rain.svg"
  };

  const iconFileName = weatherIconsList[myIcon];
  console.log(iconFileName);
  if (iconFileName) {
    // setting a path for displaying my svg icons
    const iconPath = `assets/img/${iconFileName}`;
    // console.log(iconPath);
    myCurrentIcon.setAttribute("src", iconPath);
    // console.log(myCurrentIcon);
  } else {
    console.error("Weather icon not found");
  }








  // if (myCurrentIcon === undefined) {
  //   console.log("The value is undefined");
  // } else if (myCurrentIcon === null) {
  //   console.log("The value is null");
  // } else {
  //   console.log("The value is neither undefined nor null");
  // }
}

//   const iconPath = `./assets/img/${iconFileName}.svg`;
//   myCurrentIcon.setAttribute('src', iconPath);
// }

//   const weatherType = weatherData.weather[0].icon;
//   return weatherIconsList[weatherType];
// }

// const data = getWeatherData();
// const weatherIcons = createWeatherIcons(data);
// console.log(weatherIcons);
// displayIcon(weatherIcons);

// if (data.weather[0].main === 'Clouds') {
//   weather_icon.src = 'assets/img/cloudy.svg'
// }

// navigator.geolocation.getCurrentPosition((position) => {
//     const lat = position.coords.latitude;
//     const long = position.coords.longitude;
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Aalborg&appid=4d58d6f0a435bf7c5a52e2030f17682d&units=metric`;

//     fetch(apiUrl)
//       .then(response => response.json())
//       .then(data => {
//         const temp = data.main.temp;
//         console.log(`Current temperature is ${temp} degrees Celsius at latitude ${lat} and longitude ${long}.`);
//       })
//       .catch(error => console.log(error));

//   });
