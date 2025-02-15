const client = require("../auth/client.cjs");
const { config } = require("dotenv");
config();

const db = process.env.DB;

async function handleAddUser(userObj) {
  client
    .db(db)
    .collection("users")
    .insertOne(userObj)
    .then(() => {
      console.log("your account has been successfully created!");
    })
    .catch((err) => {
      console.error("could not create your account", err);
    });
}

async function handleFindUser(param) {
  return await client
    .db(db)
    .collection("users")
    .findOne(param)
    .then((user) => {
      return user;
    })
    .catch((err) => {
      console.error("could not create your account", err);
    });
}

async function handleAddSocket(param) {
  const maxRetries = 5;
  let attempt = 0;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  while (attempt < maxRetries) {
    try {
      if (!client.topology || client.topology.isDestroyed()) {
        await client.connect();
      }
      const socket = await client.db(db).collection("sockets").insertOne(param);
      return socket;
    } catch (err) {
      attempt++;
      console.error(`Attempt ${attempt} failed. Retrying...`, err);
      if (attempt >= maxRetries) {
        console.error("Max retries reached. Failed to connect to MongoDB.");
        throw err;
      }
      await delay(2 ** attempt * 1000); // Exponential backoff
    }
  }
}

async function handleFindSocket(param) {
  const maxRetries = 5;
  let attempt = 0;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  while (attempt < maxRetries) {
    try {
      if (!client.toptlogy || client.topology.isDestroyed()) {
        await client.connect();
      }
      const socket = await client.db(db).collection("sockets").findOne(param);
      return socket;
    } catch (err) {
      attempt++;
      console.error(`Attempt ${attempt} failed. Retrying...`, err);
      if (attempt >= maxRetries) {
        console.error("Max retries reached. Failed to connect to MongoDB.");
        throw err;
      }
      await delay(2 ** attempt * 1000); // Exponential backoff
    }
  }
}

module.exports = {
  handleAddUser,
  handleFindUser,
  handleAddSocket,
  handleFindSocket,
};
