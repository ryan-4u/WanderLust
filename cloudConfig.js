const cloudinary = require("cloudinary");
const CloudinaryStorage  = require("multer-storage-cloudinary") ;

// giving our cloud credentials 
//  key name in this is by default this so dont change them
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME ,
    api_key : process.env.CLOUD_API_KEY ,
    api_secret : process.env.CLOUD_API_SECRET ,
}) ;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowed_Formats: [ "png" , "jpg" , "jpeg"] ,
  },
});

module.exports = {
    cloudinary ,
    storage
}