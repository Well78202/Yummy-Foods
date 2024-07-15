/// <reference types="../@types/jquery" />

// Loading screen
$(function () {
  hideLoading();
  $(".inner-loading-screen").remove();
});

function showLoading() {
  $(".loading").fadeIn(300, function () {
    $("body").css("overflow", "auto");})
  }

function hideLoading() {
  $(".loading").fadeOut(300, function () {
    $(".loading").remove();
  });
}

// Smooth scroll
$('a[href^="#"]').on("click", function (e) {
  const href = e.target.getAttribute("href");
  const sectionOffset = $(href).offset().top;
  $("body,html").animate({ scrollTop: sectionOffset }, 1000);
});

// Sidebar toggle
$(".side-button").on("click", function () {
  $(".left-side").animate({ width: "toggle", padding: "toggle" }, 1000);
  $(".left-side").css({
      cssText: `display:flex; justify-content: space-between; flex-direction: column;`,
  });
  $(".open-close-icon").toggleClass("fa-x fa-align-justify");
});
function closeSideBar() {
  $(".left-side").animate({ width: "toggle", padding: "toggle" }, 1000);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
}
// Global variables
const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");
let submitBtn;
// Get Meals
async function getMeals() {
  showLoading();
  try {
      const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
      const response = await api.json();
      displayMeals(response.meals || []);
  } catch (error) {
      console.error("Error fetching meals:", error);
      rowData.innerHTML = '<p>Error fetching meals.</p>';
  } finally {
      hideLoading();
  }
}
getMeals();

// Display Meals
function displayMeals(meals) {
  let cartoona = "";
  const limitedMeals = meals.slice(0, 20);

  for (let meal of limitedMeals) {
      cartoona += `
      <div class="col-md-3">
          <div onclick="getMealDetails('${meal.idMeal}'); showLoading();" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
              <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
              <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                  <h3>${meal.strMeal}</h3>
              </div>
          </div>
      </div>`;
  }
  rowData.innerHTML = cartoona;
}

// Show Search Inputs
function showSearchInputs() {
  searchContainer.innerHTML = `
  <div class="row py-4">
      <div class="col-md-6">
          <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`;

  rowData.innerHTML = "";
}

// Search by Name
async function searchByName(term) {
  rowData.innerHTML = ""
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
  response = await response.json()

  response.meals ? displayMeals(response.meals) : displayMeals([])

}

// Search by First Letter
async function searchByFLetter(letter) {
  rowData.innerHTML = "";
  letter = letter || "a"; 
  showLoading();
  try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      const data = await response.json();
      displayMeals(data.meals || []);
  } catch (error) {
      console.error("Error searching meals by first letter:", error);
  } finally {
      hideLoading();
  }
}

// Get Categories
async function getCategories() {
  showLoading();
  searchContainer.innerHTML = "";
  try {
      const api = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
      const response = await api.json();
      displayCategories(response.categories);
  } catch (error) {
      console.error("Error fetching categories:", error);
  } finally {
      hideLoading();
  }
}

// Display Categories
function displayCategories(categories) {
  let catBox = "";
  for (let category of categories) {
      catBox += `
      <div class="col-md-3">
          <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2">
              <img class="w-100" src="${category.strCategoryThumb}" alt="${category.strCategory}">
              <div class="meal-layer position-absolute text-center text-black p-2">
                  <h3>${category.strCategory}</h3>
                  <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
              </div>
          </div>
      </div>`;
  }
  rowData.innerHTML = catBox;
}

// Get Category Meals
async function getCategoryMeals(category) {
  searchContainer.innerHTML = "";
  showLoading();
  try {
      const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      const response = await api.json();
      displayMeals(response.meals || []);
  } catch (error) {
      console.error("Error fetching category meals:", error);
  } finally {
      hideLoading();
  }
}

//getArea
async function getArea() {
  searchContainer.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300)


  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  respone = await respone.json()
  console.log(respone.meals);

  displayArea(respone.meals)
  $(".inner-loading-screen").fadeOut(300)

}
function displayArea(arr) {
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
      cartoona += `
      <div class="col-md-3">
              <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointr text-white">
                      <i class="fa-solid fa-house-laptop fa-4x"></i>
                      <h3>${arr[i].strArea}</h3>
              </div>
      </div>
      `
  }

  rowData.innerHTML = cartoona
}
async function getAreaMeals(area) {
  searchContainer.innerHTML = "";
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  response = await response.json()


  displayMeals(response.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}
//getIngredients
async function getIngredients() {
  searchContainer.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300)
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  respone = await respone.json()
  console.log(respone.meals);

  displayIngredients(respone.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}

//getIngredientsMeals
function displayIngredients(arr) {
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
      cartoona += `
      <div class="col-md-3">
              <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointr text-white">
                      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                      <h3>${arr[i].strIngredient}</h3>
                      <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
              </div>
      </div>
      `
  }

  rowData.innerHTML = cartoona
}
async function getIngredientsMeals(ingredients) {
  searchContainer.innerHTML = "";
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
  response = await response.json()
  displayMeals(response.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}
// Get Meal Details
async function getMealDetails(mealId) {
  searchContainer.innerHTML = "";
  try {
      const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const response = await api.json();

      if (response.meals) {
          displayMealDetails(response.meals[0]);
      } else {
          rowData.innerHTML = '<p>No meal details found.</p>';
      }
  } catch (error) {
      console.error("Error fetching meal details:", error);
  }
}

// Display Meal Details
function displayMealDetails(meal) {
  let ingredients = ``

  for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
          ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
      }
  }

  let tags = meal.strTags?.split(",")
  // let tags = meal.strTags.split(",")
  if (!tags) tags = []

  let tagsStr = ''
  for (let i = 0; i < tags.length; i++) {
      tagsStr += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
  }
  const mealDetails = `
<div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2 class="text-white">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;
  
  rowData.innerHTML = mealDetails;
}

//Contacts
function showContacts() {
  searchContainer.innerHTML = "";
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `
  submitBtn = document.getElementById("submitBtn")


  document.getElementById("nameInput").addEventListener("focus", () => {
      nameInputTouched = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
      emailInputTouched = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
      phoneInputTouched = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
      ageInputTouched = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
      passwordInputTouched = true
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
      repasswordInputTouched = true
  })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
  if (nameInputTouched) {
      if (nameValidation()) {
          document.getElementById("nameAlert").classList.replace("d-block", "d-none")

      } else {
          document.getElementById("nameAlert").classList.replace("d-none", "d-block")

      }
  }
  if (emailInputTouched) {

      if (emailValidation()) {
          document.getElementById("emailAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("emailAlert").classList.replace("d-none", "d-block")

      }
  }

  if (phoneInputTouched) {
      if (phoneValidation()) {
          document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

      }
  }

  if (ageInputTouched) {
      if (ageValidation()) {
          document.getElementById("ageAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("ageAlert").classList.replace("d-none", "d-block")

      }
  }

  if (passwordInputTouched) {
      if (passwordValidation()) {
          document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

      }
  }
  if (repasswordInputTouched) {
      if (repasswordValidation()) {
          document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

      }
  }


  if (nameValidation() &&
      emailValidation() &&
      phoneValidation() &&
      ageValidation() &&
      passwordValidation() &&
      repasswordValidation()) {
      submitBtn.removeAttribute("disabled")
  } else {
      submitBtn.setAttribute("disabled", true)
  }
}

function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}