const axios = require("axios");

module.exports.geocode = async (location, country) => {
    try {
        const query = encodeURIComponent(`${location}, ${country}`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "WanderLust-App"  // Nominatim requires a User-Agent
            }
        });

        if (response.data.length === 0) {
            return [0, 0]; // fallback if location not found
        }

        const { lon, lat } = response.data[0];
        return [parseFloat(lon), parseFloat(lat)]; // [longitude, latitude]

    } catch (err) {
        console.error("Geocoding failed:", err.message);
        return [0, 0];
    }
};
