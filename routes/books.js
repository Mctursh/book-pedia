const express = require("express")
const router = express.Router()

const { queryStr } = require("../pdfModel")


router.post("/", async (req, res) => {
    //query search
    const { name } = req.query
    const matchArr = await queryStr(name)
    res.render("feeds", { matchArr })
})

router.get("/api/:book", async (req, res) => {
    const { book } = req.params
    const matchArr = await queryStr(book)
    res.json({data: matchArr})
})

router.get("/:book", (req, res) => {
    //only the book
    res.render("book")
})

module.exports = router