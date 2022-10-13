//*********SELECT ITEMS**************
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

//edit options
let editElement;
//making the edit flag false by default until we click the edit button
let editFlag = false;
let editID = "";


//*********EVENT LISTENER************
//Submit form
form.addEventListener('submit', addItem);

//Clear All The Values
clearBtn.addEventListener('click', clearItems);

//Load Items
window.addEventListener('DOMContentLoaded', setupItems);
//Delete each grocery Item
//We are adding the delete btn dynamically hence we do not have a direct access to the delete Button
//We have access to it after adding the item dynamically (below the dynamic addition)
//Set the function after having all the functions

//*********FUNCTIONS*****************
//submit function
function addItem(e) {
  //preventing the default submission of the item to the server
  e.preventDefault();
  //accessing the entered value in the grocery input, can also be inputed when editing
  const value = grocery.value;

  //Empty string: evaluates to  false, Having a String: Evaluates to truthy.
  /*
  if(value){
    console.log("value is truthy");
  }
  else{
    console.log("value is false");
  }
  */

  //Creating a unique ID using millisseconds for each entered value
  const id = new Date().getTime().toString();
  //console.log(id);

  //Setting the Input Conditions
  //If we have a value, we will be editing or not editing
  /*
  if(value !=='' && editFlag === false){
    console.log("add item to the list");
  }
  else if(value !=='' && editFlag === true){
    console.log("editing");
  }
  else{
    console.log("empty value");
  }
  */

  //SHORTENING THE CODE
  if (value && !editFlag) {
    //creating a List Item
    createListItem(id, value);
    //display Alert
    displayAlert("Item Added To The List", "success");
    //Show Container
    container.classList.add("show-container");
    //add to Local Storage
    addToLocalStorage(id, value);
    //Set Back to Defaults
    setBackToDefault();
  }
  else if (value && editFlag) {
    //the edit element value (this value is from the above now submitted value)
    editElement.innerHTML = value;
    displayAlert("Value Edited", "success");
    //edit local storage
    editLocalStorage(editID, value);

    setBackToDefault();
  }
  else {
    displayAlert("Please Enter Value", "danger");
  }



}

//DISPLAYING ALERT FUNCTION
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //Removing the Alert
  //it looks for a callback function and in how long you need to invoke it(millisecond 1s = 1000 milliseconds)
  setTimeout(function () {
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//CLEAR ITEMS FUNCTION
function clearItems() {
  //selecting all the items in the grocery container
  const items = document.querySelectorAll('.grocery-item');

  //checking if the length of the items in the container is greater than 0
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }

  container.classList.remove("show-container");

  //displaying  that the List is Empty
  displayAlert("Empty List", "danger");

  setBackToDefault();

  //Removing items from the Local Storage
  localStorage.removeItem('list');
}

//DELETE GROCERY ITEM FUNCTION
function deleteItem(e) {
  //we need the event object to access the parent container and remove the child from the grocery list
  //We move twice parent Elements to reach the Grocery Item
  const element = e.currentTarget.parentElement.parentElement;
  //console.log(element);
  const id = element.dataset.id;
  //Removing the element from the list
  list.removeChild(element);

  //Hidding the grocery container if there is no item in the list
  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }

  displayAlert("Item Deleted", "danger");
  setBackToDefault();

  //Remove from Local Storage using the Id
  removeFromLocalStorage(id);
}


//EDIT GROCERY ITEM FUNCTION
//This is a two step process
function editItem(e) {
  //this is the element to be edited.
  const element = e.currentTarget.parentElement.parentElement;
  //console.log(element);    

  //set edit item (this is the title to be edited)
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //console.log(editElement);

  //set form value
  grocery.value = editElement.innerHTML;
  //console.log(grocery.value);
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}

//SET BACK TO DEFAULT FUNCTION
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = "Submit";
}




//*********LOCAL STORAGE*************
//Local Storage APIs
//SetItem
//GetItem
//RemoveItem
//Save as strings
function addToLocalStorage(id, value) {
  //setting a grocery object
  const grocery = { id, value };
  //checks if the item is there (if it's there, then parse the item), if it's not, set the item to an empty array
  let items = getLocalStorage();
  //first time it will be an empty array but the second time it will have items in the array.
  //console.log(items);
  //pushing the grocery to the items array
  items.push(grocery);
  //adding the items to the local storage
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  //obtaining the items in the local Storage
  let items = getLocalStorage();

  //filtering through the obtained arrays
  //filtering the values that do not match the ID and only returning them
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  })

  //console.log(items);
  //setting the local storage to the second item
  localStorage.setItem("list", JSON.stringify(items));

}

function editLocalStorage(id, value) {
  //getting the items from the local Storage
  let items = getLocalStorage();
  //changing the value matching the passed Id
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item

  });
  //console.log(items);

  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  //we check for the local storage first if there is an array called list.
  //if its there, we return the whole array
  //if its not there, we return an empty array
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

//*********SETUP ITEMS***************
function setupItems() {
  let items = getLocalStorage();
  console.log(items);
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

//Creating a List Item
function createListItem(id, value) {
  //Because we need to add an ID to the element, we need to create the element first in order to add the ID before addding other items
  //creating an input element incase there is a value in the input
  const element = document.createElement('article');
  //add a class
  element.classList.add('grocery-item');
  //add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  //adding the attribute to the element
  element.setAttributeNode(attr);

  //adding the text content
  element.innerHTML = `<p class="title">${value}</p>
           <div class="button-container">
             <button type="button" class="edit-btn">
               <i class="fas fa-edit"></i>
             </button>
             <button type="button" class="delete-btn">
               <i class="fas fa-trash"></i>
             </button>
           </div>`;

  //Once we have created the element
  //Targeting the delete and edit Button after dynamically adding the grocery items. 
  //Instead of document, we now use element to target the delete icon inside the element.
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');

  //Adding the click events
  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);



  //append child
  list.appendChild(element);

}