const { MongoClient, ServerApiVersion } = require("mongodb");
const { config } = require("dotenv");
config();
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const uri =
  "mongodb://" +
  username +
  ":" +
  password +
  "@cluster0-shard-00-00.x6hia.mongodb.net:27017,cluster0-shard-00-01.x6hia.mongodb.net:27017,cluster0-shard-00-02.x6hia.mongodb.net:27017/?ssl=true&replicaSet=atlas-sw0m8q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 60000, // 60 seconds
  socketTimeoutMS: 60000, // 60 seconds
  minPoolSize: 5,
  maxPoolSize: 50,
  maxIdleTimeMS: 30000, // 30 seconds
});

const listDatabases = async (client) => {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
};

const testConnection = async (client) => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    listDatabases(client);
  } catch (err) {
    console.error("Failed to connect to database!", err);
  }
};
listDatabases(client);

// Function to close the MongoClient
const closeClient = async () => {
  console.log("Closing your MongodbClient connection...");
  try {
    if (!!client || !!client.topology || client.topology.isConnected()) {
      await client.close();
      console.log("MongoClient closed");
    } else {
      console.log("MongoClient was not connected");
    }
  } catch (err) {
    console.error("Error closing MongoClient:", err);
  }
};

// Close the client when your application is shutting down
process.on("SIGINT", async () => {
  console.log("SIGINT received");
  await closeClient();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received");
  await closeClient();
  process.exit(0);
});

module.exports = client;
