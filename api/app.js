const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");



const usersUnprotectedRouter = require("./routes/usersUnprotected");
const usersProtectedRouter = require("./routes/usersProtected");
const artworksRouter = require("./routes/artworks");
const authenticationRouter = require("./routes/authentication");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

app.use(cors());

// Parse JSON request bodies, made available on `req.body`
app.use(express.json());

// API Routes
app.use("/users", usersUnprotectedRouter);
app.use("/users", tokenChecker, usersProtectedRouter); 
app.use("/artworks", artworksRouter);
app.use("/tokens", authenticationRouter); 
app.use('/uploads', express.static('uploads'));

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
