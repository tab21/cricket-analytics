import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css"; // Import the CSS file

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Format date in a user-friendly way
};

const PORT = 8000;

const App = () => {
  const [playerDetails, setPlayerDetails] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const searchPlayer = async (name) => {
    try {
      const response = await axios.get(
        `http://localhost:${PORT}/search?name=${name}`
      );
      if (response.data.match) {
        setPlayerDetails(response.data.match); // Exact match found
        setSuggestions([]);
      } else {
        setSuggestions(response.data.suggestions); // Show top 5 matches
        setPlayerDetails(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getGraphData = (data, key) => {
    const filteredData = data.filter(
      (entry) => entry[key] > 0 || entry[key] !== null
    );

    return {
      labels: filteredData.map((entry) => formatDate(entry.matchdate)),
      datasets: [
        {
          label: key === "sr" ? "Strike Rate" : "Economy",
          data: filteredData.map((entry) => parseFloat(entry[key])),
          fill: false,
          backgroundColor: key === "sr" ? "blue" : "red",
          borderColor: key === "sr" ? "blue" : "red",
        },
      ],
    };
  };

  const getGraphOptions = (type, filteredData) => ({
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const entry = filteredData[index]; // Get the full data entry from filteredData

            if (type === "batting") {
              return [
                `Match Date: ${formatDate(entry.matchdate)}`,
                `Runs: ${entry.runs}`,
                `4s: ${entry["4s"]}`,
                `6s: ${entry["6s"]}`,
                `Strike Rate: ${entry.sr || "N/A"}`,
              ].join("\n");
            }

            if (type === "bowling") {
              return [
                `Match Date: ${formatDate(entry.matchdate)}`,
                `Overs: ${entry.overs}`,
                `Wickets: ${entry.wickets}`,
                `Runs: ${entry.runs}`,
                `Economy: ${entry.economy}`,
              ].join("\n");
            }

            return "";
          },
        },
      },
    },
  });

  return (
    <div className="app-container">
      <Navbar onSearch={searchPlayer} />
      {playerDetails ? (
        <div className="player-details">
          <h2>{playerDetails.playername}</h2>
          <img
            className="player-image"
            src={playerDetails.image_path}
            alt={playerDetails.playername}
          />
          <div className="player-info">
            <p>Country: {playerDetails.country_name}</p>
            <img
              className="country-flag"
              src={playerDetails.country_image_path}
              alt={playerDetails.country_name}
            />
          </div>
          <p>Gender: {playerDetails.gender}</p>
          <p>DOB: {formatDate(playerDetails.dateofbirth)}</p>
          <p>Batting Style: {playerDetails.battingstyle}</p>
          <p>Bowling Style: {playerDetails.bowlingstyle}</p>
          <p>Position: {playerDetails.position || "N/A"}</p>

          {/* Graphs Section */}
          {playerDetails.stats?.batting?.length > 0 && (
            <div className="chart">
              <h3>Batting Performance</h3>
              <Line
                data={getGraphData(playerDetails.stats.batting, "sr")}
                options={getGraphOptions(
                  "batting",
                  playerDetails.stats.batting
                )}
              />
            </div>
          )}
          {playerDetails.stats?.bowling?.length > 0 && (
            <div className="chart">
              <h3>Bowling Performance</h3>
              <Line
                data={getGraphData(playerDetails.stats.bowling, "economy")}
                options={getGraphOptions(
                  "bowling",
                  playerDetails.stats.bowling
                )}
              />
            </div>
          )}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="suggestions-container">
          <h2>Suggestions:</h2>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => searchPlayer(suggestion.player.name)}
            >
              <img
                className="suggestion-image"
                src={suggestion.player.image}
                alt={suggestion.player.name}
              />
              <p>
                {suggestion.player.name} ({suggestion.player.country})
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">Search for a player to see results</p>
      )}
    </div>
  );
};

export default App;
