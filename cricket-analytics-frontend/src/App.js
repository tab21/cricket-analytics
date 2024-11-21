import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import axios from "axios";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Format date in a more user-friendly way
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

  return (
    <div>
      <Navbar onSearch={searchPlayer} />
      {playerDetails ? (
        <div>
          <h2>{playerDetails.PlayerName}</h2>
          <img src={playerDetails.image_path} alt={playerDetails.PlayerName} />
          <div>
            <p>Country: {playerDetails.country_name}</p>
            <img
              src={playerDetails.country_image_path}
              alt={playerDetails.country_name}
            />
          </div>
          <p>Gender: {playerDetails.gender}</p>
          <p>DOB: {formatDate(playerDetails.dateofbirth)}</p>
          <p>Batting Style: {playerDetails.battingstyle}</p>
          <p>Bowling Style: {playerDetails.bowlingstyle}</p>
          <p>Position: {playerDetails.position}</p>
        </div>
      ) : suggestions.length > 0 ? (
        <div>
          <h2>Suggestions:</h2>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => searchPlayer(suggestion.player.name)}
            >
              <img src={suggestion.player.image} alt={suggestion.player.name} />
              <p>
                {suggestion.player.name} ({suggestion.player.country})
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Search for a player to see results</p>
      )}
    </div>
  );
};

export default App;
