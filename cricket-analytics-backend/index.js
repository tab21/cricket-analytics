const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const readline = require("readline");
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://tab21:tab21@cricketstats.7mur1.mongodb.net/?retryWrites=true&w=majority&appName=CricketStats";

const client = new MongoClient(uri);
const dbName = "myDatabase";
const collectionName = "cricket_stats";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12746379",
  password: "plkbmDFHQh",
  database: "sql12746379",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

let playerDataCache = [];

const loadPlayerData = () => {
  db.query("SELECT * FROM PlayerDetails", (err, results) => {
    if (err) {
      console.error("Error loading player data:", err);
      return;
    }
    playerDataCache = results;
    console.log("Player data loaded into memory");
  });
};

// Load data on startup
loadPlayerData();

// API Endpoint to Reload Player Data
app.get("/reload", (req, res) => {
  loadPlayerData();
  res.json({ message: "Player data reloaded successfully" });
});

// Console Input for Reloading
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  if (input.trim().toLowerCase() === "reload") {
    console.log("Reloading player data...");
    loadPlayerData();
  }
});

// Function for Levenshtein Distance
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
app.get("/search", async (req, res) => {
  const searchQuery = req.query.name;

  console.log("\n\nsearchQuery:", searchQuery);

  const exactMatch = playerDataCache.find(
    (player) => player.PlayerName.toLowerCase() === searchQuery.toLowerCase()
  );

  if (exactMatch) {
    try {
      await client.connect();
      console.log(
        "Connected to MongoDB database! and querying : ",
        searchQuery
      );

      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      // Query MongoDB for player stats using playerName
      const mongoPlayerStats = await collection
        .find({ playerName: searchQuery })
        .toArray();

      // console.log("\n\nMongoDB player stats:", mongoPlayerStats);

      if (mongoPlayerStats.length > 0) {
        // Combine MySQL data with MongoDB data and return

        const combinedData = {
          ...exactMatch,
          stats: {
            batting: mongoPlayerStats[0].batting,
            bowling: mongoPlayerStats[0].bowling,
          }, // MongoDB player stats
        };

        console.log("Combined data: \n ", combinedData);
        return res.json({ match: combinedData });
      } else {
        console.log("Exact match found: \n ", exactMatch);
        return res.json({ match: exactMatch });
      }
    } catch (error) {
      console.error("Error querying MongoDB:", error);
      res.status(500).json({ error: "Error querying MongoDB" });
    } finally {
      await client.close();
    }
  }

  const distances = playerDataCache.map((player) => ({
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

  const topMatches = distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  res.json({ suggestions: topMatches });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
