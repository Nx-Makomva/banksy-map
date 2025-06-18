const mongoose = require("mongoose");

async function connectToDatabase() {
  const mongoDbUrl = process.env.MONGODB_URL;
  console.log("The url you are connected to is:", mongoDbUrl)


  if (!mongoDbUrl) {
    console.error(
      "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set. See the README for more details."
    );
    throw new Error("No connection string provided");
  }

  await mongoose.connect(mongoDbUrl);

  if (process.env.NODE_ENV !== "test") {
    console.log("Successfully connected to MongoDB");
    console.log("Connected to:", mongoose.connection.name);

  }
}

module.exports = { connectToDatabase };
