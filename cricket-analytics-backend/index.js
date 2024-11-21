const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "tab21",
  database: "cricket_data",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Function to calculate Levenshtein Distance
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

// API Endpoint for Search
app.get("/search", (req, res) => {
  const searchQuery = req.query.name;

  db.query("SELECT * FROM playerdetails", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }

    // Find exact match
    const exactMatch = results.find(
      (player) => player.PlayerName.toLowerCase() === searchQuery.toLowerCase()
    );

    if (exactMatch) {
      return res.json({ match: exactMatch });
    }

    // Compute Levenshtein distance for all players
    const distances = results.map((player) => ({
      player: {
        name: player.PlayerName,
        country: player.country_name,
        image: player.image_path,
      },
      distance: levenshteinDistance(
        searchQuery.toLowerCase(),
        player.PlayerName.toLowerCase()
      ),
    }));

    // Sort by distance and get the top 5
    const topMatches = distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    res.json({ suggestions: topMatches });
  });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
