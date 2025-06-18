const User = require("../models/user");
const bcrypt = require('bcrypt')
const saltRounds = 10;

//for user context
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