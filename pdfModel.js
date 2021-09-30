const mongoose = require("mongoose")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/pdfDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}

const pdfSchema = new mongoose.Schema({
  nativeName: String,
  title: String,
  url: String,
  cloudId: String,
  publicID: String,
  downloads: Number
})

const Pdf = new mongoose.model("Pdf", pdfSchema)

//search DB for certain query and returns sorted matches
const queryStr = async (str) => {
  const arr = await Pdf.find({ 
    "nativeName": { "$regex": `${str}`, "$options": "i"} 
  }).sort({"date": "desc"}) //sorting the results in terms of highest date values
  return arr
}

//Updates the number of downloads for the book
const updateDownload = async (bookName) => {
  const doc = await Pdf.findOne({nativeName : bookName})
  doc.downloads += 1;
  await doc.save()
}

//handler that handles error
const handle = (promise) => {
  return promise
    .then(data => ([data, undefined]))
    .catch(error => Promise.resolve([undefined, error]));
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

module.exports = { queryStr, updateDownload, createBook }