const app = document.getElementById("app");
const busContainer = document.getElementById("busDeparture");

getBusdata();

setInterval(getBusdata, 60000);


function getBusdata() {
    const apiUrl = "https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1";
    fetch(apiUrl)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Error fetching bus data");
            }
            return res.json();
        })
        .then((json) => {
            console.log(json);
            recivedBusdata(json);
        })
        .catch((error) => {
            console.log("Error", error);
        });
}

function recivedBusdata(busData) {
    const busDeparture = busData.MultiDepartureBoard.Departure;
    console.log(busDeparture);

    busDeparture.forEach((departure) => {
        departure.stop = departure.stop.replace(/\([^)]*\)/g, '');

        const currentTime = new Date();
        const departureTime = new Date(departure.date + " " + departure.time);
        const timeDifference = Math.floor((departureTime - currentTime) / 60000); // Difference in minutes

        if (timeDifference > 0) {
            let timeString = '';
            const hours = Math.floor(timeDifference / 60);
            const minutes = timeDifference % 60;

            if (hours > 0) {
                timeString += `${hours} time${hours > 1 ? 'r' : ''} `;
            }
            timeString += `${minutes} minut${minutes > 1 ? 'ter' : ''}`;

            departure.timeString = timeString; // Store timeString in departure object
        }
    });

    // Filter out departures without timeString
    const filteredDepartures = busDeparture.filter(departure => departure.timeString !== undefined);

    //Only send the first five bus departures
    const firstFiveDepartures = filteredDepartures.splice(0, 5);

    buildBusDeparture(firstFiveDepartures); // Send the filtered departures to buildBusDeparture
}


function buildBusDeparture(busArray) {
    // Clear previous content of busContainer
    busContainer.innerHTML = '';

    const currentTime = new Date();
    let busContainerElement = '';

    busArray.forEach((departure) => {
        const departureTime = new Date(departure.date + " " + departure.time);
        const timeDifference = Math.floor((departureTime - currentTime) / 60000); // Difference in minutes

        if (timeDifference > 0) {
            let timeString = '';
            const hours = Math.floor(timeDifference / 60);
            const minutes = timeDifference % 60;

            if (hours > 0) {
                timeString += `${hours} time${hours > 1 ? 'r' : ''} `;
            }
            timeString += `${minutes} minut${minutes > 1 ? 'ter' : ''}`;

            busContainerElement += `
                <span>
                    <header>
                        <hgroup>
                            <h3>Linje: ${departure.line}</h3>
                            <h3>Stop: ${departure.stop}</h3>
                            <h3>Afgang: ${timeString}</h3>
                        </hgroup>
                    </header>
                </span>`; 
        }
    });

    // Append constructed HTML to busContainer
    busContainer.innerHTML = busContainerElement;

    // Assuming app is the parent container where busContainer should be appended
    app.appendChild(busContainer);
}