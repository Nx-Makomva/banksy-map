const express = require("express");
const cors = require("cors");

// Mount it with a base path

const usersUnprotectedRouter = require("./routes/usersUnprotected");
const usersProtectedRouter = require("./routes/usersProtected");
const artworksRouter = require("./routes/artworks");
const commentsRouter = require("./routes/comments");
const authenticationRouter = require("./routes/authentication");
const tokenChecker = require("./middleware/tokenChecker");
const artworksRouter = require("./routes/artworks"); // adjust path if needed

const app = express();

app.use(cors());

// Parse JSON request bodies, made available on `req.body`
app.use("/uploads", express.static("uploads"));

// API Routes

app.use("/users", express.json(), usersUnprotectedRouter);
app.use("/users", express.json(), tokenChecker, usersProtectedRouter);
app.use("/artworks", express.json(), artworksRouter); // This has photos on it so create method needs extra middleware
app.use("/comments", express.json(), tokenChecker, commentsRouter);
app.use("/tokens", express.json(), authenticationRouter);


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
