const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const readline = require("readline");
const { MongoClient } = require("mongodb");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ssyduwwzzeesxvqqovru.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWR1d3d6emVlc3h2cXFvdnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNTAzNjUsImV4cCI6MjA0ODYyNjM2NX0.yAvBe7zmDa-h63vActGYolAboQZbFuKC4EOvbWqI3uM";

const supabase = createClient(supabaseUrl, supabaseKey);

const uri =
  "mongodb+srv://tab21:tab21@cricketstats.7mur1.mongodb.net/?retryWrites=true&w=majority&appName=CricketStats";
const client = new MongoClient(uri);

const dbName = "myDatabase";
const collectionName = "cricket_stats";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let leven;

// Dynamically import 'leven' (ESM module)
(async () => {
  const module = await import("leven");
  leven = module.default;
})();

let playerDataCache = [];

// Load Player Data
const loadPlayerData = async () => {
  let allData = [];
  let page = 0;
  const pageSize = 1000; // Maximum number of rows returned per query

  while (true) {
    const { data, error } = await supabase
      .from("playerdetails")
      .select("*")
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error("Error fetching data:", error);
      break;
    }

    if (data.length === 0) {
      break; // No more data, exit the loop
    }

    allData = [...allData, ...data]; // Append new data to the list
    page++; // Move to the next page
  }

  playerDataCache = allData;
  console.log("Data loaded into memory successfully:", playerDataCache.length);
};

// Load data on startup
loadPlayerData();

// Reload API
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

// Search API
app.get("/search", async (req, res) => {
  const searchQuery = req.query.name;
  console.log("\n\nsearchQuery:", searchQuery);

  const exactMatch = () => {
    for (let player of playerDataCache) {
      // console.log("player.playername:", player.playername.toLowerCase());

      if (player.playername.toLowerCase() === searchQuery.toLowerCase()) {
        return player;
      }
    }
    return null; // Explicit return if no match is found
  };

  const match = exactMatch();
  // console.log("Exact match:", match);

  // Proceed with MongoDB query if an exact match exists
  if (match) {
    try {
      await client.connect();
      console.log("Connected to MongoDB database! Querying:", searchQuery);

      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      // Query MongoDB for player stats
      const mongoPlayerStats = await collection
        .find({ playerName: searchQuery })
        .toArray();

      if (mongoPlayerStats.length > 0) {
        const combinedData = {
          ...match,
          stats: {
            batting: mongoPlayerStats[0].batting,
            bowling: mongoPlayerStats[0].bowling,
          },
        };

        console.log("Combined data: \n", combinedData);
        return res.json({ match: combinedData });
      } else {
        console.log("Exact match found but no MongoDB stats available.");
        return res.json({ match });
      }
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      console.log("Returning partial data (exact match).");
      return res.json({ match }); // Return exact match data if MongoDB fails
    } finally {
      await client.close();
    }
  }

  // Proceed with fuzzy matching if no exact match
  const isSingleWord = searchQuery.split(" ").length === 1;
  const distances = playerDataCache.map((player) => {
    const playerName = player.playername.toLowerCase();
    const [firstName, ...lastNameParts] = playerName.split(" ");
    const lastName = lastNameParts.join(" "); // Handle multi-part last names if any

    let distance;

    if (isSingleWord) {
      // Calculate Levenshtein distance for first name, last name, and full name
      const firstNameDistance = leven(searchQuery, firstName);
      const lastNameDistance = leven(searchQuery, lastName);
      const fullNameDistance = leven(searchQuery, playerName);

      // Use the minimum distance
      distance = Math.min(
        firstNameDistance,
        lastNameDistance,
        fullNameDistance
      );
    } else {
      // For multi-word queries, compare against the full name
      distance = leven(searchQuery, playerName);
    }

    return {
      player: {
        name: player.playername,
        country: player.country_name,
        image: player.image_path,
      },
      distance,
    };
  });

  // Sort distances and get top 5 matches
  const topMatches = distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  res.json({ suggestions: topMatches });
});

// Start Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
