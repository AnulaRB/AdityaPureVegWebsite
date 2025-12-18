let sentences = ["New location, Same Unbeatable Flavors!", "Taste the Tradition of Pune!", "11 Years of Pure Vegetarian Delight!"]

const cursor = document.querySelector("#cursor"); 
const animatedSpan = document.querySelector("#animated"); 

document.addEventListener("DOMContentLoaded", animation);

function animation() {
    // Start the cursor blinking indefinitely (keeps the cursor effect active)
    setInterval(blinkerFunction, 500); 
    // Start typing the first sentence
    addCharacters();
}

let characterCounter = 0;
// We only want the first sentence
const sentenceToDisplay = sentences[0]; 

function addCharacters() {
    // If we haven't reached the end of the first sentence
    if (characterCounter < sentenceToDisplay.length) { 
        animatedSpan.textContent += sentenceToDisplay[characterCounter];
        characterCounter++;
        // Continue typing
        setTimeout(addCharacters, 100); 
    } else {
        // Animation is complete. The function stops here and does not restart or delete the text.
    }
}

// This function keeps the cursor blinking after the text is finished
function blinkerFunction() {
    cursor.classList.toggle("hidden");
}