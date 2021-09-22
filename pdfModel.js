const mongoose = require("mongoose")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/pdfDB', { useNewUrlParser: true, useUnifiedTopology: true });
}

const pdfSchema = new mongoose.Schema({
  nativeName: String,
  title: String,
  url: String,
  cloudId: String,
  publicID: String,
  downloadLink: String
})

module.exports = new mongoose.model("Pdf", pdfSchema)
