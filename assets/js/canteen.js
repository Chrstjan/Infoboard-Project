fetchCanteenMenu();

function fetchCanteenMenu() {
    const canteenAPI = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json'

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
        fetchedcanteenData(canteenData)
        // Schedule the next fetch after 24 hours
        setTimeout(fetchCanteenMenu, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        }) 
      
      .catch((error) => {
        console.log("Error fetching data:", error);
        // Schedule the next fetch after 24 hours
        setTimeout(fetchCanteenMenu, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
      });
}

function fetchedcanteenData(canteenData) {
    let days = canteenData.Days.map(DayName => DayName.DayName);
    let dish = canteenData.Days.map(Dayname => Dayname.Dish);
    createCanteenMenu(days, dish);
}

function createCanteenMenu(days, dish) {
  const foodSection = document.getElementById('canteen');
  const today = new Date().getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)

  for (let i = 0; i < days.length; i++) {
      const foodDay = document.createElement('p');
      foodDay.id = "foodDay"
      const foodDish = document.createElement('p');
      foodDish.id = "foodDish"

      // Adjust the index to match the day numbering in your days array
      const dayIndex = (today === 0 ? 7 : today); // Adjust Sunday (0) to 7

      // Apply a specific class to underline today's food
      if (i === dayIndex - 1) {
          foodDay.className = 'foodDay today'; // Add class 'today' to foodDay
          // foodDish.className = 'foodDish today'; // Add class 'today' to foodDish
      } else {
          foodDay.className = 'foodDay';
          foodDish.className = 'foodDish';
      }

      const dayTextNode = document.createTextNode(days[i]);
      const dishTextNode = document.createTextNode(dish[i]);
      
      foodDay.appendChild(dayTextNode);
      foodDish.appendChild(dishTextNode);
      
      foodSection.appendChild(foodDay);
      foodSection.appendChild(foodDish);
  }
}
