
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
console.log(process.env.CLOUDINARY_CLOUD_NAME)
cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "profile_picture_artibrowse",
        allowedFormats: ["jpeg", "png", "jpg"]
    }
});
module.exports = {
    cloudinary,
    storage
}