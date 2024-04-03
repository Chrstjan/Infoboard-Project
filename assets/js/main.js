




// CURRENT WEATHER:
navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Aalborg&appid=4d58d6f0a435bf7c5a52e2030f17682d&units=metric`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const temp = data.main.temp;
        console.log(`Current temperature is ${temp} degrees Celsius at latitude ${lat} and longitude ${long}.`);
      })
      .catch(error => console.log(error));

  });

  function displayWeatherInfo(data) {

}

  const displayTemp = document.getElementById('currentTemp');
