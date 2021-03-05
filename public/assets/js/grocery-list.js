// Add Event listner

// VS code automatically added the below line?
// const { get } = require("../../../routes/html-routes");


// variables that grab elements from the DOM so we can use/manipulate what happens with ingredient inputs
// const ingredientInput = document.getElementByID('ingredient-name');
// const groceryList = document.querySelector('');

// Create new ingredient to add to the List
const createIngredientRow = (obj) => {
    const listItem = createNewItemElement(obj.name);

    // Append listItem to groceriesToBuy
    groceriesToBuy.appendChild(listItem);
    bindItemEvents(listItem, itemBought);
}

const insertIngredient = (ingredientData) => {
    return fetch('/api/grocery-list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredientData),
    })
        //.then(getIngredients)
        .catch((err) => console.error(err));
}

// Get all the ingredients
const getIngredients = () => {
    fetch('/api/grocery-list/items', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())
        .then((data) => {
            const addRows = [];
            for (let i = 0; i < data.length; i++) {
                addRows.push(createIngredientRow(data[i]));
            }
            //    renderIngredientsList(addRows);
            //    ingredientInput.value = ''; 
        })
        .catch((error) => console.error('Error:', error))
};

// Handle delete ingredient button
const handleDeleteIngredientButton = (e) => {
    const { id } = e.target.parentElement.parentElement;
    fetch(`/api/grocery-list/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },

    }).then(getIngredients);
}
// Get list of ingredients
getIngredients();

const placeIngredient = (ingredientData) => {
    fetch('/api/grocery-list/:id', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(placeIngredient)
        .catch((err) => console.error(err));
};


// What to buy + What's in my fridge functionality
const itemInput = document.getElementById("new-item"); // Add a new item
const addButton = document.getElementsByTagName("button")[0]; // First button
const groceriesToBuy = document.getElementById("groceries"); // ul of #groceries
const whatsInTheFridge = document.getElementById("in-fridge"); // in-fridge
const postRecipe = document.getElementById("postRecipe");


// New task list item
const createNewItemElement = function (taskString) {

    const listItem = document.createElement("li");
    // input (checkbox)
    const checkBox = document.createElement("input");
    // label
    const label = document.createElement("label");
    // input (text)
    const editInput = document.createElement("input");
    // nutrition button
    const nutritionFacts = document.createElement("button");
    // button.edit
    const editButton = document.createElement("button");
    // button.delete
    const deleteButton = document.createElement("button");

    label.innerText = taskString;

    // Each elements, needs appending
    checkBox.type = "checkbox";
    editInput.type = "text";
    nutritionFacts.innerText = "Nutrition";
    nutritionFacts.className = "nutrition";
    editButton.innerText = "Edit"; // innerText encodes special characters, HTML does not.
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";

    // and appending.
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(nutritionFacts);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    return listItem;
}

const addItem = function () {
    console.log("Add item...");
    insertIngredient({
        name: itemInput.value,
        inFridge: false
    }).then(() => {
        // Create a new list item with the text from the #new-item:
        const listItem = createNewItemElement(itemInput.value);

        // Append listItem to groceriesToBuy
        groceriesToBuy.appendChild(listItem);
        bindItemEvents(listItem, itemBought);

        itemInput.value = "";
    })
}

// Edit an existing item
const editItem = function () {
    console.log("Edit item...");
    console.log("Change 'edit' to 'save'");

    const listItem = this.parentNode;

    const editInput = listItem.querySelector('input[type=text]');
    const label = listItem.querySelector("label");
    const containsClass = listItem.classList.contains("editMode");
    // If class of the parent is .editmode
    if (containsClass) {

        // switch to .editmode
        // label becomes the inputs value.
        label.innerText = editInput.value;
    } else {
        editInput.value = label.innerText;
    }

    // toggle .editmode on the parent.
    listItem.classList.toggle("editMode");
}

// Delete item
const deleteItem = function () {
    console.log("Delete item...");
    const listItem = this.parentNode;
    const ul = listItem.parentNode;
    // Remove the parent list item from the ul.
    ul.removeChild(listItem);

}

// Mark task completed
const itemBought = function () {
    console.log("Move to fridge...");

    // Append the item to the #in-fridge
    const listItem = this.parentNode;
    whatsInTheFridge.appendChild(listItem);
    bindItemEvents(listItem, backToGroceryList);
}

const backToGroceryList = function () {
    console.log("Move back to groceries to buy...");
    // Item is finished/eaten and needs to be bought again
    // When the checkbox is unchecked, append the item to the #groceries
    const listItem = this.parentNode;
    groceriesToBuy.appendChild(listItem);
    bindItemEvents(listItem, itemBought);
}

// I think this is where we add AJAX calls?
const ajaxRequest = function () {
    console.log("AJAX Request");
}

// The glue to hold it all together.

// Set the click handler to the addItem function.
addButton.addEventListener("click", addItem);
addButton.addEventListener("click", ajaxRequest);

const bindItemEvents = function (taskListItem, checkBoxEventHandler) {
    console.log("bind list item events");
    // Select ListItems children
    const checkBox = taskListItem.querySelector("input[type=checkbox]");
    const editButton = taskListItem.querySelector("button.edit");
    const deleteButton = taskListItem.querySelector("button.delete");
    const nutritionButton = taskListItem.querySelector("button.nutrition");


    // Bind editItem to edit button.
    editButton.onclick = editItem;
    // Bind deleteItem to delete button.
    deleteButton.onclick = deleteItem;
    // Bind itemBought to checkBoxEventHandler.
    checkBox.onchange = checkBoxEventHandler;
    // Bind nutrition button to getIngredientInfo.
    nutritionButton.onclick = getIngredientInfoAjaxCall;
}

// Commented out because I don't know if we need it... (lines 206-218)

//     // Cycle over groceriesToBuy ul list items
//     for (var i=0; i<groceriesToBuy.children.length; i++){

//         //bind events to list items children(itemBought)
//         bindItemEvents(groceriesToBuy.children[i],itemBought);
//     }


//     // Cycle over whatsInTheFridge ul list items
//     for (var i=0; i<whatsInTheFridge.children.length; i++) {
//     // Bind events to list items children(backToGroceryList)
//         bindItemEvents(whatsInTheFridge.children[i],backToGroceryList);
// }

// API - search recipe by ingredients
$("#search_submit").on("click", function (event) {
    event.preventDefault();
    lookupRecipe();
});

function createRecipe(recipe) {
    const recipeDiv = document.createElement("div");
    recipeDiv.innerText = recipe.title;

    const image = document.createElement("img");
    image.src = recipe.image;    

    recipeDiv.appendChild(image);
    return recipeDiv;
};

function lookupRecipe() {
    var ingredients = $("#search").val();
    apiKey = 'c760c8d7cdcc4e0eb2715fbe02f8774e'
    let searchRecipe = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${apiKey}`
    $.ajax({
        url: searchRecipe,
        method: "GET"
    }).then(function (response) {
        console.log('response for recipe based on ingredients input: ', response);
        for (let i = 0; i < response.length; i++) {
            const recipe = response[i];
            const recipeDiv = createRecipe(recipe);
            postRecipe.appendChild(recipeDiv);
        }
    });
};

// Get specific nutritional information from nutrients array
function extractNutrients(nutrients) {
    let result = '';
    const wantedNutrients = ['Calories', 'Fat', 'Saturated Fat', 'Carbohydrates', 'Net Carbohydrates', 'Sugar', 'Cholesterol', 'Fiber', 'Sodium', 'Protein'];
    for (const nutrient of nutrients) {
        if (wantedNutrients.includes(nutrient.title)) {
            result = result + `${nutrient.title}: ${nutrient.amount}\n`;
        }
    }
    return result;
  };

// API - search ingredients
function getIngredientInfoAjaxCall(event) {

    let ingredient = event.target.parentElement.querySelector("label").innerText;
    apiKey = 'c760c8d7cdcc4e0eb2715fbe02f8774e'
    let searchIngredient = `https://api.spoonacular.com/food/ingredients/search?minProteinPercent=0&maxProteinPercent=100&minFatPercent=0&maxFatPercent=100&minCarbsPercent=0&maxCarbsPercent=100&metaInformation=true&intolerances=dairy&sortDirection=desc&offset=0&number=1&apiKey=${apiKey}&=&query=${ingredient}`
    $.ajax({
        url: searchIngredient,
        method: "GET"
    }).then(function (response) {
        console.log('here is the response for ingredient search based off string: ', response);
        console.log('finding id: ', response.results[0].id);
        let id = response.results[0].id;
        let amount = 1
        let unit = 'piece'
        apiKey = 'c760c8d7cdcc4e0eb2715fbe02f8774e'
        let getIngredientInfo = `https://api.spoonacular.com/food/ingredients/${id}/information?amount=${amount}&unit=${unit}&apiKey=${apiKey}`

        $.ajax({
            url: getIngredientInfo,
            method: "GET"
        }).then(function (response) {
            let nutrients = response.nutrition.nutrients;
            const nutritionInfo = extractNutrients(nutrients);
            alert(`Nutritional Information for ${ingredient}:\n\n${nutritionInfo}`);
        });

    });
};

