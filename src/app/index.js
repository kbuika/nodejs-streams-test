const express = require("express")
require("dotenv").config()
// Modules
const connectDB = require("../database")
// routes
const generate = require("../routes/generate-data")
const plan = require("../routes/plan")

// Initialization
const app = express()
const base_uri = "/api/v1"
// Database
connectDB()
app.use(express.json())

// =>Routes
app.get("/", (req, res) => {
  res.json("Hey. the '/api/v1/generate/csv' route generates a csv file with subscriptions that cost $50 dollars or more")
})

app.use(`${base_uri}/generate`, generate)
app.use(`${base_uri}/plans`, plan)

app.listen(process.env.PORT, () => {
  console.log(`App running on port: ${process.env.PORT}`)
})

module.exports = app
