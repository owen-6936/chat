const { MongoClient, ServerApiVersion } = require("mongodb");
const { config } = require("dotenv");
config();
const uri =
  "mongodb+srv://" +
  process.env.USER_NAME +
  ":" +
  process.env.PASSWORD +
  "@" +
  process.env.CLUSTER_NAME +
  ".x6hia.mongodb.net/?retryWrites=true&w=majority&appName=" +
  process.env.CLUSTER_NAME.charAt(0).toUpperCase() +
  process.env.CLUSTER_NAME.slice(1);
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
testConnection(client);

module.exports = client;
