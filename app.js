const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const upload = require("./multer")
//const upload = multer.upload

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '/public')))


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

app.post('/upload', upload.single('pdf'), function (req, res, next) {
  console.log(req);
})


app.listen(3000, (req, res) => {
  console.log("succefully running on port 3000");
})
