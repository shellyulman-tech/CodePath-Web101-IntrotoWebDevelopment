// theme changer.
let themeButton = document.getElementById("theme-button");
const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
}
themeButton.addEventListener("click", toggleDarkMode)

// ---------- Role Dropdown ----------

const button = document.getElementById("roleDropdownBtn");
const menu = document.getElementById("roleContent");
const checkboxes = menu.querySelectorAll("input[type='checkbox']");

// Stores all RSVP submissions
const rsvpList = [];

// Open/close dropdown
button.addEventListener("click", function (e) {
    e.preventDefault();
    menu.style.display = menu.style.display === "block" ? "none" : "block";
});

// Update button text when roles are selected
checkboxes.forEach(box => {
    box.addEventListener("change", () => {

        const selected = [];

        checkboxes.forEach(item => {
            if (item.checked) {
                selected.push(item.value);
            }
        });

        if (selected.length === 0) {
            button.textContent = "Select Roles ▼";
        } else {
            button.textContent = selected.join(", ");
        }
    });
});

// Close dropdown when clicking elsewhere
window.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown")) {
        menu.style.display = "none";
    }
});


// ---------- RSVP Form ----------

const form = document.getElementById("form");
function validateForm(event) {
    console.log("validateForm ran");
    event.preventDefault();

    let containsErrors = false;
    const rsvpInputs = form.elements;
    let roleSelected = false;

    let person = {
        name: document.getElementById("name").value,
        favAuthor: document.getElementById("favAuthor").value,
        location: document.getElementById("location").value,
        attendance: document.getElementById("attendance").value,
        roles: []
    }

    checkboxes.forEach(box => {
        if(box.checked) {
            roleSelected = true;
            person.roles.push(box.value);
        }
    });

    if (!roleSelected) {
        containsErrors = true;
        button.classList.add("error");
    } else {
        button.classList.remove("error");
    }

    for (let i = 0; i < rsvpInputs.length; i++) {
        const input = rsvpInputs[i];
        if (input.type ==="submit" || input.type==="button" || input.type==="checkbox") {
            continue;
        }
        if (input.value.trim().length < 2){
            containsErrors = true;
            input.classList.add("error");
        } else {
            input.classList.remove("error");
        }
    }
    console.log("containsErrors = " + containsErrors);
    if(containsErrors){
        alert("Please complete all missing fields.");
        document.getElementById("confirmation").textContent = "Please complete all missing fields.";
        console.log("Alert should happen here");
    }
    if(!containsErrors){
        addParticipant(person);
        toggleModal(person);
        // Reset dropdown
        checkboxes.forEach(box => box.checked = false);
        button.textContent = "Select Roles";
        
    }

    
}

const addParticipant = (person) => {
    //const name = document.getElementById("name").value;
    //const favAuthor = document.getElementById("favAuthor").value;
    //const location = document.getElementById("location").value;
    //const attendance = document.getElementById("attendance").value;
    const name = person.name;
    const favAuthor = person.favAuthor;
    const location = person.location;
    const attendance = person.attendance;

    // Get selected roles
    const selectedRoles = [];

    checkboxes.forEach(box => {
        if (box.checked) {
            selectedRoles.push(box.value);
        }
    });

    // Add RSVP to the array
    rsvpList.push(person);//({
        //name: name,
        //roles: selectedRoles,
        //favAuthor: favAuthor,
        //location: location,
        //attendance: attendance

    //});

    // Update RSVP display
    updateCount();
    displayRSVPs();

    // Reset form
    form.reset();
}

// ---------- Display Last 5 RSVPs ----------

function displayRSVPs() {

    const list = document.getElementById("rsvpEntries");

    // Clear old display
    list.innerHTML = "";

    // Only keep last 5
    const lastFive = rsvpList.slice(-5);

    lastFive.forEach(person => {

        const p = document.createElement("p");

        let attendanceText;
        if (person.attendance === "first-time") {
          attendanceText = "attending for the first time";
        } else {
          attendanceText = "returning to RomantasyCon";
        }

        p.textContent =
            `${person.name} (${person.roles.join(", ")}) from ${person.location} is ${attendanceText}!`;

        list.appendChild(p);

    });

}

function updateCount() {
    const count = document.getElementById("rsvpCount");
    const total = rsvpList.length;
    if (total === 1) {
        count.textContent = "1 person has RSVP'd to this event!";
    } else {
        count.textContent = `${total} people have RSVP'd to this event!`;
    }
}

//event listener
form.addEventListener("submit", validateForm);

// Step 1: Select all elements with the class 'revealable'.
let revealableContainers = document.querySelectorAll(".revealable");

// Step 2: Write function to reveal elements when they are in view.
const reveal = () => {
    for (let i = 0; i < revealableContainers.length; i++) {
        let current = revealableContainers[i];

        // Get current height of container and window
        let windowHeight = window.innerHeight;
        let topOfRevealableContainer = revealableContainers[i].getBoundingClientRect().top;
        let revealDistance = parseInt(getComputedStyle(current).getPropertyValue('--reveal-distance'), 10);

        // If the container is within range, add the 'active' class to reveal
        if (topOfRevealableContainer < windowHeight - revealDistance) {
            current.classList.add("active");
        }
        // If the container is not within range, hide it by removing the 'active' class
        else { 
            current.classList.remove("active");
        }
    }
}

// Step 3: Whenever the user scrolls, check if any containers should be revealed
window.addEventListener('scroll', reveal);
reveal();

const toggleModal = (person) => {
    let modal = document.getElementById("success-modal"); // TODO
    let modalText = document.getElementById("modal-text");
    const intervalId = setInterval(animateImage, 500);
    // TODO: Update modal display to flex
    modal.style.display = "flex";

    // TODO: Update modal text to personalized message
    modalText.textContent = `Thanks for RSVPing, ${person.name} ! We can't wait to see you at RomantasyCon LA 2027!`;

    // Set modal timeout to 5 seconds
    setTimeout(() => {
        modal.style.display = "none";
        clearInterval(intervalId);
    }, 5000);
}

// TODO: animation variables and animateImage() function
let rotateFactor = 0;
const modalImage = document.getElementById("modal-image");
function animateImage(){
    if(rotateFactor === 0) {
        rotateFactor = -10;
    } else {
        rotateFactor = 0;
    }

    modalImage.style.transform = `rotate(${rotateFactor}deg)`;
}