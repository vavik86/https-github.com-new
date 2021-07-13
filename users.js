const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  phoneNumber: String,
  firstName: String,
  lastName: String,
  picURL: String,
});

module.exports.userSchema = userSchema;

let User = mongoose.model("User", userSchema);

// User.init(); // when we need to create a new index

module.exports.getAll = (req, res) => {
  let filter = {};
  if (req.body.search) {
    let regExp = new regExp(req.body.search, "i");
    filter = { $or: [{ firstName: regExp }, { lastName: regExp }] };
  }
  User.find()
    .then((result) => res.json(result))
};

module.exports.getById = (req, res) => {
  getUserById(req.params.id, res);
};
module.exports.getLoggedUserByCookie = (req, res) => {
  getUserById('60e45624cb38804ddcc1546b', res)
};

const getUserById = (userId, res) => {
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).send(`404: user #${userId} wasn't found`);
      }
    })
    .catch((err) => {
      res.status(500).send("Ilegal parameter");
    });
};

module.exports.createNew = (req, res) => {
  let user = new User({
    userName: req.body.userName,
    phoneNumber: req.body.phoneNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    picURL: req.body.picURL,
  });
  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Internal server error: ${err}`);
    });
};

module.exports.update = (req, res) => {
  User.findById(req.params.id).then((user) => {
    if (user) {
      user.userName = req.body.userName;
      user.phoneNumber = req.body.phoneNumber;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.picURL = req.body.picURL;

      user.save()
        .then((user) => {
          if (user) {
            res.json(user);
          }
        })
        .catch((err) => {
          res.status(500).send(`internal server error: ${err}`);
        });
    } else {
      res
        .status(400)
        .send(`404: user #${req.params.id} wasn't found and cannot be updated`);
    }
  });
};

module.exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res
          .status(404)
          .send(
            `404: user #${req.params.id} wasn't found and cannot be deleted`
          );
      }
    })
    .catch((err) => {
      res.status(500).send(`internal server error: ${err}`);
    });
};
