const JIKAN = "https://api.jikan.moe/v4";

//if class, querySelector & .className
//if id, getElementById & idName
//DOM nodes
let grid = document.getElementById("gallery");
let currentCharacters = [];
let currentQuery ="";
let currentPage = 1;
const prevBtn = document.querySelector('[data-action="prev"]');
const nextBtn = document.querySelector(`[data-action="next"]`);
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".btn-close");
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const form = document.getElementById("searchForm");

document.addEventListener("keydown", function(e){
  if(e.key === "Escape" && !modal.classList.contains("hidden")){
    closeModal();
  }
});

//as display of .hidden is set to none within style.css
// one modal, update image and title via tag IDs
function openModal(entry){
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  modalTitle.textContent = entry.name;
  modalImg.src = entry.images.jpg.image_url;
}

function submitForm(event){
    event.preventDefault();
    const formData = new FormData(form);

    currentQuery = formData.get("character");
    currentPage = 1;
    console.log("Query: ", currentQuery);

    /*I need to update my updateGrid function for this sequence to work*/
    updateGrid();
    form.reset();
}

const closeModal = function(){
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}


async function showCharacter(query = "", page = 1, limit = 12) {
  try{
    let url = `${JIKAN}/characters?page=${page}&limit=${limit}`;

    // Add search query parameter if user searched for something
    if (query && query.trim() !== "") {
      url += `&q=${encodeURIComponent(query)}`;
    }
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    console.log(data.data);        // array
    
    if(query == ""){
    console.log(data.data[0]);     // first character object
    console.log(data.data[0].name);
    console.log(data.data[0].images.jpg.image_url);
    }

    return data.data;
  } catch (error){
    console.error(`Error fetching data ${error}`);
    throw error;
  }
}

async function updateGrid(){
  let data = await showCharacter(currentQuery, currentPage, 12);
  currentCharacters = data;
  //clear the container
  grid.innerHTML = "";

  for(const entry of data){
    /* 
    the div is the card, the wrapper
    data should be a card element, not attribute within the div(container/card/wrapper)
    */
      grid.innerHTML += 
      `<div class="card" data-id="${entry.mal_id}">  
        <img src = ${entry.images.jpg.image_url} alt="Picture of ${entry.name}"> 
        <p>Name: ${entry.name}</p>
      </div>`
  }
}

updateGrid();

//use the defined function to update class status upon event
closeModalBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

grid.addEventListener("click", (e)=>{
  /*
  .card, a DOM element, doesn't expose data directly, 
  the HTML attributes within the said DOM element (class = "card") =/= JS object properties
  */

  const selected = e.target.closest(".card");
  if(!selected) return; //safeguard on non-card clicks

  const id = Number(selected.dataset.id);
  const entry = currentCharacters.find(c => c.mal_id === id);

  if (!entry) return;
  openModal(entry);
});

form.addEventListener("submit",submitForm);

prevBtn.addEventListener("click", (e)=>{
  currentPage -=1;
  updateGrid();
})

nextBtn.addEventListener("click", (e)=>{
  currentPage +=1;
  updateGrid();
})
/*
to ensure correct event listening from grid (the gallery)
read and comprehend 
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
*/

/*
(SAMPLE CODE)
showCharacter().then(result=>console.log(`Result: ${result}`))
.catch(error=>console.log(`Error: ${error}`));*/

//amongst the body (application/json) of the response, I need data.images.jpg and data.name
//I will need them in grids, current grid within page.html is
/*<div class = "row">

                <div class = "column">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\ado2.jpg" alt= "imageUnavailable">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\ado2.jpg" alt= "imageUnavailable">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\ado2.jpg" alt= "imageUnavailable">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\ado2.jpg" alt= "imageUnavailable">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\ado2.jpg" alt= "imageUnavailable">
                </div>

                <div class = "column">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\anyapeanuts.jpg" alt= "imageUnavailable">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\anyapeanuts.jpg" alt= "imageUnavailable">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\anyapeanuts.jpg" alt= "imageUnavailable">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\anyapeanuts.jpg" alt= "imageUnavailable">
                    <img src = "C:\Users\james\OneDrive\Desktop\anilogue\images\anyapeanuts.jpg" alt= "imageUnavailable">
                </div>*/

/*
Misc. Notes about DOM Selector & innerHTML
- using getElementbyId & querySelector are utilizing DOM selector, they are DOM nodes and open up...
  innerHTML, src, classList, addEventListener()

- innerHTML can contain "<tag> text variables"

You can do this:
modal.innerHTML = `<h3>${entry.name}</h3>`;


But experienced devs usually do:
modalTitle.textContent = entry.name;
modalImg.src = entry.images.jpg.image_url;

- so that it doesn't accidentally delete close button & event listeners
- you change only what needs to change
- it scales better when modal grows (quotes, links, buttons)

Rule of thumb
One-off render → innerHTML
Interactive component (modal, form, card) → DOM selectors
*/