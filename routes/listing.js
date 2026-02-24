const express = require("express") ;
const router = express.Router();

const Listing = require("../models/listing.js") ;
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const {storage} = require("../cloudConfig.js");
const  multer = require("multer") ;
const upload = multer( {storage} );

router
  .route("/")
  .get( wrapAsync( listingController.index ))   // Index route
  .post(isLoggedIn , upload.single('listing[image]') , validateListing , wrapAsync( listingController.createListing)) ;// Create route

router.get("/new" ,isLoggedIn , listingController.renderNewForm ); //new route

router
  .route("/:id")
  .get( wrapAsync( listingController.showListing)) // show route
  .put(isLoggedIn, isOwner , upload.single('listing[image]') , validateListing , wrapAsync( listingController.updateListing)) //update route 
  .delete( isLoggedIn, isOwner , wrapAsync( listingController.destroyListing)) ; // delete route

router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync( listingController.renderEditForm)); //Edit route

module.exports = router ;