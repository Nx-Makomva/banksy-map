const Artwork = require("../models/artwork");
const Comment = require("../models/comments");

async function create(req, res) {
  try {
    const {
      title,
      discoveryYear,
      address,
      locationLat, 
      locationLng, // these coordinates come from the form data as strings
      description,
      themeTags } = req.body;

    const artwork = await Artwork.create({ // This automatically runs validators for location (check schema)
      title,
      discoveryYear,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(locationLng), parseFloat(locationLat)], 
        // The order is then reversed and they're passed in like this for MongoDB. 
        // Mongo expects numbers hence the parse
      },
      description,
      themeTags,
      photos: [req.file?.key],
      isAuthenticated: false,
      comments: [],
    });

    res.status(201).json({
      artwork,
      message: "Artwork created successfully",
      timestamp: artwork.createdAt,
    });
    // ^^ Keep response object wrapped for flexibility so we can add to this
    // without ever breaking the frontend.
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error("Error creating artwork:", error);
  }

    if (error.name === "ValidationError") {
        return res.status(400).json({ 
          error: error.message 
        });
    }

    res.status(500).json({
      error: error.message,
    });
  }
}

async function getSingleArtwork(req, res) {
  try {
    const artwork = await Artwork.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "user_id",
        select: "firstName",
      },
    });

    if (!artwork) {
      return res.status(404).json({
        error: "Artwork not found",
      });
    }

    res.status(200).json({
      artwork,
      message: "Artwork successfully found",
    });
  } catch (error) {
    console.error("Error retrieving artwork:", error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function getAllArtworks(req, res) {
  // This will return all artworks as a default, IF NO FILTER is present
  // Otherwise it will return artworks according to filter
  try {
    const {
      themeTags,
      isAuthenticated,
      lat,
      lng,
      sortBy,
      sortOrder,
      maxDistance,
    } = req.query;

    const filter = {};

    // Building filter object to be used in .find()
    if (themeTags) {
      const tags = Array.isArray(themeTags) ? themeTags : [themeTags];
      // ^^ essentially looking to see if 1 or multiple tags are present
      filter.themeTags = { $in: tags };
    }

    if (isAuthenticated !== undefined) {
      filter.isAuthenticated = isAuthenticated === "true";
    }

    // incase to order results of artworks in order of distance from location
    let query;
    const isGeospatialQuery = lat && lng;

    if (isGeospatialQuery) {
      // - results automatically sorted by distance in mongodb
      const distance = maxDistance ? parseInt(maxDistance) : 1000;
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: distance,
        },
      };
      query = Artwork.find(filter);
    } else {
      // Regular query - if it's not location based
      query = Artwork.find(filter);

      if (sortBy) {
        const order = sortOrder === "asc" ? 1 : -1;
        query = query.sort({ [sortBy]: order });
      } else {
        // Default sort by creation date (newest first)
        query = query.sort({ createdAt: -1 });
      }
    }

    const allArtworks = await query;

    res.status(200).json({
      allArtworks,
      isGeospatialQuery,
      count: allArtworks.length,
    });

  } catch (error) {
    console.error("Error retrieving artwork:", error);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function updateArtwork(req, res) {
  try {
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true, // There's a validation field in artwork schema. Ensures location coords are valid
        omitUndefined: true,
      }
    );

    if (!updatedArtwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    res.status(200).json({
      updatedArtwork,
      message: "Artwork updated successfully",
    });

  } catch (error) {
    console.error("Error updating artwork:", error);
    res.status(400).json({
      error: error.message,
    });
  }
}

async function deleteArtwork(req, res) {
  const id = req.params.id;
  let deletedArtwork;

  try {
    const artworkToDelete = await Artwork.findById(id);

    if (!artworkToDelete) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    // This deletes associated comments if they exist
    if (artworkToDelete.comments && artworkToDelete.comments.length > 0) {
      await Comment.deleteMany({
        _id: { $in: artworkToDelete.comments }
      });
    }

    // Delete the artwork when associated stuff is gone
    deletedArtwork = await Artwork.findByIdAndDelete(id);

    console.log("Artwork and associated comments successfully deleted");

    res.status(200).json({
      message: "Artwork and associated comments successfully deleted",
      deletedArtwork,
    });

  } catch (error) {
    console.error("Error deleting artwork:", error);
    
    res.status(500).json({
      error: error.message,
    });
  }
}

const ArtworksController = {
  create: create,
  getSingleArtwork: getSingleArtwork,
  getAllArtworks: getAllArtworks,
  updateArtwork: updateArtwork,
  deleteArtwork: deleteArtwork,
};

module.exports = ArtworksController;