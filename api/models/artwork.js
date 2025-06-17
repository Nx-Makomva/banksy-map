const mongoose = require("mongoose");

const ArtworkSchema = new mongoose.Schema({
  title: { type:  String, required: true },
  discoveryYear: { type: String , required: true },
  streetName: { type: String , required: true },
  city: { type: String , required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    }, // This formatting works really nice with mongodb geospatial queries and will be easier to use if we implement routes
    coordinates: {
      type: [Number], 
      required: true,
      validate: {
        validator: function(coordinates) { // order matters -> [longitude, latitude]
          return coordinates.length === 2 && 
                coordinates[0] >= -180 && coordinates[0] <= 180 && // Validation check runs automatically when creating new artwork
                coordinates[1] >= -90 && coordinates[1] <= 90;
        },
        message: 'Coordinates must be [longitude, latitude]. Must be a number within [ -180 to 180 & -90 to 90 ]'
      }
    }
  },
  description: { type: String , required: true },
  themeTags: { type: [String] , required: true },
  photos: { type: [String], required: true }, // May need adjusting dependng on how we're handling images
  isAuthenticated: {type: Boolean, required: true },
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }]
});

ArtworkSchema.index({ location: '2dsphere' }); 
// ^^ This part tells mongodb that the location.coordinates field are real earth locations, not just numbers. 
// Helps speed up queries on a sphere and lets use use operators like $near, $geoWithin, $geoIntersects

const Artwork = mongoose.model("Artwork", ArtworkSchema);

module.exports = Artwork;