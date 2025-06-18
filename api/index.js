// docs: https://github.com/motdotla/dotenv#%EF%B8%8F-usage
require("dotenv").config();

const app = require("./app.js");
const { connectToDatabase } = require("./db/db.js");

// const Artwork = require("./models/artwork.js"); 
// ^^^ adjust path for different model tests ^^^

function listenForRequests() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("Now listening on port", port);
  });
}

/// START OF TEST DB INSERT ///

// async function testInsert() {
//   try {
//     const newArtwork = new Artwork({
//       title: 'Test Graffiti',
//       discoveryYear: '2025',
//       streetName: 'Fake Street',
//       city: 'London',
//       location: { type: 'Point', coordinates: [-0.1276, 51.5074] }, 
//       description: 'This is a test artwork',
//       themeTags: ['test', 'graffiti'],
//       photos: ['photo1.jpg'],
//       isAuthenticated: true,
//       comments: []
//     });

//     await newArtwork.save();
//     console.log('Test artwork inserted, MongoDB should now show the DB.');
//   } catch (err) {
//     console.error('Something broke:', err);
//   }
// }

/// END OF TEST DB INSERT ///

connectToDatabase()
  .then(() => {
    console.log("DB connected, starting app...");
    listenForRequests();
    // return testInsert(); // TEST LINE TO BE REMOVED 
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });