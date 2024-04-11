fetchCanteenMenu();
// fetchedcanteenData(); //Used for testing outside of the schools network
defineStorage();
function fetchCanteenMenu() {
  const canteenAPI =
    "https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json";

  fetch(canteenAPI)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((canteenData) => {
      // buildCanteenMenu(canteenData);

      // console.log(canteenData.Days)
      // console.log(canteenData.Days.DayName)
      fetchedcanteenData(canteenData);
      // Schedule the next fetch after 24 hours
      setTimeout(fetchCanteenMenu, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    })

    .catch((error) => {
      console.log("Error fetching data:", error);
      // Schedule the next fetch after 24 hours
      setTimeout(fetchCanteenMenu, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    });
}

//This function checks if there already is an data object in local storage if not it creates a new one
function defineStorage() {
  let myCanteenData = localStorage.getItem("myCanteenData");

  if (!myCanteenData) {
    console.log("canteen menu not saved");

    let newCanteenData = {
      canteenMenu: [],
    };

    saveCanteenMenuData(newCanteenData);
  } else {
    let myData = JSON.parse(myCanteenData);
  }
}

//This saves what we pass into the data object in local storage
function saveCanteenMenuData(canteenData) {
  let mySerializedData = JSON.stringify(canteenData);
  localStorage.setItem("myCanteenData", mySerializedData);
}

//This gets our data object from local storage
function getLocalCanteenMenuData() {
  let myCanteenString = localStorage.getItem("myCanteenData");
  let myCanteenData = JSON.parse(myCanteenString);
  return myCanteenData;
}

function fetchedcanteenData(canteenData) {
  //This variable referse to our data object in local storage
  let myCanteenData = getLocalCanteenMenuData();

  //Checks if we get the canteenData from the api
  if (canteenData && canteenData.Days && canteenData.Days.length > 0) {
    //This pushes the array from the api into our data object's array in our local storage
    myCanteenData.canteenMenu = [canteenData.Days];
  } else {
    //If we don't get the canteenData from the api, We use the data object's array in our local storage instead
    canteenData = {
      Days: myCanteenData.canteenMenu[0] || [],
    };
  }

  //This saves what we pushed into our data object's array in our local storage
  saveCanteenMenuData(myCanteenData);

  let days = canteenData.Days.map((DayName) => DayName.DayName);
  let dish = canteenData.Days.map((Dayname) => Dayname.Dish);
  
  let prices = canteenData.Days.map((Dayname) => {
    let dishPriceStr = Dayname.Dish;
    let strRegex = /kr\.\s(\d+,\d+)/;
    let newPrice = dishPriceStr.match(strRegex);
    if (newPrice) {
      return newPrice[1];
    } else {
      return ""; // Return empty string if no price found
    }
  });

  let cleanDish = dish.map((dishText) => {
    // console.log(dishText);
    let cleanDishText = dishText.replace(/(.+?)\s-\s.*$/, '$1');
    // console.log(cleanDishText);
    return cleanDishText;
  });

  // console.log(cleanDish);

  // createCanteenMenu(days, dishes, prices);
  createCanteenMenu(days, cleanDish, prices);
}

function createCanteenMenu(days, dish, prices) {
  const foodSection = document.getElementById("canteen");
  const today = new Date().getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

  const canteenTitle = document.createElement('h2');
  canteenTitle.className = 'canteenTitle';
  canteenTitle.textContent = "Ugens Menu";
  foodSection.parentNode.insertBefore(canteenTitle, foodSection);

  for (let i = 0; i < days.length; i++) {
    //Container for weekday and dish price
    const canteenContainer = document.createElement("div");
    const foodPriceContainer = document.createElement("div");
    // foodPriceContainer.classList.add("foodDayPriceContainer");
    const foodDay = document.createElement("p");
    foodDay.id = "foodDay";
    const foodDish = document.createElement("p");
    foodDish.id = "foodDish";
    const foodPrice = document.createElement("span");
    foodPrice.className = "foodPrice";

    // Adjust the index to match the day numbering in your days array
    const dayIndex = today === 0 ? 7 : today; // Adjust Sunday (0) to 7

    // Apply a specific class to underline today's food
    if (i === dayIndex - 1) {
      foodDay.className = "foodDay today"; // Add class 'today' to foodDay
      // foodDish.className = 'foodDish today'; // Add class 'today' to foodDish
    } else {
      foodDay.className = "foodDay";
      foodDish.className = "foodDish";
    }

    const dayTextNode = document.createTextNode(days[i] + " - kr. " +  prices[i]);
    const dishTextNode = document.createTextNode(dish[i]);
    // const priceTextNode = document.createTextNode(prices[i]);

    foodDay.appendChild(dayTextNode);
    foodDish.appendChild(dishTextNode);
    // foodPrice.appendChild(priceTextNode);

    if (i < dayIndex - 1) {
      foodDay.classList.add("passed"); // Add class 'passed' to foodDay
      foodDish.classList.add("passed"); // Add class 'passed' to foodDish
    }

    //Container for weekday and dish price
    foodPriceContainer.appendChild(foodDay);
    // foodPriceContainer.appendChild(foodPrice);

    // canteenContainer.appendChild(foodPriceContainer);
    // canteenContainer.appendChild(foodPrice);

    foodSection.appendChild(foodDay);
    foodSection.appendChild(foodDish);
    // foodSection.appendChild(foodPrice);
  }
}
