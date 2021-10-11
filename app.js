const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const handlebars = require("express-handlebars")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")

const homeRoutes = require("./routes/home")
const booksRoutes = require("./routes/books")
const downloadRoutes = require("./routes/download")

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

//separating routes into files
app.use("/", homeRoutes)
app.use("/books", booksRoutes)
app.use("/download", downloadRoutes)

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("successfully running on port 3000");
})
