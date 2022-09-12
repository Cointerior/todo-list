const express = require("express")
const router = express.Router()
const refresh = require("../middleware/refreshToken")

router.route("/")
  .get(refresh)
  

module.exports = router