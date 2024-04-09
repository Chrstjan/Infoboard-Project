// //GLOBALS
// const activityContainer = document.getElementById("activityContainer");

// // Fetch data initially
// getActivityData();

// // Fetch data every 30 minutes
// setInterval(getActivityData, 30 * 60 * 1000); // Repeat every 30 minutes

// // Function to fetch data every day at 7:00 AM
// function fetchDailyDataAtSeven() {
//   // Calculate the time until the next 7:00 AM
//   const currentTime = new Date();
//   const nextNewDay = new Date(currentTime);
//   nextNewDay.setHours(7, 0, 0, 0); // Sets the fetch time to 7:00 am
//   let timeUntilNextDay = nextNewDay.getTime() - currentTime.getTime();
//   if (timeUntilNextDay < 0) {
//     timeUntilNextDay += 24 * 60 * 60 * 1000; // If the current time is after 7:00 AM, set the next fetch time to 7:00 AM the next day
//   }

//   // Fetch data after the calculated time until next day
//   setTimeout(() => {
//     getActivityData();
//     // Call setInterval again to repeat the process every 24 hours
//     setInterval(getActivityData, 24 * 60 * 60 * 1000); // Repeat every 24 hours
//   }, timeUntilNextDay);
// }

// // Call fetchDailyDataAtSeven to start fetching data every day at 7:00 AM
// fetchDailyDataAtSeven();

// function getActivityData() {
//   const currentTime = new Date(); //"2024-04-09T08:30:00+02:00" this format is used for testing timestamps
//   console.log(currentTime);
//   const nextTwoHours = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

//   let currentHour = currentTime.getHours();
//   let nextHour = nextTwoHours.getHours();

//   // Check if it's past 11 PM (23)
//   if (currentHour === 23) {
//     // Reset currentHour and nextHour for the next day
//     currentHour = 0;
//     nextHour = nextTwoHours.getHours(); // Assigning the correct nextHour

//     // Update the current date to the next day
//     currentTime.setDate(currentTime.getDate() + 1);
//   }

//   fetch("https://iws.itcn.dk/techcollege/schedules?departmentcode=smed")
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("Network connection was not ok");
//       }
//       return res.json();
//     })
//     .then((json) => {
//       recivedActivityData(json, currentHour, nextHour);
//     })
//     .catch((error) => {
//       console.log("Error fetching Activity Data:", error);
//     });
// }

// function recivedActivityData(activity, currentHour, nextHour) {
//   console.log(activity.value);

//   const currentHourActivities = activity.value.filter((activityPlan) => {
//     const activityTime = new Date(activityPlan.StartDate);
//     const activityHour = activityTime.getHours();

//     // Check if activity hour falls within the current two-hour time frame
//     return activityHour >= currentHour && activityHour < nextHour + 1; // Adjusted condition
//   });

//   console.log(currentHourActivities);

//   const formattedActivities = currentHourActivities.map((activity) => {
//     console.log(activity);
//     const dateString = activity.StartDate;
//     const date = new Date(dateString);

//     const hours = date.getHours();
//     const minutes = date.getMinutes();

//     const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

//     activity.StartDate = formattedTime;
//     return activity;
//   });

//   // Clear previous activities before updating the view
//   activityContainer.innerHTML = "";

//   // Update the view with the new activities
//   classScheduleView(formattedActivities);
// }

// function classScheduleView(classActivity) {
//   let activityElements = "";
//   classActivity.forEach((activity) => {
//     activityElements += `
//       <span>
//         <hgroup>
//           <h2>${activity.Room}</h2>
//           <h2>${activity.Team}</h2>
//           <h2>${activity.Subject}</h2>
//           <h2>${activity.StartDate}</h2>
//         </hgroup>
//       </span>`;
//   });

//   activityContainer.innerHTML = activityElements;
// }

/**
 *
 * @param {*} endpoint API URL
 * @returns Array with data objects || data objects
 */

async function myFetchData(endpoint) {
  let response = "";

  try {
    response = await fetch(endpoint);
    console.log(response);
    if (response.ok) {
      const json = await response.json();
      return json;
    }
  } catch (error) {
    console.error(`Error in fetch: ${error}`);
  }
}

activityPlan();

async function activityPlan() {
  const config = await myFetchData("../../config.json");

  const endpoint =
    "https://iws.itcn.dk/techcollege/schedules?departmentcode=smed"; //Change the endpoint variable to the desired endpoint
  let { value: events_data } = await myFetchData(endpoint);

  const endpoint_friendly = "https://api.mediehuset.net/infoboard/subjects";
  const { result: friendly_data } = await myFetchData(endpoint_friendly);

  events_data = events_data.filter((elm) =>
    config.array_valid_educations.includes(elm.Education)
  );

  // console.log(events_data);

  events_data.map((event) => {
    event.Time = new Date(event.StartDate).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    friendly_data.map((word) => {
      if (word.name.toUpperCase() === event.Education.toUpperCase()) {
        event.Education = word.friendly_name;
      }

      if (word.name.toUpperCase() === event.Subject.toUpperCase()) {
        event.Subject = word.friendly_name;
      }
      // console.log(event);
    });

    event.Stamp = new Date(event.StartDate).getTime();
  });

  events_data.sort((a, b) => {
    if (a.StartDate === b.StartDate) {
      return a.Education < b.Education ? -1 : 1;
    } else {
      return a.StartDate < b.StartDate ? -1 : 1;
    }
  });

  // if (config.max_num_activities) {
  //     events_data = events_data.slice(0, config.max_num_activities);
  // }

  let curday_events = [];
  let nextday_events = [];
  const curday = new Date();
  const curday_stamp = curday.getTime();
  const nextday_stamp = curday.setHours(0, 0, 0, 0) + 86400000; // + 86400000;

  curday_events.push(
    ...events_data.filter(
      (elm) => elm.Stamp + 360000 >= curday_stamp && elm.Stamp < nextday_stamp
    )
  );
  nextday_events.push(
    ...events_data.filter((elm) => elm.Stamp >= nextday_stamp)
  );

  if (nextday_events.length) {
    console.log(nextday_events[0].StartDate);
    const nextday_date = new Date(nextday_events[0].StartDate);
    curday_events.push({ Day: nextday_date });
    curday_events.push(...nextday_events);
  }

  console.log(curday_events);

  let acc_html = `
        <table>
            <tr>
                <th>KL</th>
                <th>Uddannelse</th>
                <th>Hold</th>
                <th>Fag</th>
                <th>Lokale</th>
            </tr>`;

  curday_events.map((event) => {
    console.log(event);
    acc_html += event.Day
      ? `
                <tr>
                    <td colspan="5">${event.Day}</td>
                </tr>`
      : `
            <tr>
               <td>${event.Time}</td>
               <td>${event.Education}</td>
               <td>${event.Team}</td>
               <td>${event.Subject}</td>
               <td>${event.Room}</td>
            </tr>
            `;
  });

  acc_html += `</table>`;
  const container = document.getElementById("activity");
  container.innerHTML = acc_html;

  console.log(events_data);
}
