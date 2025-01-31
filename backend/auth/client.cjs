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
    await client.close();
  } catch (err) {
    console.error("Failed to connect to database!", err);
  }
};

module.exports = client;
