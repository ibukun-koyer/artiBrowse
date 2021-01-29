const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    followers: {
        type: Number,
        default: 0,
        min: 0
    },
    following: {
        type: Number,
        default: 0,
        min: 0
    },
    image: {
        filename: {
            type: String,
            default: "",
            // required: true
        },
        path: {
            type: String,
            //this is hosted on the ji81___ account
            default: "https://res.cloudinary.com/djo8lxa24/image/upload/v1611540424/profile_picture_artibrowse/OIP_culia6.jpg",
            // required: true
        }
    },
    quote: {
        type: String,
        default: ""
    }
});

userSchema.virtual("cropGetFace").get(function () {
    return this.image.path.replace("/upload", "/upload/w_400,h_400,c_thumb,g_face");
    // console.log(this.image.path);
});

module.exports.userSchema = userSchema;