function updateTimeAndDate() {
    const now = new Date();

    // Update time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}`;
    document.getElementById('currentTime').textContent = currentTimeString;

    // Update date
    const days = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
    const months = ["januar", "februar", "marts", "april", "maj", "juni",
    "juli", "august", "september", "oktober", "november", "december"];
    const dayOfWeek = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    const currentDateString = `${dayOfWeek}, ${date} ${month} ${year}`;
    document.getElementById('currentDate').textContent = currentDateString;

    // Store the current date and time in local storage
    localStorage.setItem('currentTime', currentTimeString);
    localStorage.setItem('currentDate', currentDateString);
  }

  // Retrieve the last stored time and date from local storage
  const lastStoredTime = localStorage.getItem('currentTime');
  const lastStoredDate = localStorage.getItem('currentDate');
  if (lastStoredTime && lastStoredDate) {
    document.getElementById('currentTime').textContent = lastStoredTime;
    document.getElementById('currentDate').textContent = lastStoredDate;
  }

  // Call updateTimeAndDate initially to start updating the time and date immediately
  updateTimeAndDate();

  // Set up a timer to update the time and date every second
  setInterval(updateTimeAndDate, 1000); // Update every second