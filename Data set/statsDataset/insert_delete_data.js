const { MongoClient } = require("mongodb");

async function connectToFriendDB() {
  const uri =
    "mongodb+srv://tab21:tab21@cricketstats.7mur1.mongodb.net/?retryWrites=true&w=majority&appName=CricketStats";

  const client = new MongoClient(uri);
  const dbName = "myDatabase";
  const collectionName = "cricket_stats";

  // // for delete

  // try {
  //   await client.connect();
  //   console.log("Connected to MongoDB database!");

  //   const database = client.db(dbName);
  //   const collection = database.collection(collectionName);
  //   const documents = await collection
  //     .find({ playerName: "Ishan Kishan" })
  //     .toArray();

  //   console.log("deleting documents:", documents[0]);

  //   // Delete the first matching document
  //   const result = await collection.deleteOne(documents[0]);

  //   console.log(`document deleted.`);
  // } catch (err) {
  //   console.error("Error deleting document:", err);
  // } finally {
  //   await client.close();
  // }

  // for insertion

  // try {
  //   await client.connect();
  //   const database = client.db(dbName);
  //   const collection = database.collection(collectionName);

  //   // Define the document to be inserted
  //   const doc = {
  //     playerName: "Ishan Kishan",
  //     batting: [
  //       {
  //         "6s": 2.0,
  //         "4s": 3.0,
  //         runs: 37.0,
  //         sr: 127.58,
  //         matchid: "T20I # 1984",
  //         matchdate: "Jan 3 2023",
  //       },
  //       {
  //         "6s": 0.0,
  //         "4s": 0.0,
  //         runs: 2.0,
  //         sr: 40.0,
  //         matchid: "T20I # 1985",
  //         matchdate: "Jan 5 2023",
  //       },
  //       {
  //         "6s": 0.0,
  //         "4s": 0.0,
  //         runs: 1.0,
  //         sr: 50.0,
  //         matchid: "T20I # 1986",
  //         matchdate: "Jan 7 2023",
  //       },
  //       {
  //         "6s": 1.0,
  //         "4s": 7.0,
  //         runs: null,
  //         sr: 0.0,
  //         matchid: "T20I # 1990",
  //         matchdate: "Jan 27 2023",
  //       },
  //       {
  //         "6s": 2.0,
  //         "4s": 38.0,
  //         runs: null,
  //         sr: 0.0,
  //         matchid: "T20I # 1991",
  //         matchdate: "Jan 29 2023",
  //       },
  //       {
  //         "6s": 0.0,
  //         "4s": 0.0,
  //         runs: 1.0,
  //         sr: 33.33,
  //         matchid: "T20I # 1992",
  //         matchdate: "Feb 1 2023",
  //       },
  //     ],
  //     bowling: [],
  //   };

  //   // Insert the document
  //   const result = await collection.insertOne(doc);

  //   console.log(`document inserted.`);
  // } catch (err) {
  //   console.error("Error inserting document:", err);
  // } finally {
  //   await client.close();
  // }

  // For update
  try {
    await client.connect();
    console.log("Connected to MongoDB database!");

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Define the filter and update

    const filter = { playerName: "Ishan Kishan" };
    const update = {
      $set: {
        "batting.$[match].runs": 50,
      },
    };
    const options = {
      arrayFilters: [
        {
          "match.matchid": "T20I # 1985",
        },
      ],
    };

    // Update the matching document
    const result = await collection.updateOne(filter, update, options);

    console.log(
      `Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s).`
    );
  } catch (err) {
    console.error("Error updating document:", err);
  } finally {
    await client.close();
  }
}

connectToFriendDB();
