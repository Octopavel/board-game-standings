// Firebase Configuration (Replace with your actual Firebase config)
const firebaseConfig = {
    databaseURL: "https://board-game-score-data-default-rtdb.firebaseio.com/"
};

// Fetch initial score from Firebase
async function fetchScore() {
    try {
        const response = await fetch(firebaseConfig.databaseURL + "scores.json");

        if(!response.ok){
            throw new Error('HTTP error! Status: ${response.status}');
        }

        const data = await response.json();

        // console.log("Fetched data: ", data);
        document.getElementById("scoreValue").textContent = data.score || 0;
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
document.getElementById("submitBtn").addEventListener("click", () => {
    const newScore = parseInt(scoreInput.value, 10);
    if (!isNaN(newScore)) {
        submitScore(newScore);
        dialog.style.display = "none";
    }
});


// Default active tab
let activeTab = "overall";

// Function to switch between tabs
function switchTab(tabName) {
    activeTab = tabName;
    // document.getElementById("scoreValue").textContent = "dummy score";
    fetchScore();
    
    // Update active tab styling
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add("active");
}

// Initialize with default tab
switchTab("overall");