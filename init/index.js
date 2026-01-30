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
    await Listing.insertMany( initData.data ) ;
    console.log("initialised data is added..")
}

initDB() ;