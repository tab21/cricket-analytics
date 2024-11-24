# This repo contains dataset of the T20 International matches since 2005 to 11th May 2023(the date of updating the readme).

## All the datasets can also be viewed over [kaggle](https://www.kaggle.com/datasets/adityaazad79/all-t20-international-datasets).

### Connect and follow me over [linkedIn](https://www.linkedin.com/in/adityaazad79)

### Follow me over [Kaggle](https://www.kaggle.com/adityaazad79)

## You may use the dataset for your EDA, visualisations, BI projects, Performance analysis, Predictive modeling, Sponsorship and marketing, etc.

# There are three types of datasets in the repo.

1. Batting_PerMatchData_T20*.csv - The dataset contains information about the performance of each batsman in each inning of the match.

2. Bowling_PerMatchData_T20*.csv - The dataset contains information about the performance of each bowler in each inning of the match.

3. Summary_T20*.csv - The dataset contains information every T20 cricket match played since 2005.

#### The datasets have been categorised yearwise and are presnt in their respective yearwise_folders.

#### I have also combined the datasets into a single one for each type of datasets which is present at the home of the repo.

# All the column names and their explanations.
## 1. Dataset : Batting_PerMatchData_T20*.csv

- **match** : This column represents name of the teams playing the match.

- **teamInnings**: This column represents the team batting in the match.

- **battingPos**: This column represents the batting position of the batsman in the innings. The batsman at the top of the order usually has a lower batting position, and the batsman at the bottom of the order has a higher batting position.

- **batsmanName**: This column represents the name of the batsman who is currently batting in the match.

- **runs**: This column represents the number of runs scored by the batsman in the current innings.

- **balls**: This column represents the number of balls faced by the batsman in the current innings.

- **4s**: This column represents the number of boundaries hit by the batsman that have crossed the boundary rope and scored four runs.

- **6s**: This column represents the number of sixes hit by the batsman.

- **SR**: This column represents the batting strike rate of the batsman in the current innings. It is calculated as the number of runs scored by the batsman per 100 balls faced.

- **out/not_out**: This column represents whether the batsman is out or not out. If the batsman is not out at the end of the innings, the value in this column would be "not out" else "out".

- **match_id**: This column represents the unique identifier of the cricket match being played, which may be used to join this table with other tables containing additional information about the match.

## 2. Dataset : Bowling_PerMatchData_T20*.csv

- **match** : This column represents name of the teams playing the match.

- **bowlingTeam**: This column represents the team that is currently bowling in the match.

- **bowlerName**: This column represents the name of the bowler who is currently bowling in the match.

- **overs**: This column represents the number of overs bowled by the bowler in the match. One over consists of six legal deliveries (excluding wides and no-balls).

- **maiden**: This column represents the number of maiden overs bowled by the bowler.

- **runs**: This column represents the total number of runs conceded by the bowler in the match.

- **wickets**: This column represents the total number of wickets taken by the bowler in the match.

- **economy**: This column represents the economy rate of the bowler in the match. It is calculated as the average number of runs conceded per over.

- **0s**: This column represents the number of dot balls bowled by the bowler in the match.

- **4s**: This column represents the number of boundaries hit by the batsman off the bowler that have crossed the boundary rope and scored four runs.

- **6s**: This column represents the number of sixes hit by the batsman off the bowler.

- **wides**: This column represents the number of deliveries that is bowled by the bowler outside the batsman's reach and is judged to be too wide for the batsman to play.

- **noBalls**: This column represents the number of deliveries bowled by the bowler that is illegal for some reason, such as the bowler overstepping the crease, throwing the ball rather than bowling it, or bowling a bouncer that goes above the batsman's head.

- **match_id**: This column represents the unique identifier of the cricket match being played.

## 3. Dataset : Summary_T20*.csv

- **Team 1**: This column represents one of the teams playing in the cricket match.

- **Team 2**: This column represents the other team playing in the cricket match.

- **Winner**: This column represents the winning team of the cricket match. It could be either Team 1 or Team 2.

- **Margin**: This column represents the margin of victory for the winning team. It could be represented in terms of runs, wickets or balls remaining depending on the format of the match.

- **Ground**: This column represents the name of the city of the cricket ground where the match is being played.

- **Match Date**: This column represents the date on which the cricket match is being played.

- **match_id**: This column represents the unique identifier of the cricket match being played, which may be used to join this table with other tables containing additional information about the match.
