const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Mount it with a base path

const usersUnprotectedRouter = require("./routes/usersUnprotected");
const usersProtectedRouter = require("./routes/usersProtected");
// const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");
const tokenChecker = require("./middleware/tokenChecker");
const badgeRoutes = require("./routes/badge");
const artworksRouter = require("./routes/artworks"); // adjust path if needed


const app = express();

app.use(cors());

// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use("/users", express.json(), usersUnprotectedRouter); // Only JSON here
app.use("/users", express.json(), tokenChecker, usersProtectedRouter); // Only JSON here
//app.use("/posts", tokenChecker, postsRouter); // File uploads handled in routes
app.use("/tokens", express.json(), authenticationRouter); // Only JSON here

app.use("/badges", badgeRoutes);
app.use("/artworks", express.json(), artworksRouter);

// 404 Handler
app.use((_req, res) => {
  console.log(_req);
  res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(err.message);
  } else {
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = app;
