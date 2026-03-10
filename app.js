if( process.env.NODE_ENV!="production"){
  require("dotenv").config()
}

const express = require("express") ;
const app = express() ;
const mongoose = require("mongoose") ;
const path = require("path")
const methodOverride = require("method-override") ;
const ejsMate = require("ejs-mate") ;
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session") ;
const MongoStore = require('connect-mongo').default ;
const flash = require("connect-flash") ;
const passport = require("passport") ;
const LocalStrategy = require("passport-local") ;
const User = require("./models/user.js") ;

// requiring our routes
const listingRouter = require("./routes/listing.js") ;
const reviewRouter = require("./routes/review.js") ;
const userRouter = require("./routes/user.js") ;

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ;
const dbUrl = process.env.ATLASDB_URL ;

main()
  .then( (res) => {
    console.log("connected to our db wanderlust") ;
  })
  .catch( (err) => {
    console.log(err) ;
  });
  
async function main() {
    await mongoose.connect(dbUrl) ;
}

app.set("view engine" , "ejs" ) ;
app.set("views" , path.join( __dirname , "views" ));
app.use( express.urlencoded( {extended : true} ) ) ; // to parse data from route
app.use(methodOverride("_method")) ;
app.engine( "ejs" , ejsMate) ;
app.use(express.static(path.join(__dirname,"/public"))) ;

const store = MongoStore.create({
  mongoUrl: dbUrl ,
  crypto: {
    secret : "mysupersecretcode"
  } ,
  touchAfter : 24 * 3600 ,
});

store.on( "error" , (err) => {
  console.log("ERROR in mongo session store" , err) ;
}) ;

// using session
const sessionOptions = {
  store ,
  secret : "mysupersecretcode" ,
  resave : false ,
  saveUninitialized : true ,
  cookie :{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
    maxAge : 7 * 24 * 60 * 60 * 1000 ,
    httpOnly : true
  }
} ;

app.use( session(sessionOptions) ) ;
app.use( flash() ) ;

//using passport for authentication and authorization
app.use( passport.initialize() ) ;
app.use( passport.session() ) ;
passport.use( new LocalStrategy( User.authenticate() ));

passport.serializeUser( User.serializeUser() ) ;
passport.deserializeUser( User.deserializeUser() ) ;

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

//home route
app.get("/" , (req,res) => {
    res.render("home.ejs") ;
});
// using routes
app.use("/listings",listingRouter) ;
app.use("/listings/:id/reviews",reviewRouter) ;
app.use("/" ,userRouter);


// for routes that doesnot exist
app.all( /.*/ ,(req,res,next) => {
  next( new ExpressError( 404 , "Page Not Found"));
});   

// error handling middleware
app.use( (err,req,res,next) => {
  let {statusCode = 500 ,message = "SOMETHING went WRONG"} = err ;
  res.status(statusCode).render("listings/error.ejs",{message}) ;
})

app.listen( 8080 , () => {
    console.log("server is listening...") ;
}) ;