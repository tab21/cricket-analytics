const { MongoClient } = require("mongodb");
const fs = require("fs");

async function run() {
  // TODO:
  // Replace the placeholder connection string below with your
  // Altas cluster specifics. Be sure it includes
  // a valid username and password! Note that in a production environment,
  // you do not want to store your password in plain-text here.
  const uri =
    "mongodb+srv://tab21:tab21@cricketstats.7mur1.mongodb.net/?retryWrites=true&w=majority&appName=CricketStats";

  // The MongoClient is the object that references the connection to our
  // datastore (Atlas, for example)
  const client = new MongoClient(uri);

  // The connect() method does not attempt a connection; instead it instructs
  // the driver to connect using the settings provided when a connection
  // is required.
  await client.connect();

  // Provide the name of the database and collection you want to use.
  // If the database and/or collection do not exist, the driver and Atlas
  // will create them automatically when you first write data.
  const dbName = "myDatabase";
  const collectionName = "cricket_stats";

  // Create references to the database and collection in order to run
  // operations on them.
  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  // Read JSON data from file
  const jsonData = JSON.parse(
    fs.readFileSync("./player_performance_data.json", "utf-8")
  );

  // Convert dictionary to array of documents
  const documents = Object.entries(jsonData).map(([playerName, data]) => ({
    playerName,
    ...data,
  }));

  try {
    // Insert the documents into the MongoDB collection
    const result = await collection.insertMany(documents);

    console.log(
      `Data inserted successfully. Inserted Count: ${result.insertedCount}`
    );
  } catch (error) {
    console.error(
      "Something went wrong trying to insert the new documents:",
      error
    );
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
run().catch(console.dir);
