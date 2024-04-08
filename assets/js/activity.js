//GLOBALS
const activityContainer = document.getElementById("activityContainer");

// Fetch data initially
getActivityData();

// Fetch data every 30 minutes
setInterval(() => {
  getActivityData();
}, 30 * 60 * 1000);

function getActivityData() {
  const currentTime = new Date();
  const nextTwoHours = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

  const currentHour = currentTime.getHours();
  const nextHour = nextTwoHours.getHours();

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
    return activityHour >= currentHour && activityHour < nextHour;
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
