const client = require("../auth/client.cjs");
const { config } = require("dotenv");
config();

const db = process.env.DB;

async function initializeMessages({ username, uid }) {
  await client
    .db(db)
    .collection("messages")
    .insertOne({ username, uid, messages: [] })
    .catch((err) => {
      console.error("error initiating your messages collection", err);
    });
}

async function updateMessages({ username, uid, otherUid, messageObj }) {
  await client
    .db(db)
    .collection("messages")
    .findOne({ username, uid })
    .then(async (data) => {
      if (data) {
        const userMessages = data.messages;
        const selectedMessage = userMessages.filter((message) => {
          return message.uid === otherUid;
        });
        if (selectedMessage.length > 0) {
          userMessages.forEach(async (message) => {
            if (message.uid === otherUid) {
              await client
                .db(db)
                .collection("messages")
                .updateOne(
                  { username, uid, "messages.uid": otherUid },
                  {
                    $push: {
                      "messages.$.messages": messageObj,
                    },
                  }
                )
                .catch((err) => {
                  console.error(
                    "error initiating your messages collection",
                    err
                  );
                });
            }
          });
        } else {
          await client
            .db(db)
            .collection("messages")
            .updateOne(
              { username, uid },
              {
                $push: {
                  messages: {
                    uid: otherUid,
                    messages: [messageObj],
                  },
                },
              }
            )
            .catch((err) => {
              console.error("error initiating your messages collection", err);
            });
        }
      }
    })
    .catch((err) => {
      console.error("error initiating your messages collection", err);
    });
}

async function queryMessages({ username, uid, otherUid }) {
  try {
    const message = await client
      .db(db)
      .collection("messages")
      .findOne(
        {
          username,
          uid,
          messages: {
            $elemMatch: { uid: otherUid },
          },
        },
        {
          projection: {
            username: 1,
            uid: 1,
            "messages.$": 1,
          },
        }
      );
    return message ? message.messages : null;
  } catch (err) {
    console.error("Error querying the messages collection", err);
    throw err; // Re-throw the error after logging it
  }
}

module.exports = { initializeMessages, updateMessages, queryMessages };
