const User = require("../models/user");
const Artwork = require("../models/artwork");

function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const user = new User({ email, password, firstName, lastName });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      if (process.env.NODE_ENV !== "test") {
        console.error(err);
      }
      res.status(400).json({ message: "Something went wrong" });
    });
}

async function getById(req,res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving user", error);
    res.status(500).json({ message: "Server error" });
  }  
}

const UsersController = {
  create: create,
  getById: getById,
};

module.exports = UsersController;
