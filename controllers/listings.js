const Listing = require("../models/listing") ;
const { cloudinary } = require("../cloudConfig");

module.exports.index = async (req,res) => {
  const allListings = await Listing.find({})
  res.render("listings/index.ejs" , { allListings }) ;
} ;

module.exports.renderNewForm = (req,res) => {
  res.render("listings/new.ejs");
} ;

module.exports.showListing = async (req,res) => {
  const {id} = req.params ;
  const listing = await Listing.findById(id)
    .populate({
      path : "reviews" ,
      populate : {
        path : "author" ,
      },
    })
    .populate("owner") ;
  if( !listing){
    req.flash( "error" , "Listing you requested for does not exist!") ;
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", {listing} ) ;
};

module.exports.createListing = async (req,res,next) => {

    // Enforce image required on create
    if (!req.file) {
      req.flash("error", "Image is required");
      return res.redirect("/listings/new");
    }
    let url = req.file.secure_url ;
    let filename = req.file.public_id ;
    const newListing = new Listing(req.body.listing) ;
    newListing.owner = req.user._id ;
    newListing.image = {url,filename} ;

    await newListing.save() ;
    req.flash("success","New listing created") ;
    res.redirect("/listings") ;
}

module.exports.renderEditForm = async (req,res) =>{
  const {id} = req.params ;
  const listing = await Listing.findById(id) ;
  if( !listing){
    req.flash( "error" , "Listing you requested for does not exist!") ;
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url ;
  originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
  res.render("listings/edit.ejs", {listing , originalImageUrl} ) ;
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid data for listing");
  }
  let { id } = req.params;
  // Fetch listing first
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  // Update basic fields manually
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.country = req.body.listing.country;
  listing.location = req.body.listing.location;

  // If new image uploaded
  if (req.file) {
    // Only delete if old image exists
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    listing.image = {
      url: req.file.secure_url,
      filename: req.file.public_id
    };
  }
  await listing.save();

  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  // delete image from Cloudinary if exists
  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};