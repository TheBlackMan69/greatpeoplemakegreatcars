console.log("this is a message");

var allRecipes = [];
var currentRecipe = null;
var forPeople;
var imageFolder = "imgages/";


document.addEventListener("DOMContentLoaded", function() {
    loadPageSection("RecipeTemplate.html", "#recipeDetail", function() {
        document.querySelector("#calculateButton").addEventListener("click", onClickCalculateIngredient);
        getRecipes();
    });
});

function loadPageSection(url, selector, callback) {
    fetch(url)
        .then(function(response) {
            return response.text();
        })
        .then(function(htmlText) {
            console.log(htmlText);
            document.querySelector(selector).innerHTML = htmlText;
            callback();
        });
}

function getRecipes() {
    console.log("getRecipes function is called");
    fetch("data/recipes.json")
        .then(function(response) {
            console.log("We have read the file.");
            return response.json();
        })
        .then(function(data) {
            console.log("We have converted the data to JSON.");
            playWithJson(data);
            fillSideNavMenu();
            fillRecipeDetail();
        });
}

function limitRecipeDescription(description) {
    let length = 45;
    if (description.length > length) {
        return description.substring(0, length) + "...";

    }
    return description;
}

function fillSideNavMenu() {
    let sideNavUL = document.querySelector("#recipesNav");
    let html = "";

    allRecipes.forEach(function(recipe) {
        html += `<li class ="card recipe-nav-item" target="${recipe.id}" id ="card-${recipe.id}">
                    <img src="images/${recipe.thumb_img}" alt =""class="card-thumb">
                    <div class="card-content">
                        <h2 class="card-title">${recipe.title}</h2>
                        <p class ="card-description">${limitRecipeDescription(recipe.description)}</p>
                    </div>
                    <div class ="card-footer">
                        <small>${recipe.for_people} people</small>
                    </div>
                </li>`;

    });
    sideNavUL.innerHTML = html;

    document.querySelectorAll(".recipe-nav-item").forEach(function(element) {
        element.addEventListener("click", function() {
            onRecipeClick(element);
        });
    });
}

function getRecipesFullImage(recipe) {
    if (recipe.full_img) {
        return imageFolder + recipe.full_img;
    }
    return imageFolder + recipe.thumb_img;

}

function fillRecipeDetail() {
    if (currentRecipe == null) {
        currentRecipe = allRecipes[0];
    }
    let activeRecipe = document.querySelector(".card-active");
    if (activeRecipe) {
        activeRecipe.classList.remove("card-active");
    }
    
    let newActiveRecipe = document.querySelector("#card-" + currentRecipe.id);
    newActiveRecipe.classList.add("card-active");

    document.querySelector("#recipeTitle").innerHTML = `${currentRecipe.title}`;
    document.querySelector("#recipeFullImage").setAttribute("src", getRecipesFullImage(currentRecipe));
    document.querySelector("#recipeDescriptionText").innerHTML = currentRecipe.description;
    document.querySelector("#recipeForPeople").innerHTML = getRecipePeople();
    document.querySelector("#recipeIngredientsList").innerHTML = listRecipeIngredients(currentRecipe);
    document.querySelector("#RecipeInstructionsList").innerHTML = listRecipeInstructions(currentRecipe.instructions);

    
}

function playWithJson(data) {
    console.log("Now we can work with data");
    allRecipes = data.recipes;

    var recipe = allRecipes[0];
    console.log("Title of a recipes:" + recipe.title);
    console.log("Description: " + recipe.description);
    console.log("Number of steps: " + recipe.instructions.length);
    console.log("Ingredients: " + recipe.ingredients.length);

    console.log(recipe.title + " has " + recipe.instructions.length + " steps and " + recipe.ingredients.length + " ingredients");
    console.log(`${recipe.title} has ${recipe.instructions.length} steps and ${recipe.ingredients.length} ingredients `);

    console.log(`Number of recipes: ${allRecipes.length}`);

    for (var rec in allRecipes) {
        console.log(allRecipes[rec].title);
    }

}


function onRecipeClick(recipeCard) {
    forPeople = 0;
    currentRecipe = allRecipes.find(function(rec) {
        return rec.id == recipeCard.getAttribute("target");
    });
    fillRecipeDetail();
}

function getIngredientItem(recipePeopleNumber, ingredient , targetPeople = 0){
        if(targetPeople && targetPeople != 0){
            let calculatedQuantitiy = (ingredient.quantity * targetPeople) / recipePeopleNumber;
            return (calculatedQuantitiy.toFixed(2) + " " + ingredient.unit + " " + ingredient.name);
        }
        return ingredient.quantity + " " + ingredient.unit + " " + ingredient.name;
        
}

function listRecipeIngredients(recipe) {
    let recipeIngredients = recipe.ingredients;
    let recipeForPeople = recipe.for_people;
    
    let html = "";
    recipeIngredients.forEach(function(ingredient){
        html += `<li>${getIngredientItem(recipeForPeople,ingredient,forPeople)}</li>`;
        
    });
    return html;
}
function sortInstructions(instructions){
    instructions.sort(function(a, b){
       let orderA = a.order;
       let orderB = b.order;
       
       if (orderA < orderB) {
           return -1;
       }
       if (orderB< orderA ){
           return 1;
       }
       return 0;
    });
}

function listRecipeInstructions(recipeInstructions){
    let html = "";
    sortInstructions(recipeInstructions);
    recipeInstructions.forEach(function(instruction) {
       html += `<li>${instruction.description}</li>`; 
    });
    return html;
}
 function getRecipePeople(){
     if (forPeople && !isNaN(forPeople) && forPeople > 0){
         return forPeople;
     }
     return currentRecipe.for_people;
 }

function onClickCalculateIngredient (calculate){
    let forPeopleInput= document.querySelector("#forPeopleInput").value;
    if ((forPeopleInput == "") || isNaN(forPeopleInput)|| forPeopleInput == 0){
        alert("Pleas enter a valid number.");
    }
    else {
        forPeople = forPeopleInput;
    }
    
    fillRecipeDetail();
    
    function changeImage() {
        let slika1 = "images/fordgt.jpg";
        let slika2 = "images/quattro.png";
        let img = document.querySelector("#image");
        
        if (img.getAttribute("src") == slika1) {
            img.setAttribute("src", slika2);
        } else {
            img.setAttribute("src", slika1);
        };
    }
}

