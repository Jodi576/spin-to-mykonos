import {
    createWheel,
    slices
} from "../components/wheel/wheel.js";

// -----------------------------
// Create the Wheel
// -----------------------------

const wheel = document.getElementById("wheel");
wheel.innerHTML = createWheel();

// -----------------------------
// Game Data
// -----------------------------
function createTerritory(name) {

    return {

        name,

        passport: {
            M: false,
            Y: false,
            K: false,
            O1: false,
            N: false,
            O2: false,
            S: false
        }

    };

}

const territories = [
    createTerritory("Reston, VA"),
    createTerritory("Johnstown, PA"),
    createTerritory("Cumberland, MD"),
    createTerritory("Rockville, MD"),
    createTerritory("PGH South, PA"),
    createTerritory("Marietta, OH"),
    createTerritory("PGH North, PA"),
    createTerritory("Morgantown, WV"),
    createTerritory("Frederick, MD")
];

// -----------------------------
// Current Spinner
// -----------------------------

let currentTerritory = null;
let currentRotation = 0;

// -----------------------------
// Sounds
// -----------------------------

const clickSound = new Audio("assets/sounds/click-sound.mp3");
const winnerSound = new Audio("assets/sounds/winner.mp3");

clickSound.preload = "auto";
winnerSound.preload = "auto";

function playWheelClicks() {

    const delays = [
        40, 40, 40, 40,
        45, 45, 50, 50,
        60, 70, 80,
        100, 120,
        150, 180,
        220, 270,
        330, 400,
        500
    ];

    let elapsed = 0;

    delays.forEach(delay => {

        elapsed += delay;

        setTimeout(() => {

            const click = clickSound.cloneNode();
            click.play();

        }, elapsed);

    });

}

// -----------------------------
// Build Passport Scoreboard
// -----------------------------

const scoreboard = document.getElementById("passportScoreboard");

territories.forEach((territory) => {

    const row = document.createElement("div");

    row.className = "territory-row";

    row.textContent = territory.name;

 row.addEventListener("click", () => {

    // Remove highlight from all rows
    document.querySelectorAll(".territory-row").forEach(r => {
        r.classList.remove("selected");
    });

    // Highlight the clicked row
    row.classList.add("selected");

    currentTerritory = territory;

    document.getElementById("currentTerritory").textContent =
        territory.name;

});

    scoreboard.appendChild(row);

});

renderScoreboard();
// -----------------------------
// Spin Button
// -----------------------------

const spinButton = document.getElementById("spinButton");

spinButton.addEventListener("click", () => {

    if (!currentTerritory) {

        const panel = document.getElementById("currentTerritory");

        panel.textContent = "⚠️ Please Select a Territory";

        setTimeout(() => {

            if (!currentTerritory) {
                panel.textContent = "Select a Territory";
            }

        }, 2000);

        return;
    }

    spinButton.disabled = true;

    playWheelClicks();

 // Pick a random slice
const randomIndex = Math.floor(Math.random() * slices.length);

const letter = slices[randomIndex];

// Spin the wheel
const wheelSvg = document.getElementById("wheelSvg");

const degreesPerSlice = 360 / slices.length;

// Random extra rotations (5–7 full spins)
const extraSpins = 5 + Math.floor(Math.random() * 3);

// Center the selected slice under the pointer
const targetAngle =
    (randomIndex * degreesPerSlice) +
    (degreesPerSlice / 2);

const currentAngle = currentRotation % 360;

const adjustment =
    (360 - currentAngle + targetAngle) % 360;

const spinRotation =
    (extraSpins * 360) + adjustment;

currentRotation += spinRotation;

wheelSvg.style.transform = `rotate(-${currentRotation}deg)`;

// Wait until animation finishes before awarding the letter
setTimeout(() => {

    awardLetter(currentTerritory, letter);

    renderScoreboard();

    checkForWinner();

// Clear current selection after the spin
currentTerritory = null;

document.getElementById("currentTerritory").textContent =
    "Select a Territory";

document
    .querySelectorAll(".territory-row")
    .forEach(row => row.classList.remove("selected"));

spinButton.disabled = false;

}, 4000);

});
// -----------------------------
// Award Letter
// -----------------------------

function awardLetter(territory, letter) {

    switch (letter) {

        case "M":
            territory.passport.M = true;
            break;

        case "Y":
            territory.passport.Y = true;
            break;

        case "K":
            territory.passport.K = true;
            break;

        case "N":
            territory.passport.N = true;
            break;

        case "S":
            territory.passport.S = true;
            break;

        case "O":

            if (!territory.passport.O1) {

                territory.passport.O1 = true;

            } else if (!territory.passport.O2) {

                territory.passport.O2 = true;

            }

            break;

    }

}
// -----------------------------
// Render Scoreboard
// -----------------------------

function renderScoreboard() {

    scoreboard.innerHTML = "";

    territories.forEach((territory) => {

        const row = document.createElement("div");

        row.className = "territory-row";

        if (territory === currentTerritory) {
            row.classList.add("selected");
        }

        const passport =
            `${territory.passport.M ? "M" : "_"} ` +
            `${territory.passport.Y ? "Y" : "_"} ` +
            `${territory.passport.K ? "K" : "_"} ` +
            `${territory.passport.O1 ? "O" : "_"} ` +
            `${territory.passport.N ? "N" : "_"} ` +
            `${territory.passport.O2 ? "O" : "_"} ` +
            `${territory.passport.S ? "S" : "_"}`;

        row.innerHTML = `
            <div>
                <strong>${territory.name}</strong><br>
                ${passport}
            </div>
        `;

        row.addEventListener("click", () => {

            document
                .querySelectorAll(".territory-row")
                .forEach(r => r.classList.remove("selected"));

            currentTerritory = territory;

            document.getElementById("currentTerritory").textContent =
                territory.name;

            renderScoreboard();

        });

        scoreboard.appendChild(row);

    });

}
// -----------------------------
// Winner
// -----------------------------

function checkForWinner() {

    if (

        currentTerritory.passport.M &&
        currentTerritory.passport.Y &&
        currentTerritory.passport.K &&
        currentTerritory.passport.O1 &&
        currentTerritory.passport.N &&
        currentTerritory.passport.O2 &&
        currentTerritory.passport.S

    ) {

        const modal = document.getElementById("winnerModal");

        document.getElementById("winnerName").textContent =
            currentTerritory.name;

        winnerSound.currentTime = 0;
        winnerSound.play();

        modal.classList.remove("hidden");

    }

}

// -----------------------------
// Close Winner Modal
// -----------------------------

document
    .getElementById("closeWinner")
    .addEventListener("click", () => {

        document
            .getElementById("winnerModal")
            .classList.add("hidden");

    });

    // -----------------------------
// New Game
// -----------------------------

document
    .getElementById("newGame")
    .addEventListener("click", () => {

        territories.forEach((territory) => {

            territory.passport = {

                M: false,
                Y: false,
                K: false,
                O1: false,
                N: false,
                O2: false,
                S: false

            };

        });

        currentTerritory = null;

        document.getElementById("currentTerritory").textContent =
            "Select a Territory";

        document
            .querySelectorAll(".territory-row")
            .forEach(row => row.classList.remove("selected"));

        document
            .getElementById("winnerModal")
            .classList.add("hidden");

        renderScoreboard();

    });