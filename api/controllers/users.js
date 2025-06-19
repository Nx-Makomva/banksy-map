const User = require("../models/user");
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
  // get values from input fields
  const { email, password, firstName, lastName } = req.body;

  // check that required fields are in place
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields" });
    }

  // encrypt the password
  const hash = await bcrypt.hash(password, saltRounds);
  const user = new User({ email, password:hash, firstName, lastName });

  // save user and return the id
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
      res.status(500).json({ message: "Something went wrong" });
    });
}

async function getById(req, res) {
  try {
    // get relevant user fields (not returning email and password)
    const user = await User.findById(req.params.id).select(
        "firstName lastName bookmarkedArtworks visitedArtworks badges"
    );
    // handle missing user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving user", error);
    res.status(500).json({ message: "Server error" });
  }  
}

async function addBookmarked(req, res) {
    try {
      //ids come from the params
      const { id, artworkId } = req.params;

      //update user bookmarkedArtworks field with new art id
      const userWithUpdatedBookmarks = await User.findByIdAndUpdate(id,
        { $addToSet: { bookmarkedArtworks: artworkId }},
        { new: true,
      //only return relevant fields
          select: "firstName lastName bookmarkedArtworks"}
      );
      // handle missing user
      if (!userWithUpdatedBookmarks) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Bookmarks added successfully",
      //return updated user
      user: userWithUpdatedBookmarks
    });

    } catch (error) {
      res.status(500).json({
      message: "Error adding new bookmark",
      error: error.message,
    });
    }
}

async function addVisitedArtwork(req, res) {
  try {
    const { id: userId, artworkId } = req.params;

    const userWithUpdatedArtwork = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { visitedArtworks: artworkId } },
      {
        new: true,
        select: "firstName lastName visitedArtworks",
      }
    );

    if (!userWithUpdatedArtwork) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Visited artwork added successfully",
      user: userWithUpdatedArtwork,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating visited artwork",
      error: error.message,
    });
  }
}

async function addBadge(req, res) {
  try {
    const { id: userId, badgeId } = req.params;

    const userWithUpdatedBadges = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { badges: badgeId } },
      {
        new: true,
        select: "firstName lastName badges",
      }
    );

    if (!userWithUpdatedBadges) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Badge added successfully",
      user: userWithUpdatedBadges,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating badge",
      error: error.message,
    });
  }
  }

async function getUserBookmarkedArtworks(req, res) {
  try {
    const user = await User.findById(req.user_id)
      .populate('bookmarkedArtworks')
      .select('bookmarkedArtworks')

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    res.status(200).json({
      bookmarkedArtworks: user.bookmarkedArtworks
    });

  } catch (error) {
    console.error('Error retrieving bookmarked artwork:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

async function getUserVisitedArtworks(req, res) {
  try {
    const user = await User.findById(req.user_id)
      .populate('visitedArtworks')
      .select('visitedArtworks')

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      visitedArtworks: user.visitedArtworks
    });

  } catch (error) {
    console.error('Error retrieving visited artwork:', error);
    res.status(500).json({
      error: error.message
    })
  }
}

const UsersController = {
  getCurrentUser: getCurrentUser,
  create: create,
  getById: getById,
  addBookmarked: addBookmarked,
  addVisitedArtwork: addVisitedArtwork,
  addBadge: addBadge,
  getUserBookmarkedArtworks: getUserBookmarkedArtworks,
  getUserVisitedArtworks: getUserVisitedArtworks
};

module.exports = UsersController;
