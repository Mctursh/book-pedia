require('dotenv').config()
const cloudinary = require("cloudinary").v2

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

const uploader = async (filePath) => {
    let info;
    await cloudinary.uploader.upload(filePath, 
        function(error, result) {
            if (!error) {
                console.log(result);
                info = result
            } else {
                throw error
            }
        }        
    )
    return info
}

const createLink = (id) => {
    const link = cloudinary.url(id || "dgwyxcw2rk5mkgijcc64", {flags: "attachment"})
    return link
}

module.exports = { uploader, createLink }

