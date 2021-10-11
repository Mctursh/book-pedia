const express = require("express")
const { createLink } = require("../cloudinary")
const router = express.Router()

const { queryStr, idFinder } = require("../pdfModel")



router.post("/", async (req, res) => {
    //query search
    const { name } = req.query
    const matchArr = await queryStr(name)
    res.render("feeds", { matchArr })
})

router.get("/api/:book", async (req, res) => {
    const { book } = req.params
    const matchArr = await queryStr(book)
    console.log(matchArr);
    res.json({data: matchArr})
})

router.get("/:bookID", async (req, res) => {
    //only the book
    const { bookID } = req.params 
    const bookDetail = await idFinder(bookID)
    const downloadLink = createLink(bookDetail.publicID)
    res.render("book", { bookDetail, downloadLink })
})

module.exports = router