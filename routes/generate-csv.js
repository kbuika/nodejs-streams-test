const express = require("express");

const router = express.Router();
const { generateCSV } = require("../controllers/generate-csv");

router.route("/csv").get(generateCSV);

module.exports = router;
