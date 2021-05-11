if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

// const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/places-mern";
const dbUrl = "mongodb://localhost:27017/places-mern";

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((err) => {
    console.log(`Failed connecting to database: ${err}.`);
  });

const app = express();

// parse req.body(raw - JSON data) to something JS can understand
app.use(express.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serving on port: ${port}.`);
});
