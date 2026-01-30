const express = require("express") ;
const app = express() ;
const mongoose = require("mongoose") ;
const Listing = require("./models/listing.js") ;
const path = require("path")

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

app.set("view engine" , "ejs" ) ;
app.set("views" , path.join( __dirname , "views" ));
app.use( express.urlencoded( {extended : true} ) ) ; // to parse data from route

app.get("/" , (req,res) => {
    res.send("Hi , i am Groot !") ;
});

//index route
app.get("/listings" , async (req,res) => {
  const allListings = await Listing.find({})
  res.render("listings/index.ejs" , { allListings }) ;
});

//new route
app.get("/listings/new" , (req,res) => {
  res.render("listings/new.ejs");
});
//create route
app.post("/listings", async (req,res) => {
  //let { title,description,image,price,location,country } = req.body ;
  
  //let { listing } = req.body.listing ;
  //let newListing = new Listing(listing) ;

  let newListing = new Listing(req.body.listing) ;
  await newListing.save() ;
  res.redirect("/listings") ;
}) ;

//show route
app.get("/listings/:id", async (req,res) => {
  const {id} = req.params ;
  const listing = await Listing.findById(id) ;
  res.render("listings/show.ejs", {listing} ) ;
}) ;




// app.get("/testListing" , async (req,res) => {
//   let sampleListing = new Listing({
//     title : "My Villa " ,
//     description : "By the beach" ,
//     price : 4700 ,
//     location : "Calanguate , Goa " ,
//     country : "India"
//   });
//   await sampleListing.save() ;
//   console.log("sample was saved");
//   res.send("successful testing") ;
// }) ;

app.listen( 8080 , () => {
    console.log(" server is listening.. ") ;
}) ;