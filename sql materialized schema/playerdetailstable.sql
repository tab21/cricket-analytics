CREATE TABLE `cricket_data`.`PlayerDetails` (
    PlayerName VARCHAR(100) NOT NULL, 
    image_path VARCHAR(255),
    dateofbirth DATE, 
    gender CHAR(1),
    country_name VARCHAR(100),
    country_image_path VARCHAR(255), 
    battingstyle VARCHAR(100), 
    bowlingstyle VARCHAR(100), 
    position VARCHAR(50) 
);
