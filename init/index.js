// code for initialisation database

const mongoose = require("mongoose") ;
const initData = require("./data.js")
const Listing = require("../models/listing.js") ;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ;
main()
  .then( (res) => {
    console.log("connected to our db wanderlust") ;
  })
  .catch( (err) => {
    console.log(err) ;
  });
  
async function main() {
    await mongoose.connect(MONGO_URL) ;
}

const initDB = async () => {
    await Listing.deleteMany( {} ) ;
    initData.data = initData.data.map( (obj) => ({...obj , owner : "699b0bf4a450204529b24b2c"}));
    await Listing.insertMany( initData.data ) ;
    console.log("initialised data is added..")
}

initDB() ;