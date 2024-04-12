const busContainer = document.getElementById("busDeparture");

getBusdata();

setInterval(getBusdata, 60000);

function getBusdata() {
  const apiUrl =
    "https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1";
  fetch(apiUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error fetching bus data");
      }
      return res.json();
    })
    .then((json) => {
      busPlan(json);
      console.log(json);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}

function busPlan(busdata) {
  const container = document.getElementById("busplan");

  const sliced_data = busdata.MultiDepartureBoard.Departure.slice(0, 5);

  console.log(sliced_data);

  if (sliced_data.length) {
    container.innerHTML = "";

    sliced_data.map((value, index) => {
      const ul = document.createElement("ul");
      const li_name = document.createElement("li");
      li_name.classList.add("bus-line");
      li_name.innerText = value.line;

      const li_stop = document.createElement("li");
      li_stop.classList.add("line-stop");
      li_stop.innerText = value.stop.replace(/\([^)]*\)/g, "").toUpperCase();

      const li_direction = document.createElement("li");
      li_direction.classList.add("line-direction");
      li_direction.innerText = value.direction
        .replace(/\([^)]*\)/g, "")
        .toUpperCase();

      const li_time = document.createElement("li");
      if (value.rtTime) {
        li_time.innerText = calcRemainingTime(`${value.date} ${value.rtTime}`);
        li_time.classList.add("delayed-bus");
      } else {
        li_time.innerText = calcRemainingTime(`${value.date} ${value.time}`);
        li_time.classList.add("bus-departure");
      }

      ul.append(li_name, li_stop, li_time);
      container.append(ul);
    });
  }

  // setTimeout(() => busPlan(busdata), 30000); // DO NOT RUN THIS! This ruined our code 😡😡
}

const calcRemainingTime = (departure_time) => {
  const currentTimeStamp = new Date().getTime();
  const departureTime = departure_time.split(/[.: ]/);

  const departureYear = new Date().getFullYear();
  const departureMonth = parseInt(departureTime[1], 10) - 1;
  const departureDay = parseInt(departureTime[0], 10);
  const departureHours = parseInt(departureTime[3], 10);
  const departureMinutes = parseInt(departureTime[4], 10);

  const departureTimeStamp = new Date(
    departureYear,
    departureMonth,
    departureDay,
    departureHours,
    departureMinutes
  ).getTime();

  const diff_seconds = Math.abs(
    Math.floor((departureTimeStamp - currentTimeStamp) / 1000)
  );
  const diff_hours = Math.floor(diff_seconds / 3600);
  const diff_minutes = Math.floor(diff_seconds / 60);
  return diff_hours
    ? `${diff_hours} t ${diff_minutes} min`
    : `${diff_minutes} min`;
};
