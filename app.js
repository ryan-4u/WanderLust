const express = require("express") ;
const app = express() ;
const mongoose = require("mongoose") ;
const Listing = require("./models/listing.js") ;
const path = require("path")
const methodOverride = require("method-override") ;
const ejsMate = require("ejs-mate") ;
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingschema} = require("./schema.js") ;

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
app.use(methodOverride("_method")) ;
app.engine( "ejs" , ejsMate) ;
app.use(express.static(path.join(__dirname,"/public"))) ;

app.get("/" , (req,res) => {
    res.send("Hi , i am Groot !") ;
});

const validateListing = (req,res,next) => {
  let result = listingschema.validate(req.body);
  if ( result.error){
    throw new ExpressError(404 , result.error) ;
  } else {
    next() ;  
  }
}
//index route
app.get("/listings" , wrapAsync( async (req,res) => {
  const allListings = await Listing.find({})
  res.render("listings/index.ejs" , { allListings }) ;
}));

//new route
app.get("/listings/new" , (req,res) => {
  res.render("listings/new.ejs");
});
//create route
app.post("/listings",validateListing, wrapAsync( async (req,res,next) => {
  //let { title,description,image,price,location,country } = req.body ;
  
  //let { listing } = req.body.listing ;
  //let newListing = new Listing(listing) ;
  
    let newListing = new Listing(req.body.listing) ;
    await newListing.save() ;
    res.redirect("/listings") ;
})) ;

//show route
app.get("/listings/:id", wrapAsync( async (req,res) => {
  const {id} = req.params ;
  const listing = await Listing.findById(id) ;
  res.render("listings/show.ejs", {listing} ) ;
})) ;

//Edit route
app.get("/listings/:id/edit" ,wrapAsync( async (req,res) =>{
  const {id} = req.params ;
  const listing = await Listing.findById(id) ;
  res.render("listings/edit.ejs", {listing} ) ;
}));
//update route
app.put("/listings/:id", validateListing ,wrapAsync( async (req,res) => {
  if( ! req.body.listing){
    throw new ExpressError( 400 , "Send Valid data for listing") ;
  }
  let {id} = req.params ;
  await Listing.findByIdAndUpdate( id , {...req.body.listing});
  res.redirect(`/listings/${id}`)
})) ;

//delete route
app.delete("/listings/:id" ,wrapAsync( async (req,res) => {
  let {id} = req.params ;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings") ;
})) ;


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

// for routes that doesnot exist
app.all( /.*/ ,(res,req,next) => {
  next( new ExpressError( 404 , "Page Not Found"));
});   

// error handling middleware
app.use( (err,req,res,next) => {
  let {statusCode = 500 ,message = "SOMETHING went WRONG"} = err ;
  res.status(statusCode).render("listings/error.ejs",{message}) ;
})

app.listen( 8080 , () => {
    console.log(" server is listening.. ") ;
}) ;