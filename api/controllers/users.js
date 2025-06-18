const User = require("../models/user");
const Artwork = require("../models/artwork");
const bcrypt = require('bcrypt')
const saltRounds = 10;

async function getCurrentUser(req, res) {
    // default response if no logged-in user - for use in main page rendering
    const anonymousResponse = { isLoggedIn: false, id: null };

    try {
        if (!req.user_id) {
        return res.json(anonymousResponse);
        }
        
        // Get details of logged in user from db
        const user = await User.findById(req.user_id);
        
        if (user) {
        res.json({
            isLoggedIn: true,
            id: req.user_id,
            // decide what user info we want to return to front end
            email: user.email // placeholder for now
        });
        } else {
        // user_id exists but user not found in db 
        res.json(anonymousResponse);
        }
    } catch (error) {
        console.error('Error getting current user:', error);
        res.json(anonymousResponse);
    }
}
async function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const hash = await bcrypt.hash(password, saltRounds);
  const user = new User({ email, password:hash, firstName, lastName });
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
  getCurrentUser: getCurrentUser,
  create: create,
  getById: getById,
};

module.exports = UsersController;
