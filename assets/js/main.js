




// CURRENT WEATHER:

function getWeatherData() {
  console.log();

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Aalborg&appid=4d58d6f0a435bf7c5a52e2030f17682d&units=metric`;

fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
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

function receiveWeatherData (weatherData) {
let temperature = weatherData.main.temp;
let weatherIcon = weatherData.weather[0].icon;
console.log(weatherData);


displayTemp(temperature);
displayIcon(weatherIcon);

}


function displayTemp(myTemp) {
    console.log(myTemp);

    const myCurrentWeather = document.getElementById('currentWeather');
    myCurrentWeather.innerText = `${myTemp}°C`;
}

function displayIcon(myIcon) {
  console.log(myIcon);
 
  const myCurrentIcon = document.getElementById('currentIcon');
  // myCurrentIcon.src = iconPath;




    const weatherIconsList = {
    '01d': 'sunny.svg',
    '02d': 'sunny_cloudy.svg',
    '03d': '2clouds.svg',
    '04d': 'cloudy.svg'
  };

  const iconFileName = weatherIconsList[weatherIcon];

  const iconPath = `./assets/img/${iconFileName}.svg`;
  myCurrentIcon.setAttribute('src', iconPath);
}





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

  