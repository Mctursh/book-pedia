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
  downloadLink: String
})

const Pdf = new mongoose.model("Pdf", pdfSchema)

const queryStr = async (str) => {
  const arr = await Pdf.find({ 
    "nativeName": { "$regex": `${str}`, "$options": "i"} 
  }).sort({"date": "desc"}) //sorting the results in terms of highest date values
  return arr
}

module.exports = { Pdf, queryStr }