const axios = require("axios");

// New Delhi as default fallback
const DEFAULT_COORDINATES = [77.2090, 28.6139];

module.exports.geocode = async (location, country) => {
  const headers = { "User-Agent": "WanderLust-App/1.0" };

  const queries = [
    `${location}, ${country}`,   // "Madhya Pradesh, India"
    `${location}`,                // "Madhya Pradesh" — sometimes works better alone
    `${country}`,                 // last resort — at least show the country
  ];

  for (let q of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=1`;
      const response = await axios.get(url, { headers });

      if (response.data && response.data.length > 0) {
        const { lon, lat } = response.data[0];
        console.log(`Geocoded "${q}" → [${lon}, ${lat}]`);
        return [parseFloat(lon), parseFloat(lat)];
      }
    } catch (err) {
      console.error(`Geocoding failed for "${q}":`, err.message);
    }
  }

  // All queries failed — use New Delhi
  console.warn(`Geocoding failed for "${location}, ${country}" — using New Delhi fallback`);
  return DEFAULT_COORDINATES;
};