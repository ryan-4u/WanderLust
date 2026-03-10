/**
 * WanderLust — Complete Seed File
 * Seeds: 12 users, 28+ listings (with geocoding), 10-12 reviews per listing, 3-5 favorites per user
 * Owner: Aaryan (_id: 69affac1c2f2ec7e628aa9e6)
 * Run: node seed.js (from project root)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { geocode } = require("./utils/geocode.js");

const MONGO_URL = process.env.ATLASDB_URL;
const OWNER_ID = "69affac1c2f2ec7e628aa9e6"; // Aaryan
const COMMON_PASSWORD = "user123";

// ── 12 Seed Users ──────────────────────────────────────────────
const seedUsers = [
  { username: "TravellerRaj",   email: "raj@wanderlust.com" },
  { username: "SophieMiles",    email: "sophie@wanderlust.com" },
  { username: "NomadKaran",     email: "karan@wanderlust.com" },
  { username: "WandererPriya",  email: "priya@wanderlust.com" },
  { username: "ExplorerArjun",  email: "arjun@wanderlust.com" },
  { username: "AdventureNeha",  email: "neha@wanderlust.com" },
  { username: "JetsetterVikram",email: "vikram@wanderlust.com" },
  { username: "RoamerAnanya",   email: "ananya@wanderlust.com" },
  { username: "BackpackerSam",  email: "sam@wanderlust.com" },
  { username: "GlobeIsha",      email: "isha@wanderlust.com" },
  { username: "VoyagerDeep",    email: "deep@wanderlust.com" },
  { username: "RovinRohit",     email: "rohit@wanderlust.com" },
];

// ── Review Comments Pool ────────────────────────────────────────
const reviewComments = [
  "Absolutely loved this place! The views were breathtaking and the host was incredibly welcoming.",
  "A perfect getaway. Everything was exactly as described. Would definitely come back!",
  "The location was fantastic and the amenities were top-notch. Highly recommend!",
  "Such a unique and memorable experience. The property exceeded all our expectations.",
  "Great value for the price. Clean, comfortable, and in a wonderful location.",
  "The host was very responsive and helpful. The place felt like a home away from home.",
  "Stunning property with beautiful surroundings. Peaceful and relaxing stay.",
  "Everything was perfect from check-in to check-out. Will definitely book again!",
  "Loved every moment of our stay. The property is even better in person than in photos.",
  "Incredible experience! The location is unbeatable and the property is gorgeous.",
  "Very clean and well-maintained property. The neighborhood was safe and convenient.",
  "One of the best stays I've ever had. The attention to detail was impressive.",
  "Fantastic spot for a relaxing holiday. Exactly what we needed to recharge.",
  "The property photos don't do it justice — it's even more beautiful in person!",
  "Superb host and superb property. Everything was arranged perfectly for our arrival.",
  "A hidden gem! We were blown away by how beautiful and peaceful the location was.",
  "Excellent amenities and very comfortable beds. We slept like babies every night.",
  "The perfect romantic getaway. We will cherish the memories from this trip forever.",
  "Very spacious and well-equipped. Had everything we needed for a comfortable stay.",
  "Loved the local area too — great restaurants and attractions within walking distance.",
];

// ── Listings Data ───────────────────────────────────────────────
const listingsData = [
  { title: "Cozy Beachfront Cottage", description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=60" }, price: 1500, location: "Malibu", country: "United States", category: "Amazing Pools" },
  { title: "Modern Loft in Downtown", description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=60" }, price: 1200, location: "New York City", country: "United States", category: "Iconic Cities" },
  { title: "Mountain Retreat", description: "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=60" }, price: 1000, location: "Aspen", country: "United States", category: "Mountains" },
  { title: "Historic Villa in Tuscany", description: "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60" }, price: 2500, location: "Florence", country: "Italy", category: "Iconic Cities" },
  { title: "Secluded Treehouse Getaway", description: "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=60" }, price: 800, location: "Portland", country: "United States", category: "Camping" },
  { title: "Beachfront Paradise", description: "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=60" }, price: 2000, location: "Cancun", country: "Mexico", category: "Trending" },
  { title: "Rustic Cabin by the Lake", description: "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=60" }, price: 900, location: "Lake Tahoe", country: "United States", category: "Camping" },
  { title: "Luxury Penthouse with City Views", description: "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=800&q=60" }, price: 3500, location: "Los Angeles", country: "United States", category: "Iconic Cities" },
  { title: "Ski-In/Ski-Out Chalet", description: "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800&q=60" }, price: 3000, location: "Verbier", country: "Switzerland", category: "Mountains" },
  { title: "Safari Lodge in the Serengeti", description: "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=60" }, price: 4000, location: "Serengeti National Park", country: "Tanzania", category: "Trending" },
  { title: "Historic Canal House", description: "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=60" }, price: 1800, location: "Amsterdam", country: "Netherlands", category: "Iconic Cities" },
  { title: "Private Island Retreat", description: "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?w=800&q=60" }, price: 10000, location: "Fiji", country: "Fiji", category: "Trending" },
  { title: "Charming Cottage in the Cotswolds", description: "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=800&q=60" }, price: 1200, location: "Cotswolds", country: "United Kingdom", category: "Rooms" },
  { title: "Historic Brownstone in Boston", description: "Step back in time in this elegant historic brownstone located in the heart of Boston.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?w=800&q=60" }, price: 2200, location: "Boston", country: "United States", category: "Iconic Cities" },
  { title: "Beachfront Bungalow in Bali", description: "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1602391833977-358a52198938?w=800&q=60" }, price: 1800, location: "Bali", country: "Indonesia", category: "Amazing Pools" },
  { title: "Mountain View Cabin in Banff", description: "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=800&q=60" }, price: 1500, location: "Banff", country: "Canada", category: "Mountains" },
  { title: "Art Deco Apartment in Miami", description: "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.", image: { filename: "listingimage", url: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?w=800&q=60" }, price: 1600, location: "Miami", country: "United States", category: "Rooms" },
  { title: "Tropical Villa in Phuket", description: "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?w=800&q=60" }, price: 3000, location: "Phuket", country: "Thailand", category: "Amazing Pools" },
  { title: "Historic Castle in Scotland", description: "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=800&q=60" }, price: 4000, location: "Scottish Highlands", country: "United Kingdom", category: "Castle" },
  { title: "Desert Oasis in Dubai", description: "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=60" }, price: 5000, location: "Dubai", country: "United Arab Emirates", category: "Trending" },
  { title: "Rustic Log Cabin in Montana", description: "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&q=60" }, price: 1100, location: "Montana", country: "United States", category: "Farms" },
  { title: "Beachfront Villa in Greece", description: "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=60" }, price: 2500, location: "Mykonos", country: "Greece", category: "Trending" },
  { title: "Eco-Friendly Treehouse Retreat", description: "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&q=60" }, price: 750, location: "Costa Rica", country: "Costa Rica", category: "Camping" },
  { title: "Historic Cottage in Charleston", description: "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=800&q=60" }, price: 1600, location: "Charleston", country: "United States", category: "Rooms" },
  { title: "Modern Apartment in Tokyo", description: "Explore the vibrant city of Tokyo from this modern and centrally located apartment.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=60" }, price: 2000, location: "Tokyo", country: "Japan", category: "Iconic Cities" },
  { title: "Lakefront Cabin in New Hampshire", description: "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&q=60" }, price: 1200, location: "New Hampshire", country: "United States", category: "Camping" },
  { title: "Luxury Villa in the Maldives", description: "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=60" }, price: 6000, location: "Maldives", country: "Maldives", category: "Amazing Pools" },
  { title: "Ski Chalet in Aspen", description: "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=60" }, price: 4000, location: "Aspen", country: "United States", category: "Mountains" },
  { title: "Secluded Beach House in Costa Rica", description: "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=60" }, price: 1800, location: "Costa Rica", country: "Costa Rica", category: "Trending" },
  // Extra listings
  { title: "Floating Houseboat in Kerala", description: "Glide through the serene backwaters of Kerala on this beautifully decorated traditional houseboat.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=60" }, price: 2200, location: "Alleppey", country: "India", category: "Boats" },
  { title: "Igloo Suite in Finland", description: "Sleep under the northern lights in a glass igloo in Lapland. A once-in-a-lifetime Arctic experience.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=60" }, price: 5500, location: "Rovaniemi", country: "Finland", category: "Arctic" },
  { title: "Geodesic Dome in New Zealand", description: "Stay in a stunning geodesic dome with panoramic views of the New Zealand countryside.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=60" }, price: 1900, location: "Queenstown", country: "New Zealand", category: "Domes" },
  { title: "Farmhouse Stay in Tuscany", description: "Wake up to rolling vineyards and olive groves in this authentic Tuscan farmhouse.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=60" }, price: 1700, location: "Siena", country: "Italy", category: "Farms" },
  { title: "Sailing Yacht in Croatia", description: "Explore the stunning Dalmatian coast on this luxurious private sailing yacht.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=60" }, price: 7000, location: "Dubrovnik", country: "Croatia", category: "Boats" },
  { title: "Medieval Castle in Portugal", description: "Live like a king in this fully restored medieval castle with breathtaking Atlantic views.", image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=60" }, price: 4500, location: "Sintra", country: "Portugal", category: "Castle" },
];

// ── Helpers ─────────────────────────────────────────────────────
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRating() {
  // Bias towards higher ratings (3-5)
  const ratings = [3, 3, 4, 4, 4, 5, 5, 5];
  return ratings[Math.floor(Math.random() * ratings.length)];
}

// ── Main Seed Function ───────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to Atlas");

  // 1. Clear existing data (except Aaryan's user)
  console.log("🗑️  Clearing old data...");
  await Listing.deleteMany({});
  await Review.deleteMany({});
  await User.deleteMany({ _id: { $ne: new mongoose.Types.ObjectId(OWNER_ID) } });
  console.log("✅ Old data cleared");

  // 2. Create 12 seed users
  console.log("👥 Creating 12 seed users...");
  const createdUsers = [];
  for (let userData of seedUsers) {
    const user = new User({ email: userData.email, username: userData.username });
    const registeredUser = await User.register(user, COMMON_PASSWORD);
    createdUsers.push(registeredUser);
    process.stdout.write(`   Created: ${userData.username}\n`);
  }
  console.log("✅ 12 users created");

  // All users including Aaryan for reviews/favorites
  const allUsers = [...createdUsers];
  const aaryan = await User.findById(OWNER_ID);
  if (aaryan) allUsers.push(aaryan);

  // 3. Create listings with geocoding
  console.log(`\n🏠 Creating ${listingsData.length} listings with geocoding...`);
  console.log("   (This will take ~1 min due to geocoding rate limits)\n");

  const createdListings = [];
  for (let i = 0; i < listingsData.length; i++) {
    const obj = listingsData[i];
    const coordinates = await geocode(obj.location, obj.country);
    const listing = new Listing({
      ...obj,
      owner: OWNER_ID,
      geometry: { type: "Point", coordinates },
    });
    await listing.save();
    createdListings.push(listing);
    process.stdout.write(`   [${i + 1}/${listingsData.length}] ${obj.title}\n`);
    await delay(1100);
  }
  console.log("✅ All listings created");

  // 4. Add 10-12 reviews per listing
  console.log("\n⭐ Adding reviews to listings...");
  for (let listing of createdListings) {
    const reviewCount = getRandomInt(10, 12);
    const reviewers = getRandom(allUsers, Math.min(reviewCount, allUsers.length));

    for (let reviewer of reviewers) {
      const comment = reviewComments[getRandomInt(0, reviewComments.length - 1)];
      const review = new Review({
        comment,
        rating: getRandomRating(),
        author: reviewer._id,
      });
      await review.save();
      listing.reviews.push(review._id);
    }
    await listing.save();
  }
  console.log("✅ Reviews added");

  // 5. Add 3-5 favorites per user
  console.log("\n❤️  Adding favorites to users...");
  for (let user of allUsers) {
    const favCount = getRandomInt(3, 5);
    const favListings = getRandom(createdListings, favCount);
    user.favorites = favListings.map(l => l._id);
    await user.save();
  }
  console.log("✅ Favorites added");

  // 6. Summary
  console.log("\n🎉 Seed complete!");
  console.log(`   Users:    ${createdUsers.length + 1} (${createdUsers.length} seed + Aaryan)`);
  console.log(`   Listings: ${createdListings.length}`);
  console.log(`   Password for all seed users: ${COMMON_PASSWORD}`);
  console.log("\n   Sample login: TravellerRaj / user123");

  mongoose.connection.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.connection.close();
});