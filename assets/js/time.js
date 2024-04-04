getCurrentTime();

setInterval(getCurrentTime, 10000);

function getCurrentTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    buildCurrentTime(hours, minutes);
}

function buildCurrentTime(hour, minute) {
    let currentTimeElement = `
        <div>
            <span>
                <h2>${hour}</h2>
                <h2>${minute}</h2>
            </span>
        </div>`;

        document.body.innerHTML = currentTimeElement;
}