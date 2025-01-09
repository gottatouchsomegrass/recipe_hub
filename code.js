// Load recipes on page load
window.addEventListener("DOMContentLoaded", fetchRecipes, { once: true });

// Spoonacular API Configuration
const API_KEY = "5d25b30c3cb8413cbfd10d06a27ef9ad";
const API_URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=9`;

// Container to display recipes
const recipeContainer = document.getElementById("recipe-container");

// Smooth scroll to sections
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: "smooth" });
}

// Fetch and display recipes
async function fetchRecipes() {
  window.removeEventListener("DOMContentLoaded", fetchRecipes);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();
    console.log(data.recipes);
    displayRecipes(data.recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipeContainer.className = `grid grid-cols-1 gap-6 mx-8 place-content-center`;
    recipeContainer.innerHTML = `
      <p class="text-red-500 text-center ">Failed to load recipes. Please try again later.</p>`;
  }
}

// Display recipes in the container
function displayRecipes(recipes) {
  recipeContainer.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");

    recipeCard.className =
      "m-4 overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-med hover:shadow-xl";

    recipeCard.innerHTML = `
      <div class"w-full h-46 object-cover shadow-med overflow-hidden">
        <img src="${recipe.image}" alt="${
      recipe.title
    }" class="w-full h-46 object-cover hover:scale-105 transition-transform shadow-med" />
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold">${recipe.title}</h3>
        <p class="text-gray-600 mt-2">
          ${
            recipe.summary
              ? recipe.summary.replace(/<[^>]*>?/gm, "").slice(0, 100)
              : "A tasty recipe!"
          }...
        </p>
        <a href= "${recipe.sourceUrl}" target="_blank"
           class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block">
          View Recipe
        </a>
      </div>`;
    recipeContainer.appendChild(recipeCard);
  });
}

const searchbutton = document.getElementById("search-button");
const searchinput = document.getElementById("user-input");
searchbutton.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchRecipes();
});

async function searchRecipes() {
  const searchInput = searchinput.value.trim();
  if (searchInput === "") {
    alert("Please enter a search term...");
    return;
  }
  const searchURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchInput}&addRecipeInformation=true&number=9`;
  console.log(searchURL);
  try {
    const response = await fetch(searchURL);

    searchbutton.disabled = true;
    if (!response.ok) {
      throw new Error("Failed to fetch the desired recipes...");
    }

    const data = await response.json();
    console.log(data.results);
    const heading = document.getElementById("heading");
    heading.textContent = "Searched Results";
    displayRecipes(data.results);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch the desired recipes...");
  } finally {
    searchbutton.disabled = false;
  }
}
