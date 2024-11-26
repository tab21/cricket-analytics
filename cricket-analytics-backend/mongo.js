const { MongoClient } = require("mongodb");

const uri = "mongodb://103.25.231.125:27017/IIA";

async function checkConnection() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

checkConnection();
