const express = require("express");

const router = express.Router();
const { generateMockData } = require("../controllers/generate-mock-data");

router.route("/generate-mock-data").post(generateMockData);

module.exports = router;
