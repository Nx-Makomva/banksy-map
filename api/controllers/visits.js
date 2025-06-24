const User = require("../models/user");
const Artwork = require("../models/artwork");

async function addVisit(req, res) {
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

        const alreadyVisited = user.visitedArtworks.includes(artwork_id);
        if (alreadyVisited) {
        return res.status(400).json({
            message: "Artwork already bookmarked",
        });
        }

        user.visitedArtworks.push(artwork_id);
        await user.save();

        res.status(201).json({
        message: "Visit added successfully",
        visitedArtworks: user.visitedArtworks,
        });
    } catch (error) {
        console.error("Error adding visit", error);
        res.status(500).json({
        error: error.message,
        });
    }
}

    async function removeVisit(req, res) {
    try {

        const user_id = req.user_id;
        const artwork_id = req.params.artworkId;

        const user = await User.findById(user_id);
        if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
        }

        user.visitedArtworks = user.visitedArtworks.filter(
        (id) => id.toString() !== artwork_id
        );
        await user.save();

        res.status(200).json({
        message: "Visit removed successfully",
        visitedArtworks: user.visitedArtworks,
        });
    } catch (error) {
        console.error("Error removing visit", error);
        res.status(500).json({
        error: error.message,
        });
    }
}

const VisitsController = {
    addVisit: addVisit,
    removeVisit: removeVisit,
};

module.exports = VisitsController;