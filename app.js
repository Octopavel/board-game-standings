// Firebase Configuration (Replace with your actual Firebase config)
const firebaseConfig = {
    databaseURL: "https://board-game-score-data-default-rtdb.firebaseio.com/"
};

// list of games to be kept track of, labels are the code references (json entries)
// names are display names to be shown on the web page
const gameDict = {
    "Ark Nova" : "arkNova",
    "Dune Imperium" : "duneImperium",
    "Squash" : "squash"
}

// Fetch initial score from Firebase
async function fetchScore(tabName) {
    try {
        const response = await fetch(firebaseConfig.databaseURL + tabName + ".json");

        if(!response.ok){
            throw new Error('HTTP error! Status: ${response.status}');
        }
        const data = await response.json();

        // console.log("Tab name: ", tabName);
        // console.log("Fetched data: ", data.KJ.wins);
        document.getElementById("scoreKJ").textContent = data.KJ.wins|| 0;
        document.getElementById("scoreLuis").textContent = data.Luis.wins|| 0;
        document.getElementById("scorePetar").textContent = data.Petar.wins|| 0;

        document.getElementById("gamesPlayedKJ").textContent = data.KJ.gamesPlayed|| 0;
        document.getElementById("gamesPlayedLuis").textContent = data.Luis.gamesPlayed|| 0;
        document.getElementById("gamesPlayedPetar").textContent = data.Petar.gamesPlayed|| 0;
    } catch (error) {
        console.error("Error fetching score:", error);
    }
}

// Submit new score to Firebase
async function submitScore(newScore) {
    try {
        await fetch(firebaseConfig.databaseURL + "scores.json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score: newScore })
        });
        document.getElementById("scoreValue").textContent = newScore; // Update UI
    } catch (error) {
        console.error("Error updating score:", error);
    }
}

// Dialog elements
const dialog = document.getElementById("scoreDialog");
const scoreInput = document.getElementById("scoreInput");

// Open dialog
document.getElementById("submitScoreBtn").addEventListener("click", () => {
    dialog.style.display = "block";
});

// Close dialog
document.getElementById("closeBtn").addEventListener("click", () => {
    dialog.style.display = "none";
});

// Handle submit
document.getElementById("submitBtn").addEventListener("click", async function () {
    const selectedGame = document.getElementById("gameSelect").value; // Get selected game
    const sessionWinsKJ = parseInt(document.getElementById("sessionWinsKJ").value, 10);
    const sessionWinsLuis = parseInt(document.getElementById("sessionWinsLuis").value, 10);
    const sessionWinsPetar = parseInt(document.getElementById("sessionWinsPetar").value, 10);

    // Ensure inputs are valid numbers
    if (isNaN(sessionWinsKJ) || isNaN(sessionWinsLuis) || isNaN(sessionWinsPetar)) {
        alert("Please enter valid numbers for all players.");
        return;
    }

    console.log(`Updating scores for ${selectedGame}: P1=${sessionWinsKJ}, P2=${sessionWinsLuis}, P3=${sessionWinsPetar}`);

    // Prepare the data to be sent to Firebase
    const sessionScores = {
        KJ: sessionWinsKJ,
        Luis: sessionWinsLuis,
        Petar: sessionWinsPetar
    };

    try {
        // Update the session scores for the selected game in Firebase
        await fetch(`https://board-game-score-data-default-rtdb.firebaseio.com/${selectedGame}/sessionScores.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sessionScores)
        });

        console.log("Session scores updated successfully!");

        // Refresh the displayed scores (Optional)
        fetchScore(selectedGame);
    } catch (error) {
        console.error("Error updating session scores:", error);
    }

    // Close the dialog
    document.getElementById("scoreDialog").style.display = "none";
});



// Default active tab
let activeTab = "overall";

// Function to switch between tabs
function switchTab(tabName) {
    activeTab = tabName;
    
    document.getElementById("scoreKJ").textContent = "Loading...";
    document.getElementById("scoreLuis").textContent = "Loading...";
    document.getElementById("scorePetar").textContent = "Loading...";

    document.getElementById("gamesPlayedKJ").textContent = "...";
    document.getElementById("gamesPlayedLuis").textContent = "...";
    document.getElementById("gamesPlayedPetar").textContent = "...";


    fetchScore(tabName);
    
    // Update active tab styling
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add("active");
}

function populateGameDropdown() {
    const gameSelect = document.getElementById("gameSelect");
    gameSelect.innerHTML = ""; // Clear existing options

    Object.keys(gameDict).forEach(displayName => {
        let option = document.createElement("option");
        option.value = gameDict[displayName];
        option.textContent = displayName;
        gameSelect.appendChild(option);
    });
}


// Initialize with default tab
switchTab("overall");
window.onload = populateGameDropdown;

//TODO: add winrate calc
//TODO: add score submission
//TODO: calculate overall at submission
//TODO: add history of submissions