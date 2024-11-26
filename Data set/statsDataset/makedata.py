import pandas as pd
import json

# Load the datasets
batting_file = "Batting_PerMatchData_2023.csv"
bowling_file = "Bowling_PerMatchData_2023.csv"
summary_file = "Summary_T20_2023.csv"

# Read CSV files
batting_data = pd.read_csv(batting_file)
bowling_data = pd.read_csv(bowling_file)
summary_data = pd.read_csv(summary_file)

# Rename columns to match what we expect
batting_data = batting_data.rename(columns={"match_id": "MatchID"})
bowling_data = bowling_data.rename(columns={"match_id": "MatchID"})
summary_data = summary_data.rename(
    columns={"match_id": "MatchID", "Match Date": "MatchDate"}
)

# Proceed with the merge after renaming
batting_data = pd.merge(
    batting_data, summary_data[["MatchID", "MatchDate"]], on="MatchID", how="left"
)
bowling_data = pd.merge(
    bowling_data, summary_data[["MatchID", "MatchDate"]], on="MatchID", how="left"
)

# Initialize the final JSON structure
player_data = {}


# Helper function to check for NaN and replace with None
def replace_nan(value):
    return None if pd.isna(value) else value


# Process batting data
for _, row in batting_data.iterrows():
    player_name = row["batsmanName"]
    match_data = {
        "6s": replace_nan(row["6s"]),
        "4s": replace_nan(row["4s"]),
        "runs": replace_nan(row["runs"]),
        "sr": replace_nan(row["SR"]),
        "matchid": replace_nan(row["MatchID"]),
        "matchdate": replace_nan(row["MatchDate"]),
    }
    if player_name not in player_data:
        player_data[player_name] = {"batting": [], "bowling": []}
    player_data[player_name]["batting"].append(match_data)

# Process bowling data
for _, row in bowling_data.iterrows():
    player_name = row["bowlerName"]
    match_data = {
        "overs": replace_nan(row["overs"]),
        "wickets": replace_nan(row["wickets"]),
        "economy": replace_nan(row["economy"]),
        "runs": replace_nan(row["runs"]),
        "matchid": replace_nan(row["MatchID"]),
        "matchdate": replace_nan(row["MatchDate"]),
    }
    if player_name not in player_data:
        player_data[player_name] = {"batting": [], "bowling": []}
    player_data[player_name]["bowling"].append(match_data)

# Convert to JSON
output_json = json.dumps(player_data, indent=4)

# Save to a file
output_file = "player_performance_data.json"
with open(output_file, "w") as f:
    f.write(output_json)

print(f"Data successfully saved to {output_file}")
