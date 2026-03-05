const mongoose = require("mongoose") ;
const initData = require("./data.js") ;
const Listing = require("../models/listing.js") ;
const { geocode } = require("../utils/geocode.js") ;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ;

main()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const listings = [];
    for (let obj of initData.data) {
        const coordinates = await geocode(obj.location, obj.country);
        listings.push({
            ...obj,
            owner: "699b0bf4a450204529b24b2c",
            geometry: { type: "Point", coordinates }
        });
        await delay(1100); // wait 1.1 seconds between each request
    }

    await Listing.insertMany(listings);
    console.log("initialised data with coordinates added..") ;
}

initDB() ;