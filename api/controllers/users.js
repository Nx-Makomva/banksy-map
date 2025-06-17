const User = require("../models/user");
const bcrypt = require('bcrypt')
const saltRounds = 10;

//for user context
async function getCurrentUser (req, res) {
    res.json({ 
    id: req.user_id
    });
}

// CREATE USER
async function create(req, res) {
    try {
    const email = req.body.email;
    const password = req.body.password;

    const hash = await bcrypt.hash(password, saltRounds);

    const user = new User({ email, password: hash });
    await user.save();
    console.log("User created, id:", user._id.toString());
    res.status(201).json({ message: "OK" });
    } catch(err) {
        console.error(err);
        res.status(400).json({ message: "Something went wrong" });
    };
}



const UsersController = {
    getCurrentUser: getCurrentUser,
    create: create,
};

module.exports = UsersController;