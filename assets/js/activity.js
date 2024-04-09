//GLOBALS
const activityContainer = document.getElementById("activityContainer");

// Fetch data initially
getActivityData();

// Fetch data every 30 minutes
setInterval(getActivityData, 30 * 60 * 1000); // Repeat every 30 minutes

// Function to fetch data every day at 7:00 AM
function fetchDailyDataAtSeven() {
  // Calculate the time until the next 7:00 AM
  const currentTime = new Date();
  const nextNewDay = new Date(currentTime);
  nextNewDay.setHours(7, 0, 0, 0); // Sets the fetch time to 7:00 am
  let timeUntilNextDay = nextNewDay.getTime() - currentTime.getTime();
  if (timeUntilNextDay < 0) {
    timeUntilNextDay += 24 * 60 * 60 * 1000; // If the current time is after 7:00 AM, set the next fetch time to 7:00 AM the next day
  }

  // Fetch data after the calculated time until next day
  setTimeout(() => {
    getActivityData();
    // Call setInterval again to repeat the process every 24 hours
    setInterval(getActivityData, 24 * 60 * 60 * 1000); // Repeat every 24 hours
  }, timeUntilNextDay);
}

// Call fetchDailyDataAtSeven to start fetching data every day at 7:00 AM
fetchDailyDataAtSeven();

function getActivityData() {
  const currentTime = new Date(); //"2024-04-09T08:30:00+02:00" this format is used for testing timestamps
  console.log(currentTime);
  const nextTwoHours = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

  let currentHour = currentTime.getHours();
  let nextHour = nextTwoHours.getHours();

  // Check if it's past 11 PM (23)
  if (currentHour === 23) {
    // Reset currentHour and nextHour for the next day
    currentHour = 0;
    nextHour = nextTwoHours.getHours(); // Assigning the correct nextHour

    // Update the current date to the next day
    currentTime.setDate(currentTime.getDate() + 1);
  }

  fetch("https://iws.itcn.dk/techcollege/schedules?departmentcode=smed")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network connection was not ok");
      }
      return res.json();
    })
    .then((json) => {
      recivedActivityData(json, currentHour, nextHour);
    })
    .catch((error) => {
      console.log("Error fetching Activity Data:", error);
    });
}

function recivedActivityData(activity, currentHour, nextHour) {
  console.log(activity.value);

  const currentHourActivities = activity.value.filter((activityPlan) => {
    const activityTime = new Date(activityPlan.StartDate);
    const activityHour = activityTime.getHours();

    // Check if activity hour falls within the current two-hour time frame
    return activityHour >= currentHour && activityHour < nextHour + 1; // Adjusted condition
  });

  console.log(currentHourActivities);

  const formattedActivities = currentHourActivities.map((activity) => {
    console.log(activity);
    const dateString = activity.StartDate;
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

    activity.StartDate = formattedTime;
    return activity;
  });

  // Clear previous activities before updating the view
  activityContainer.innerHTML = "";

  // Update the view with the new activities
  classScheduleView(formattedActivities);
}

function classScheduleView(classActivity) {
  let activityElements = "";
  classActivity.forEach((activity) => {
    activityElements += `
      <span>
        <hgroup>
          <h2>${activity.Room}</h2>
          <h2>${activity.Team}</h2>
          <h2>${activity.Subject}</h2>
          <h2>${activity.StartDate}</h2>
        </hgroup>
      </span>`;
  });

  activityContainer.innerHTML = activityElements;
}
