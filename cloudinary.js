require('dotenv').config()
const cloudinary = require("cloudinary").v2
const { unlink } = require('fs/promises');

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

const uploader = async (filePath) => {
    let info;
    await cloudinary.uploader.upload(filePath, 
        async function(error, result) {
            if (!error) {
                console.log(result);
                info = result
                await unlink(filePath);
            } else {
                throw error
            }
        }        
    )
    return info
}

const createLink = (id) => {
    const link = cloudinary.url(id, {flags: "attachment"})
    return link
}

module.exports = { uploader, createLink }

