const { Router } = require("express");
const { queryMessages } = require("../controllers/messageController.cjs");
const messagesRouter = Router();

messagesRouter.post("/:uid/query-messages", async (req, res) => {
  const otherUid = req.params.uid;
  const messages = await queryMessages({
    username: req.session.username,
    uid: req.session.uid,
    otherUid,
  });
  // sends the first messages array got
  // cause it can only be one
  res.json({ messages: messages ? messages[0].messages : null });
});

module.exports = messagesRouter;
