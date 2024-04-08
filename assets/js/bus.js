const app = document.getElementById("app");
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
      console.log(json);
      busPlan(json);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}

function busPlan(busdata) {
  console.log(busdata);
  const container = document.getElementById("busplan");
  container.innerHTML = "";

  const sliced_data = busdata.MultiDepartureBoard.Departure.slice(0, 5);

  const ul = document.createElement("ul");
  const li_name = document.createElement("li");
  li_name.innerText = "BUS";
  const li_line = document.createElement("li");
  li_line.innerText = "FRA";
  const li_direction = document.createElement("li");
  li_direction.innerText = "TIL";
  const li_time = document.createElement("li");
  li_time.innerText = "AFGANG";
  ul.append(li_name, li_line, li_direction, li_time);
  container.append(ul);

  if (sliced_data.length) {
    sliced_data.map((value, index) => {
      const ul = document.createElement("ul");

      const li_name = document.createElement("li");
      li_name.innerText = value.line;

      const li_stop = document.createElement("li");
      li_stop.innerText = value.stop.replace(/\([^)]*\)/g, "").toUpperCase();

      const li_direction = document.createElement("li");
      li_direction.innerText = value.direction
        .replace(/\([^)]*\)/g, "")
        .toUpperCase();

      const li_time = document.createElement("li");
      li_time.innerText = calcRemainingTime(`${value.date} ${value.time}`);

      ul.append(li_name, li_stop, li_direction, li_time);
      container.append(ul);
    });
  }

  setTimeout(() => busPlan(busdata), 30000);
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
