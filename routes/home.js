const express = require("express")
const router = express.Router()

const { uploader } = require("../cloudinary")
const upload = require("../multer")
const { createBook } = require("../pdfModel")


router.get("/", (req, res) => {
    const failureMsg = req.flash("failure")
    const successMsg = req.flash("success")
    res.render("main", { successMsg, success: successMsg.length > 0, failureMsg, failure: failureMsg.length > 0 })
})


router.post('/upload', upload.single('pdf'), async function (req, res, next) {
    // uploading pdf to cloudinary 
    const { asset_id, secure_url, original_filename, public_id } = await uploader(req.file.path)
    const { name } = req.body
    const toBeSaved = {
        nativeName: name,
        title: original_filename,
        url: secure_url,
        cloudId: asset_id,
        publicID: public_id,
        downloads: 0
    }
    const responseStatus = await createBook(toBeSaved); //Saving book data to DB
    responseStatus ? req.flash("success", "Successfully uploaded pdf") : req.flash("failure", "Failed to upload pdf")
    res.redirect("/")
})

module.exports = router