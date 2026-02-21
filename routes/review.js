const express = require("express") ;
const router = express.Router( { mergeParams : true} );

const Listing = require("../models/listing.js") ;
const Review = require("../models/review.js") ;
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema ,reviewSchema} = require("../schema.js") ;


const validateReview = (req,res,next) => {
  let result = reviewSchema.validate(req.body);
  if ( result.error){
    throw new ExpressError(404 , result.error) ;
  } else {
    next() ;  
  }
}

//post review route
router.post("/" , validateReview ,wrapAsync( async(req,res) => {
  let listing = await Listing.findById(req.params.id) ;
  let newReview = new Review(req.body.review) ;

  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`) ;
  }) 
) ;

//delete review route
router.delete("/:reviewId", 
  wrapAsync( async(req,res) => {
    let { id ,reviewId } = req.params ;

    await Listing.findByIdAndUpdate( id , { $pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);  

    res.redirect(`/listings/${id}`) ;
  })
);

module.exports = router ;