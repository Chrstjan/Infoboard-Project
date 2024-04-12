/**
 *
 * @param {*} endpoint API URL
 * @returns Array with data objects || data objects
 */

async function myFetchData(endpoint) {
  let response = "";

  try {
    response = await fetch(endpoint);
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
  const config = await myFetchData(
    "https://chrstjan.github.io/Infoboard-Project/assets/js/config.json"
  );

  const endpoint =
    "https://iws.itcn.dk/techcollege/schedules?departmentcode=smed"; //Change the endpoint variable to the desired endpoint
  let { value: events_data } = await myFetchData(endpoint);

  const endpoint_friendly = "https://api.mediehuset.net/infoboard/subjects";
  const { result: friendly_data } = await myFetchData(endpoint_friendly);

  events_data = events_data.filter((elm) =>
    config.array_valid_educations.includes(elm.Education)
  );

  console.log(events_data);

  events_data.map((eventData) => {
    let mainString = eventData.Team;
    let classList = "";
    console.log(eventData.Team);

    //Adding different classes to the each educations
    switch (true) {
      case mainString.includes("we"):
        // console.log("Webudvikler");
        classList = "Webudvikler";
        break;
      case mainString.includes("mg"):
        // console.log("MedieGrafiker");
        classList = "MedieGrafiker";
        break;
      case mainString.includes("gr"):
        // console.log("Grafisk Tekniker");
        classList = "GrafiskTekniker";
        break;
      case mainString.includes("gm"):
        // console.log("AmuUddanelse");
        classList = "AmuUddanelse";
        break;
      default:
        // Default case if none of the conditions are met
        break;
    }

    eventData.classList = classList;
  });

  console.log(friendly_data);

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
  //   events_data = events_data.slice(0, config.max_num_activities);
  // }

  let curday_events = [];
  let nextday_events = [];
  const curday = new Date();
  const curday_stamp = curday.getTime();
  const nextday_stamp = curday.setHours(0, 0, 0, 0) + 86400000; // + 86400000;

  curday_events.push(
    ...events_data.filter(
      (elm) => elm.Stamp + 3600000 >= curday_stamp && elm.Stamp < nextday_stamp
    )
  );

  nextday_events.push(
    ...events_data.filter((elm) => elm.Stamp >= nextday_stamp)
  );

  if (nextday_events.length) {
    // console.log(nextday_events[0].StartDate);
    const nextday_date = new Date(nextday_events[0].StartDate);
    const options = { weekday: "long", day: "numeric", month: "long" }; // Define options for formatting the date
    const formattedDate = nextday_date.toLocaleDateString("da", options);
    //Sorting the activities for the next day away
    curday_events.push({ Day: formattedDate });
    curday_events.push(...nextday_events);
  }

  // console.log(curday_events);

  // Makes sure that activity calender doesn't show more than 16 items at once /PO
  curday_events = curday_events.slice(0, 16);

  let acc_html = `
        <div id="activity-container">
          <div id="activity-info">
              <h2>Kl.</h2>
              <h2>Uddannelse</h2>
              <h2>Hold</h2>
              <h2>Fag</h2>
              <h2>Lokale</h2>
          </div>`;

  if (curday_events.length === 0) {
    acc_html += `
    <header>
      <h2 class="no-activities" colspan="5">Der er ikke flere aktiviteter at vise for idag.</td>
    </header>
  `;
  } else {
    curday_events.map((event) => {
      // console.log(event);
      acc_html += event.Day
        ? `
                <header>
                    <h2 class="event-day" colspan="5">${event.Day}</td>
                </header>`
        : `
            <header class="activity-rooms ${event.classList}">
               <h2>${event.Time}</h2>
               <h2>${event.Education}</h2>
               <h2>${event.Team}</h2>
               <h2>${event.Subject}</h2>
               <h2>${event.Room}</h2>
            </header>
            `;
    });
  }

  acc_html += `</div>`;
  const container = document.getElementById("activity");
  container.innerHTML = acc_html;

  // console.log(events_data);
}
