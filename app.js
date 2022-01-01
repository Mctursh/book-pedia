require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const handlebars = require("express-handlebars")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const morgan = require('morgan')

const homeRoutes = require("./routes/home")
const booksRoutes = require("./routes/books")
const downloadRoutes = require("./routes/download")
const { truncateDesc, truncateName, getDate } = require("./helpers/hbs-helpers")

const app = express()

//setting our default view to handlebars
app.set("view engine", "hbs")

//Sets handlebars configurations
app.engine('hbs', handlebars({
    defaultLayout: __dirname + '/views/layouts/index',
    extname: "hbs",
    helpers: {
      truncateDesc,
      truncateName,
      getDate
    }
}));

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, '/public')))
app.use(cookieParser());

// const url = "mongodb://localhost:27017/pdfDB"
const url = `mongodb+srv://admin-ayoade:${process.env.MONGO_PASSWORD}@cluster0.4d1r2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

main()
  .then(() => {
    console.log('succefully connected to DB');
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(url, options);
  const db = mongoose.connection
  const dbClient = db.getClient()

  app.use(session({
    secret: "mysecretstring",
    store: MongoStore.create({
      client: dbClient
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 7 * 1000 // 1 week
    }
  }));
  app.use(flash());
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))


  
  //separating routes into files
  app.use("/", homeRoutes)
  app.use("/books", booksRoutes)
  app.use("/download", downloadRoutes)
}





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("successfully running on port 3000");
})
