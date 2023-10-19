const express = require("express");

const router = express.Router();
const {
  generateCSV,
  generateMockData,
} = require("../controllers/generate-data");

router.route("/mock-data").post(generateMockData);
router.route("/csv").get(generateCSV);

module.exports = router;
