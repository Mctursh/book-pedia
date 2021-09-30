const express = require("express")
const router = express.Router()

const { createLink } = require("../cloudinary")
const { updateDownload } = require("../pdfModel")

router.get('/', ( req, res ) => {
    res.send(createLink());
})

router.post("/count", async (req, res) => {
    const { book }  = req.body;
    await updateDownload(book)
    res.json({
        data: req.body.book
    })
})

module.exports = router