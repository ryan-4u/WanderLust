const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;
const Review = require('./review.js') ;

const listingSchema = new Schema({
    title : { 
        type : String ,
        required : true
    } ,
    description : { type : String } ,
    image : {
        url : String ,
        filename : String    
    } ,
    price : { 
        type : Number ,
        required: true,
        min: [1, "Price must be greater than 0"] 
    } ,
    location : { type : String } ,
    country : { type : String } ,
    category : {
        type : String ,
        enum : ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castle", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"] ,
        default : "Trending"
    } ,
    geometry : {
        type : {
            type : String ,
            enum : ["Point"] ,
            default : "Point"
        } ,
        coordinates : {
            type : [Number] ,  // [longitude, latitude]
                default : [0, 0]
            }
    } ,
    reviews : [
        {
            type : Schema.Types.ObjectId ,
            ref : "Review"
        }
    ] ,
    owner : {
        type : Schema.Types.ObjectId ,
        ref : "User"
    }
}) ;

listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing){
    await Review.deleteMany({ _id :{ $in : listing.reviews }}) ;    
    }
});

const Listing = mongoose.model( "Listing" , listingSchema ) ;

module.exports = Listing ;