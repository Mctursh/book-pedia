const { uploader, createLink } = require("./cloudinary")
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const upload = require("./multer")
const { Pdf, queryStr } = require("./pdfModel")
const handlebars = require("express-handlebars")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")

const homeRoutes = require("./routes/home")

const app = express()

//setting our default view to handlebars
app.set("view engine", "hbs")

//Sets handlebars configurations
app.engine('hbs', handlebars({
    defaultLayout: __dirname + '/views/layouts/index',
    extname: "hbs"
}));

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '/public')))
app.use(cookieParser());
app.use(session({
  secret: "mysecretstring",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use("/", homeRoutes)


app.get("/", (req, res) => {
  const failureMsg = req.flash("failure")
  const successMsg = req.flash("success")
  res.render("main", { successMsg, success: successMsg.length > 0, failureMsg, failure: failureMsg.length > 0 })
})

app.get("/books/:book", async (req, res) => {
  const { book } = req.params
  console.log(book);
  const matchArr = await queryStr(book)
  console.log(matchArr);
  res.json({data: matchArr})
})

app.get('/download', ( req, res ) => {
  res.send(createLink());
})

app.post('/upload', upload.single('pdf'), async function (req, res, next) {
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
  Pdf.create(toBeSaved).then((res) => {
    console.log(res);
  }).then(() => {
    req.flash("success", "Successfully uploaded pdf")
    res.redirect("/")
  }).catch(() => {
    req.flash("failure", "Failed to upload pdf")
    res.redirect("/")
  })
})

app.post("/download/count", async (req, res) => {
  const { book }  = req.body;
  const doc = await Pdf.findOne({nativeName : book})
  doc.downloads += 1;
  await doc.save()
  res.json({
    data: req.body.book
  })
})

app.listen(3000, (req, res) => {
  console.log("successfully running on port 3000");
})
