const Joi = require("joi") ;

module.exports.listingSchema = Joi.object( {
    listing : Joi.object( {
        title : Joi.string().required() ,
        description : Joi.string().required() ,
        location : Joi.string().required() ,
        country : Joi.string().required() ,
        price: Joi.number()
        .greater(0)
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.greater": "Price must be greater than 0"
        }),
        image : Joi.string().allow("",null) ,
        category : Joi.string()
            .valid("Trending","Rooms","Iconic Cities","Mountains","Castle","Amazing Pools","Camping","Farms","Arctic","Domes","Boats")
            .required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5) ,
        comment : Joi.string().required() ,
    }).required() ,
})