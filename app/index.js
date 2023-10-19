const express = require("express");
require("dotenv").config();

// Modules
const connectDB = require("../database");
// routes
const mockData = require("../routes/generate-mock-data");
const generateCSV = require("../routes/generate-csv");

// Initialization
const app = express();
const base_uri = "/api/v1";
// Database
connectDB();
app.use(express.json());

// =>Routes
app.get("/", (req, res) => {
  res.json("Hello from the server side");
});

app.use(`${base_uri}/data`, mockData);
app.use(`${base_uri}/generate`, generateCSV);

app.listen(process.env.PORT, () =>
  console.log(`App running on port: ${process.env.PORT}`)
);
