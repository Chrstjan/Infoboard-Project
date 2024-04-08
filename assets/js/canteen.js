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
    for (let i = 0; i < days.length; i++) {
        const foodDay = document.createElement('p');

        foodDay.className = 'foodDay';

        const foodDish = document.createElement('p');

        foodDish.className = 'foodDish';

        const dayTextNode = document.createTextNode(days[i]);
        const dishTextNode = document.createTextNode(dish[i]);
        
        foodDay.appendChild(dayTextNode);
        foodDish.appendChild(dishTextNode);
        
        foodSection.appendChild(foodDay);
        foodSection.appendChild(foodDish);
    }}