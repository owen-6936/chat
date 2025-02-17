const client = require("../auth/client.cjs");
const { config } = require("dotenv");
config();

const db = process.env.DB;

async function initializeMessages({ username, uid }) {
  client
    .db(db)
    .collection("messages")
    .insertOne({ username, uid, messages: [] })
    .catch((err) => {
      console.error("error initiating your messages collection", err);
    });
}

async function updateMessages({ username, uid, otherUid, newMessage, sender }) {
  client
    .db(db)
    .collection("messages")
    .findOne({ username, uid })
    .then((data) => {
      if (data) {
        const messages = data.messages;
        const selectedMessage = messages.filter((message) => {
          return message.uid === otherUid;
        });
        if (selectedMessage.length > 0) {
          messages.forEach((message) => {
            if (message.uid === otherUid) {
              message.messages.push({ sender, message: newMessage });
            }
          });
        } else {
          messages.push({
            uid: otherUid,
            messages: [{ sender, message: newMessage }],
          });
        }
        client
          .db(db)
          .collection("messages")
          .updateOne({ username, uid }, data)
          .catch((err) => {
            console.error("error initiating your messages collection", err);
          });
      }
    })
    .catch((err) => {
      console.error("error initiating your messages collection", err);
    });
}

module.exports = { initializeMessages, updateMessages };
