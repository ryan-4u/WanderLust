const express = require("express") ;
const router = express.Router();

const Listing = require("../models/listing.js") ;
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js") ;
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//index route
router.get("/" , wrapAsync( listingController.index ));

//new route
router.get("/new" ,isLoggedIn , listingController.renderNewForm );

//create route
router.post("/",isLoggedIn ,validateListing, wrapAsync( listingController.createListing)) ;

//show route
router.get("/:id", wrapAsync( listingController.showListing)) ;

//Edit route
router.get(
  "/:id/edit" , isLoggedIn , isOwner , wrapAsync( listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn, isOwner, validateListing , wrapAsync( listingController.updateListing)) ;

//delete route
router.delete("/:id" , isLoggedIn, isOwner , wrapAsync( listingController.destroyListing)) ;

module.exports = router ;