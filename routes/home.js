const express = require("express")
const router = express.Router()


router.get("/", (req, res) => {
  const failureMsg = req.flash("failure")
  const successMsg = req.flash("success")
  res.render("main", { successMsg, success: successMsg.length > 0, failureMsg, failure: failureMsg.length > 0 })
})

module.exports = router