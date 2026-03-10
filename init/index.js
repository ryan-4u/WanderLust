const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { geocode } = require("../utils/geocode.js");

require("dotenv").config({ path: "../.env" });

const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("MONGO_URL being used:", MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const listings = [];
  for (let obj of initData.data) {
    const coordinates = await geocode(obj.location, obj.country);
    listings.push({
      ...obj,
      owner: "69affac1c2f2ec7e628aa9e6",
      geometry: { type: "Point", coordinates }
    });
    await delay(1100);
  }

  await Listing.insertMany(listings);
  console.log("initialised data with coordinates added..");
  mongoose.connection.close();
};

initDB();