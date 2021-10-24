const express = require("express")
const router = express.Router()
const { unlink } = require('fs/promises');
const { uploader } = require("../cloudinary")
const upload = require("../multer")
const { createBook, queryStr } = require("../pdfModel")
const convertSize = require("../helpers/sizeConverter");
const chunkArr = require("../helpers/chunkArr");
const genArr = require("../helpers/generateArr");
const feedPrep = require("../helpers/feedPrep");

router.get("/", async (req, res) => {
    const feeds = await queryStr("", {"downloads": "desc"})
    const { next, prev, totalPages, matchArr } = feedPrep(feeds, 1)
    res.render("feeds", {matchArr, totalPages, prev, next})
})

router.get("/page/:pageNum", async (req, res) => {
    const pgNum = parseInt(req.params.pageNum, 10)
    const feeds = await queryStr("", {"downloads": "desc"})
    const { next, prev, totalPages, matchArr } = feedPrep(feeds, pgNum)
    res.render("feeds", {matchArr, totalPages, prev, next})
})

router.get("/upload", (req, res) => {
    const failureMsg = req.flash("failure")
    const successMsg = req.flash("success")
    res.render("upload", { successMsg, success: successMsg.length > 0, failureMsg, failure: failureMsg.length > 0 })
})


router.post('/upload', upload.single('pdf'), async function (req, res, next) {
    // Validating if file is a PDF
    if (req.file.mimetype == "application/pdf") {
        // uploading pdf to cloudinary
        const { asset_id, secure_url, original_filename, public_id, pages, bytes } = await uploader(req.file.path)
        const { name, desc } = req.body
        const toBeSaved = {
            nativeName: name,
            title: original_filename,
            url: secure_url,
            cloudId: asset_id,
            publicID: public_id,
            description: desc,
            pages: pages,
            size: convertSize(bytes)
        }
        const responseStatus = await createBook(toBeSaved); //Saving book data to DB
        responseStatus ? req.flash("success", "Successfully uploaded pdf") : req.flash("failure", "Failed to upload pdf")
        res.redirect("/upload")
    } else {
        await unlink(req.file.path);
        req.flash("failure", "Failed, Please upload a valid PDF")
        res.redirect("/upload")
    }
    
})

module.exports = router