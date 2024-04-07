//GLOBALS
const activityContainer = document.getElementById("activityContainer");

getActivityData();

function getActivityData() {
  fetch("https://iws.itcn.dk/techcollege/schedules?departmentcode=smed")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network connection was not ok");
      }
      return res.json();
    })
    .then((json) => {
      recivedActivityData(json);
    })
    .catch((error) => {
      console.log("Error fetching Activity Data:", error);
    });
}

function recivedActivityData(activity) {
  console.log(activity.value);

  const currentDate = new Date();
  //This gets the current weekday
  const currentDay = (currentDate.getDay() + 6) % 7;

  /*
    only used for testing weekdays 
    0 = monday, 1 = tuesday...
  */
  //   const currentDay = 0;
  console.log(`${currentDate}`);
  console.log(`weekday number ${currentDay}`);

  const currentDayActivities = activity.value.filter((activityPlan) => {
    const dateString = activityPlan.StartDate;
    const activityDate = new Date(dateString);
    const activityDay = activityDate.getDay();
    const adjustedActivityDay = activityDay === 0 ? 6 : activityDay - 1;
    // console.log("Activity Day:", adjustedActivityDay);
    return adjustedActivityDay === currentDay;
  });

  console.log(currentDayActivities);

  const formattedActivities = currentDayActivities.map((activity) => {
    console.log(activity);
    const dateString = activity.StartDate;
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

    // console.log(formattedTime);

    activity.StartDate = formattedTime;
    return activity;
  });
  classScheduleView(formattedActivities);
}

function classScheduleView(classActivity) {
  const activityDivContainer = document.createElement("div");
  activityDivContainer.classList.add("activity-container"); // Corrected the variable name
  let activityElements = ""; // Accumulate HTML string outside the loop
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
  activityDivContainer.innerHTML = activityElements;
  activityContainer.appendChild(activityDivContainer);
}
