const express = require("express") ;
const app = express() ;

const mongoose = require("mongoose") ;

const Listing = require("./models/listing.js") ;

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

app.get("/" , (req,res) => {
    res.send("Hi , i am Groot !") ;
});

app.get("/testListing" , async (req,res) => {
  let sampleListing = new Listing({
    title : "My Villa " ,
    description : "By the beach" ,
    price : 4700 ,
    location : "Calanguate , Goa " ,
    country : "India"
  });
  await sampleListing.save() ;
  console.log("sample was saved");
  res.send("successful testing") ;
}) ;

app.listen( 8080 , () => {
    console.log(" server is listening.. ") ;
}) ;