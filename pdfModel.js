require('dotenv').config()
const mongoose = require("mongoose")
const handle = require("./helpers/errorHandler")
// const MongoClient = require('mongodb').MongoClient;

const url = `mongodb+srv://admin-ayoade:${process.env.MONGO_PASSWORD}@cluster0.4d1r2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
// const url = "mongodb://localhost:27017/pdfDB"
const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
// // Connect using MongoClient
// const mongoClient = new MongoClient(url);
// // mongoClient.connect(function(err, client) {
// //   const db = client.db(dbName);
// //   client.close();
// // });
main()
  .then((data) => {
    // console.log(res);
    // console.log(mongoClient);
    console.log('succefully connected to DB');
    return data
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(url, options);
}

const pdfSchema = new mongoose.Schema({
  nativeName: String,
  title: String,
  url: String,
  cloudId: String,
  publicID: String,
  downloads: { type: Number, default: 0 },
  dateCreated: { type: String, default: `${new Date().toLocaleString("default", { month: "short"})} ${new Date().getFullYear()}`},
  pages: Number,
  size: String,
  description: String
})

const Pdf = new mongoose.model("Pdf", pdfSchema)

//search DB by mongo _id
const idFinder = async (id) => {
    const [status, bookError] = await handle(Pdf.findById(id).lean())
    console.log(status);
    if(bookError) {
      return null
    } else {
      return status
    }
}

//search DB for certain query and returns sorted matches
const queryStr = async (str, sort = {"downloads": "desc"}) => {
  const arr = await Pdf.find({ 
    "nativeName": { "$regex": `${str}`, "$options": "i" // set the search to be case insensitive
  } 
  })
  .sort(sort) //sorting the results in terms of highest downloads values
  .lean() //returns a plain Javascript object instead of a mongo object
  return arr
}

//Updates the number of downloads for the book
const updateDownload = async (bookName) => {
  const doc = await Pdf.findOne({nativeName : bookName})
  doc.downloads += 1;
  await doc.save()
}

//seed book to DB and handles error
const createBook = async (bookDetail) => {
  const [status, bookError] = await handle(Pdf.create(bookDetail))
  console.log(status);
  if(bookError) {
    return false
  } else {
    return true
  }
}

module.exports = { queryStr, updateDownload, createBook, idFinder, main }