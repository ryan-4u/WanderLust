# 🧭 WanderLust — Find Your Perfect Stay

> A full-stack Airbnb-inspired travel listing platform built with Node.js, Express, MongoDB & EJS.  
> Features a modern responsive UI, GSAP animations, interactive maps, real-time AJAX search, and a complete auth system.

<br>

## 🌐 Live Demo

**[https://wanderlust-22cx.onrender.com](https://wanderlust-22cx.onrender.com)**

> ⚠️ Hosted on Render free tier — may take 30–50 seconds to wake up on first visit.

<br>

## 📸 Screenshots

> **Add screenshots here** — take these from your live site and upload to the repo:
>
> | Page | What to capture |
> |---|---|
> | `screenshots/landing.png` | Home page with GSAP carousel |
> | `screenshots/listings.png` | Listings grid with filter bar |
> | `screenshots/show.png` | Show page with map + reviews |
> | `screenshots/mobile.png` | Mobile view (DevTools device mode) |
>
> Then replace this block with:
> ```md
> | Landing | Listings | Show Page |
> |---|---|---|
> | ![Landing](screenshots/landing.png) | ![Listings](screenshots/listings.png) | ![Show](screenshots/show.png) |
> ```

<br>

## ✨ Features

### 🏠 Core Functionality
- Full **CRUD** for listings — create, read, update, delete with image upload
- **User authentication** — signup, login, logout via Passport.js
- **Authorization** — only listing owners can edit or delete their listings
- **Star rating review system** — leave and delete reviews per listing
- **Favorites system** — save listings with heart toggle, view your saved stays

### 🔍 Search & Discovery
- **Live AJAX search** — results update as you type, no page reload
- **Category filtering** — 11 categories with infinite scroll filter bar
- **Tax toggle** — display price with or without 18% GST, persists across navigation

### 🗺️ Maps & Location
- **Interactive maps** — Leaflet.js with OpenStreetMap tiles on every listing
- **Geocoding** — Nominatim API with retry logic and smart fallback
- **Custom map marker** — house icon that switches to compass on hover

### 🎨 UI/UX
- Custom **Sophisticated Neutral** design system with brand colors
- Fully **responsive** — mobile, tablet, desktop
- **GSAP animations** — landing carousel, staggered card entrances, scroll triggers
- **Flash toast notifications** — auto-dismiss, slide in from right
- Animated **landing page** with rotating category image carousel
- Open Graph meta tags and custom SVG favicon

<br>

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | Passport.js + passport-local |
| **Sessions** | express-session + connect-mongo |
| **Templating** | EJS + ejs-mate |
| **Image Storage** | Cloudinary |
| **Maps** | Leaflet.js + Nominatim (OpenStreetMap) |
| **Animations** | GSAP 3 + ScrollTrigger |
| **Frontend** | Bootstrap 5 + Custom CSS + Vanilla JS |
| **Validation** | Joi (server-side) + Bootstrap (client-side) |
| **Deployment** | Render |

<br>

## 📁 Project Structure

```
WanderLust/
├── controllers/
│   ├── listings.js       # CRUD, search, favorites toggle
│   ├── reviews.js        # Create & delete reviews
│   └── users.js          # Signup, login, logout
├── models/
│   ├── listing.js        # Listing schema with geometry
│   ├── review.js         # Review schema
│   └── user.js           # User schema with favorites[]
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/
│   ├── layouts/boilerplate.ejs
│   ├── listings/
│   │   ├── index.ejs     # Listings grid + filters + AJAX
│   │   ├── show.ejs      # Listing detail + map + reviews
│   │   ├── new.ejs       # Create listing form
│   │   ├── edit.ejs      # Edit listing form
│   │   └── error.ejs
│   ├── includes/
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   └── flash.ejs
│   └── home.ejs          # Landing page with GSAP carousel
├── public/
│   ├── css/
│   │   ├── style.css     # All custom styles + responsive
│   │   └── rating.css    # Starability star ratings
│   ├── js/
│   │   ├── script.js     # AJAX search, filters, favorites
│   │   └── animation.js  # GSAP animations
│   └── favicon.svg
├── utils/
│   ├── geocode.js        # Nominatim geocoding with retry
│   ├── ExpressError.js
│   └── wrapAsync.js
├── init/
│   ├── data.js           # Sample listings data
│   └── index.js          # DB init script
├── seed.js               # Full seed: users, listings, reviews, favorites
├── middleware.js
├── cloudConfig.js
└── app.js
```

<br>

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/ryan-4u/WanderLust.git
cd WanderLust
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` in project root
```env
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority
SECRET=your_session_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 4. Seed the database (optional)
```bash
node seed.js
```
Creates 35 listings, 12 users (password: `user123`), 10–12 reviews per listing, and favorites.

### 5. Run locally
```bash
node app.js
```
App runs at **http://localhost:8080**

<br>

## 🗺️ API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Landing page |
| GET | `/listings` | — | All listings with filter & search |
| GET | `/listings/search` | — | AJAX search endpoint |
| GET | `/listings/new` | ✅ | New listing form |
| POST | `/listings` | ✅ | Create listing |
| GET | `/listings/:id` | — | Show listing detail |
| GET | `/listings/:id/edit` | ✅ Owner | Edit form |
| PUT | `/listings/:id` | ✅ Owner | Update listing |
| DELETE | `/listings/:id` | ✅ Owner | Delete listing |
| POST | `/listings/:id/reviews` | ✅ | Add review |
| DELETE | `/listings/:id/reviews/:rid` | ✅ Author | Delete review |
| POST | `/listings/:id/favorite` | ✅ | Toggle favorite |
| GET | `/signup` | — | Signup page |
| POST | `/signup` | — | Register user |
| GET | `/login` | — | Login page |
| POST | `/login` | — | Authenticate user |
| GET | `/logout` | ✅ | Logout |

<br>

## 🧪 Test Credentials

| Username | Password |
|---|---|
| TravellerRaj | user123 |
| SophieMiles | user123 |
| NomadKaran | user123 |
| WandererPriya | user123 |

> All 12 seed users share the password `user123`

<br>

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `ATLASDB_URL` | MongoDB Atlas connection string |
| `SECRET` | Session encryption secret |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |

<br>

## 👨‍💻 Author

**Aaryan Aggrawa**
- 🐙 GitHub: [@ryan-4u](https://github.com/ryan-4u)
- 📧 Email: aaryanaggrawa.dev@gmail.com
- 🌐 Portfolio: [aaryan-aggrawa-v1.netlify.app](https://aaryan-aggrawa-v1.netlify.app)

<br>

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

> Built as a portfolio project demonstrating full-stack development — Node.js, MongoDB, REST APIs, Passport.js auth, Cloudinary storage, Leaflet maps, GSAP animations, and responsive UI/UX design.