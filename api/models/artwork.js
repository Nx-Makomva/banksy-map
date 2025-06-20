const mongoose = require("mongoose");

const ArtworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discoveryYear: { type: String, required: true },
  streetName: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    }, // This formatting works really nice with mongodb geospatial queries and will be easier to use if we implement routes
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coordinates) {
          // order matters -> [longitude, latitude]
          return (
            coordinates.length === 2 && // Validation check runs automatically when creating new artwork
            coordinates[0] >= -180 && coordinates[0] <= 180 && 
            coordinates[1] >= -90 && coordinates[1] <= 90
          );
        },
        message:
          "Coordinates must be [longitude, latitude]. Must be a number within [ -180 to 180 & -90 to 90 ]",
      },
    },
  },
  description: { type: String, required: true },
  themeTags: { type: [String], required: true },
  photos: { type: [String], required: true }, // May need adjusting dependng on how we're handling images
  isAuthenticated: { type: Boolean, required: true },
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now }, // Adding timestamp incase we want to filter by date created
});

ArtworkSchema.index({ location: "2dsphere" });
// ^^ This part tells mongodb that the location.coordinates field are real earth locations, not just numbers.
// Helps speed up queries on a sphere and lets use use operators like $near, $geoWithin, $geoIntersects

// NOTE ON LOCATION COORDINATES:
// MongoDB expects the order to be in longitude, latitude but Google is opposite
// You will need to reverse the order on the frontend before posting a new artwork object
// e.g. const [lng, lat] = artwork.location.coordinates;
// const marker = new google.maps.Marker({
//   position: { lat: lat, lng: lng }, // Convert back for Google's sake
//   map: map,
//   title: artwork.title
// });

const Artwork = mongoose.model("Artwork", ArtworkSchema);

module.exports = Artwork;
