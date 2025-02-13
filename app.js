// Firebase Configuration (Replace with your actual Firebase config)
const firebaseConfig = {
    databaseURL: "https://board-game-score-data-default-rtdb.firebaseio.com/"
};

// Fetch initial score from Firebase
async function fetchScore() {
    try {
        const response = await fetch(firebaseConfig.databaseURL + "scores.json");
        const data = await response.json();
        document.getElementById("score").textContent = data.score || 0;
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
        document.getElementById("score").textContent = newScore; // Update UI
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

// Fetch initial score when page loads
fetchScore();
