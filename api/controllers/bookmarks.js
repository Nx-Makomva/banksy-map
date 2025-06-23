const User = require("../models/user");
const Artwork = require("../models/artwork");

async function addBookmark(req, res) {
    try {
        const user_id = req.params.userId;
        const { artwork_id } = req.body;

        const user = await User.findById(user_id);
        if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
        }

        const artwork = await Artwork.findById(artwork_id);
        if (!artwork) {
        return res.status(404).json({
            message: "Artwork not found",
        });
        }

        const alreadyBookmarked = user.bookmarkedArtworks.includes(artwork_id);
        if (alreadyBookmarked) {
        return res.status(400).json({
            message: "Artwork already bookmarked",
        });
        }

        user.bookmarkedArtworks.push(artwork_id);
        await user.save();

        res.status(201).json({
        message: "Bookmark added successfully",
        bookmarkedArtworks: user.bookmarkedArtworks,
        });
    } catch (error) {
        console.error("Error adding bookmark", error);
        res.status(500).json({
        error: error.message,
        });
    }
}

    async function removeBookmark(req, res) {
    try {
        const user_id = req.params.userId;
        const artwork_id = req.params.artworkId;

        const user = await User.findById(user_id);
        if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
        }

        user.bookmarkedArtworks = user.bookmarkedArtworks.filter(
        (id) => id.toString() !== artwork_id
        );
        await user.save();

        res.status(200).json({
        message: "Bookmark removed successfully",
        bookmarkedArtworks: user.bookmarkedArtworks,
        });
    } catch (error) {
        console.error("Error removing bookmark", error);
        res.status(500).json({
        error: error.message,
        });
    }
}

    async function getAllUserBookmarks(req, res) {
    try {
        const user_id = req.params.userId;

        const user = await User.findById(user_id)
        .populate("bookmarkedArtworks", "title photos location description")
        .select("bookmarkedArtworks");

        if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
        }

        res.status(200).json({
        bookmarks: user.bookmarkedArtworks,
        count: user.bookmarkedArtworks.length,
        });
    } catch (error) {
        console.error("Error retrieving bookmarks", error);
        res.status(500).json({
        error: error.message,
        });
    }
}

const BookmarksController = {
    addBookmark: addBookmark,
    removeBookmark: removeBookmark,
    getAllUserBookmarks: getAllUserBookmarks,
};

module.exports = BookmarksController;