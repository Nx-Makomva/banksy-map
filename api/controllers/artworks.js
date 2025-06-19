const Artwork = require("../models/artwork");

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

// updateById
// deleteById

async function getById(req, res) {
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


async function getAll(req, res) {
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

const ArtworksController = {
  create: create,
  getById: getById,
  getAll: getAll
};

module.exports = ArtworksController;