const User = require("../models/user");
const Artwork = require("../models/artwork");

async function addBookmark(req, res) {
    try {
        const user_id = req.user_id;
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
        res.status(500).json({
        error: error.message,
        });
    }
}

    async function removeBookmark(req, res) {
    try {

        const user_id = req.user_id;
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
        res.status(500).json({
        error: error.message,
        });
    }
}

const BookmarksController = {
    addBookmark: addBookmark,
    removeBookmark: removeBookmark,
};

module.exports = BookmarksController;