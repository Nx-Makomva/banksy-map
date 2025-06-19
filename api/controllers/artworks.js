const { default: mongoose } = require("mongoose");
const Artwork = require("../models/artwork");
const Comment = require("../models/comments");

async function create(req, res) {
  try {
    const { 
      title,
      discoveryYear,
      streetName,
      city,
      location,
      description,
      themeTags,
      photos,
      isAuthenticated } = req.body;

    const artwork = await Artwork.create({
      title,
      discoveryYear,
      streetName,
      city,
      location,
      description,
      themeTags,
      photos,
      isAuthenticated,
      comments: [],
    });

    res.status(201).json({
      artwork,
      message: "Artwork created successfully",
      timestamp: artwork.createdAt 
    }); 
    // ^^ Keep response object wrapped for flexibility so we can add to this
    // without ever breaking the frontend. 

  } catch (error) {
    console.error('Error creating artwork:', error); 
    res.status(400).json({
      error: error.message
    });
  }
};

async function getSingleArtwork(req, res) {
  try {
    const artwork = await Artwork.findById(req.params.id)

    if (!artwork) {
      return res.status(404).json({
        error: 'Artwork not found',
      });
    }

    res.status(200).json({
      artwork,
      message: 'Artwork successfully found'
    })

  } catch (error) {
    console.error('Error retrieving artwork:', error);
    res.status(500).json({
      error: error.message
    });
  }
}

async function getAllArtworks(req, res) {
  // This will return all artworks as a default, IF NO FILTER is present
// Otherwise it will return artworks according to filter
  try {
    const { themeTags, isAuthenticated, lat, lng, sortBy, sortOrder, maxDistance } = req.query;
    const filter = {};
    
    // Building filter object to be used in .find()
    if (themeTags) {
      const tags = Array.isArray(themeTags) ? themeTags : [themeTags];
      // ^^ essentially looking to see if 1 or multiple tags are present 
      filter.themeTags = { $in: tags };
    }
    
    if (isAuthenticated !== undefined) {
      filter.isAuthenticated = isAuthenticated === 'true';
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
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: distance
        }
      };
      query = Artwork.find(filter);
    } else {
      // Regular query - if it's not location based
      query = Artwork.find(filter);
      
      if (sortBy) {
        const order = sortOrder === 'asc' ? 1 : -1;
        query = query.sort({ [sortBy]: order });
      } else {
        // Default sort by creation date (newest first)
        query = query.sort({ createdAt: -1 });
      }
    }
    
    const allArtwork = await query;
    
    res.status(200).json({ 
      allArtwork,
      isGeospatialQuery,
      count: allArtwork.length 
    });
    
  } catch (error) {
    console.error('Error retrieving artwork:', error);
    res.status(500).json({
      error: error.message
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
        omitUndefined: true
      }
  );

  if (!updatedArtwork) {
    return res.status(404).json({ 
      message: 'Artwork not found'
    })
  }

  res.status(200).json({ updatedArtwork })

  } catch (error) {
    console.error('Error updating artwork:', error)
    res.status(400).json({
      error: error.message
    })
  }
}

async function deleteArtwork(req, res) {

  const { id } = req.params.id
  const session = await mongoose.startSession(); 
  // ^^ This allows consistency and sychonicity so if one part of this operation fails then it aborts the delete
  let deletedArtwork;

  try {

    await session.withTransaction(async () => {
      const artworkToDelete = await Artwork.findById(id, null, { session }); 
                                            // ^^ The 2nd param for this method is 'projection' (select which fields to return)
                                            // it's 'null' because we want all fields returned

      if (!artworkToDelete) {
        throw new Error('Artwork not found');
      }

      if (artworkToDelete.comments && artworkToDelete.comments.length > 0) {
        await Comment.deleteMany({_id: { $in: artworkToDelete.comments }}, {session} );
      }

      deletedArtwork = await Artwork.findByIdAndDelete(id, { session });

      console.log('Transaction completed successfully and artwork + comments were deleted');

    });
    
    res.status(200).json({
      message: 'Artwork and associated comments successfully deleted',
      deletedArtwork: deletedArtwork
    })

  } catch (error) {
    console.error('Error deleting artwork. Transaction failed:', error);

    if (error.message === 'Artwork not found') {
      res.status(404).json({
        message: 'Artwork not found'
      })
    } else {
    res.status(500).json({
      error: error.message
    });
    }
  } finally {

    await session.endSession();
  }
}

const ArtworksController = {
  create: create,
  getSingleArtwork: getSingleArtwork,
  getAllArtworks: getAllArtworks,
  updateArtwork: updateArtwork,
  deleteArtwork: deleteArtwork
};

module.exports = ArtworksController;