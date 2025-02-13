document.addEventListener('DOMContentLoaded', () => {
    // Load scores and initialize
    fetch('scores.json')
        .then(response => response.json())
        .then(data => initializeApp(data))
        .catch(error => console.error('Error loading scores:', error));

    // Modal handling
    const modal = document.getElementById('scoreModal');
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Form submission
    document.getElementById('scoreForm').addEventListener('submit', handleSubmit);
});

function initializeApp(scoresData) {
    // Populate game tabs and select dropdown
    const gameSelect = document.getElementById('gameSelect');
    Object.keys(scoresData).forEach(game => {
        // Create tab content
        const tabContent = document.getElementById(game);
        if (tabContent) {
            updateScoreTable(game, scoresData[game]);
        }

        // Populate game select dropdown
        const option = document.createElement('option');
        option.value = game;
        option.textContent = game.charAt(0).toUpperCase() + game.slice(1);
        gameSelect.appendChild(option);
    });
}

function openGame(evt, gameName) {
    // Tab switching logic
    const tabContents = document.getElementsByClassName('tab-content');
    const tabLinks = document.getElementsByClassName('tab-link');
    
    Array.from(tabContents).forEach(content => content.classList.remove('active'));
    Array.from(tabLinks).forEach(link => link.classList.remove('active'));
    
    evt.currentTarget.classList.add('active');
    document.getElementById(gameName).classList.add('active');
}

function updateScoreTable(game, sessions) {
    const container = document.getElementById(game);
    container.innerHTML = `
        <h2>${game.charAt(0).toUpperCase() + game.slice(1)} Scores</h2>
        <button onclick="document.getElementById('scoreModal').style.display = 'block'">Submit New Score</button>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Winner</th>
                    <th>KJ</th>
                    <th>Luis</th>
                    <th>Petar</th>
                </tr>
            </thead>
            <tbody>
                ${sessions.map(session => `
                    <tr>
                        <td>${session.date}</td>
                        <td>${session.winner}</td>
                        <td>${session.scores.KJ}</td>
                        <td>${session.scores.Luis}</td>
                        <td>${session.scores.Petar}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newScore = {
        game: document.getElementById('gameSelect').value,
        winner: formData.get('winner'),
        scores: {
            KJ: 0,
            Luis: 0,
            Petar: 0
        }
    };

    // In a real implementation, you would send this data to a server
    // For GitHub Pages, you would need to manually update the JSON file
    alert('Score submitted! (Note: This demo doesnt persist data)');
    document.getElementById('scoreModal').style.display = 'none';
    e.target.reset();
}
