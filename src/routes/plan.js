const express = require("express")

const router = express.Router()
const { planWithSubscriptions } = require("../controllers/plan")

router.route("/breakdown").get(planWithSubscriptions)

module.exports = router
