const fs = require('fs');
const https = require('https');
const { uploader, createLink } = require("./cloudinary")
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const upload = require("./multer")
const Pdf = require("./pdfModel")
const handlebars = require("express-handlebars")

const app = express()

//setting our default view to handlebars
app.set("view engine", "handlebars")

//Sets handlebars configurations
app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
}));

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '/public')))


app.get("/", (req, res) => {
  res.render("main")
})

app.post('/upload', upload.single('pdf'), async function (req, res, next) {
  const { asset_id, secure_url, original_filename, public_id } = await uploader(req.file.path)
  const toBeSaved = {
    title: original_filename,
    url: secure_url,
    cloudId: asset_id,
    publicID: public_id,
    downloadLink: createLink(public_id) //generates a downloadable link of the image
  }
  Pdf.create(toBeSaved).then((res) => {
    console.log(res);
  }).then(() => res.send("successfully uploaded the pdf"))
})

app.get('/download', ( req, res ) => {
  res.send(createLink());
}) 


app.listen(3000, (req, res) => {
  console.log("successfully running on port 3000");
})
