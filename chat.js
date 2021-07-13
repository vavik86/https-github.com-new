const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatName: { type: String,  unique: true },
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
});

// module.exports.messageSchema = messageSchema;

let Chats = mongoose.model("Chats", chatSchema);

 //Chats.init(); // when we need to create a new index

module.exports.getAll = (req, res) => {
  let filter = {};
  if (req.query.userid) {
    filter.userIds = req.query.userid;
  }
  Chats.find()
    .populate("userIds", "userName")
    .then((result) => res.json(result));
};

module.exports.getById = (req, res) => {
  Chats.findById(req.params.id)
    .populate("userIds")
    .then((result) => res.json(result));
};

//return all chats from a speccific users
module.exports.getFriends = (req, res) => {
  Chats.find({ userIds: req.params.id })
    .populate("userIds", "userName")
    .then((result) => res.json(result));
};

module.exports.createNew = (req, res) => {
  let chat = new Chats({
    userIds: req.body.userIds,
    chatName: req.body.chatName
  });
  chat
    .save()
    .then((chat) => res.status(201).json(chat))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Internal server error: ${err}`);
    });
};

/*module.exports.update = (req, res) => {
  Chat.findById(req.params.id).then((chat) => {
    if (chat) {
      chat.userIds = req.body.userIds;
      chat.save().then((chat) => {
        if (chat) {
          res.json(chat);
        } else {
          // TODO: investigate error
          res.status(500).send(`internal server error: ${err}`);
        }
      });
    }
  });
};*/

module.exports.delete = (req, res) => {
  Chat.findByIdAndRemove(req.params.id)
    .then((chat) => {
      if (chat) {
        res.json(chat);
      } else {
        res
          .status(404)
          .send(
            `404: chat #${req.params.id} wasn't found and cannot be deleted`
          );
      }
    })
    .catch((err) => {
      // TODO: investigate error
      res.status(500).send(`internal server error: ${err}`);
    });
};