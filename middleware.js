const Listing = require("./models/listing.js") ;
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js") ;

module.exports.isLoggedIn = (req,res,next) => {
    if( !req.isAuthenticated() ){
        req.session.redirectUrl = req.originalUrl ; // storing intended path by user 
        req.flash("error","you must be logged in to perform the action") ;
        return res.redirect("/login");
    }
    next() ;
}

// saving original path to locals from session
module.exports.saveRedirectUrl = (req,res,next) => {
    if( req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next() ;
}

// to protect edit and delete route of listing
module.exports.isOwner = async (req,res,next) =>{
    let { id } = req.params ;
    let listing = await Listing.findById(id) ;
    //incase listing dont exist
    if(!listing){
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    //our main logic
    if( !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error" , "Only owner is allowed to perform this action") ;
        return res.redirect(`/listings/${id}`)
    }
    next()
}

// validateListing function as middleware
module.exports.validateListing = (req,res,next) => {
  let result = listingSchema.validate(req.body);
  if ( result.error){
    throw new ExpressError(404 , result.error) ;
  } else {
    next() ;  
  }
}

//validateReviw fxn as middleware
module.exports.validateReview = (req,res,next) => {
  let result = reviewSchema.validate(req.body);
  if ( result.error){
    throw new ExpressError(404 , result.error) ;
  } else {
    next() ;  
  }
}