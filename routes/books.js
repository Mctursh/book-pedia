const express = require("express")
const router = express.Router()

const { queryStr } = require("../pdfModel")

router.get("/:book", async (req, res) => {
    const { book } = req.params
    console.log(book);
    const matchArr = await queryStr(book)
    console.log(matchArr);
    res.json({data: matchArr})
})

module.exports = router