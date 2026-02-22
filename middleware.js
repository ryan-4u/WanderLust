module.exports.isLoggedIn = (req,res,next) => {
    if( !req.isAuthenticated() ){
        req.session.redirectUrl = req.originalUrl ; // storing intended path by user 
        req.flash("error","you must be logged in to create list") ;
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