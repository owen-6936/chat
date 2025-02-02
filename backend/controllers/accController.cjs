const client = require("../auth/client.cjs");
const { config } = require("dotenv");
config();

const db = process.env.DB;

async function handleAddUser(userObj) {
  await client.connect();
  client
    .db(db)
    .collection("users")
    .insertOne(userObj)
    .then(() => {
      console.log("your account has been successfully created!");
    })
    .catch((err) => {
      console.error("could not create your account", err);
    })
    .finally(async () => {
      await client.close();
    });
}

async function handleFindUser(param) {
  await client.connect();
  return await client
    .db(db)
    .collection("users")
    .findOne(param)
    .then((user) => {
      return user;
    })
    .catch((err) => {
      console.error("could not create your account", err);
    })
    .finally(async () => {
      await client.close();
    });
}

module.exports = { handleAddUser, handleFindUser };
