(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
})()

// Infinite circular filter scroll
const filtersEl = document.getElementById("filters");
if (filtersEl) {
  const items = Array.from(filtersEl.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    filtersEl.appendChild(clone);
  });

  const itemWidth = filtersEl.scrollWidth / 2;

  filtersEl.addEventListener("scroll", () => {
    if (filtersEl.scrollLeft >= itemWidth) {
      filtersEl.scrollLeft -= itemWidth;
    }
    if (filtersEl.scrollLeft <= 0) {
      filtersEl.scrollLeft += itemWidth;
    }
  });

  // Arrow buttons — scroll by one item width
  const filterPrev = document.getElementById("filter-prev");
  const filterNext = document.getElementById("filter-next");

  const singleItem = filtersEl.querySelector(".filter");
  const scrollAmount = singleItem ? singleItem.offsetWidth : 120;

  if (filterNext) {
    filterNext.addEventListener("click", () => {
      filtersEl.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  if (filterPrev) {
    filterPrev.addEventListener("click", () => {
      filtersEl.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
}

// Tax toggle
// Tax toggle — persist state across page loads
const taxSwitch = document.getElementById("switchCheckDefault");
if (taxSwitch) {
  // Restore saved state
  if (sessionStorage.getItem("taxToggle") === "true") {
    taxSwitch.checked = true;
    const taxInfo = document.getElementsByClassName("tax-info");
    for (let info of taxInfo) {
      info.style.display = "inline";
    }
  }

  taxSwitch.addEventListener("click", () => {
    const taxInfo = document.getElementsByClassName("tax-info");
    for (let info of taxInfo) {
      info.style.display = info.style.display !== "inline" ? "inline" : "none";
    }
    sessionStorage.setItem("taxToggle", taxSwitch.checked);
  });
}

// Live search
// ── Unified listings fetch ──
const grid = document.getElementById("listings-grid");

function renderListings(listings, query = "") {
  if (!grid) return;

  if (listings.length === 0) {
    grid.innerHTML = `
      <div class="empty-state w-100">
        <i class="fa-solid fa-magnifying-glass empty-state-icon"></i>
        <h4>No listings found${query ? ` for "${query}"` : ""}</h4>
        <a href="/listings" class="hero-btn-primary mt-3">Clear Filters</a>
      </div>`;
    return;
  }

  grid.innerHTML = listings.map(l => `
    <a href="/listings/${l._id}" class="listing-link">
      <div class="card col listing-card">
        <div class="listing-img-wrap">
          <img src="${l.image.url}" class="card-img-top" alt="listing-image">
          <span class="listing-category-badge">${l.category || ''}</span>
          <button class="heart-btn" data-id="${l._id}" data-logged-in="${!!window.CURRENT_USER}">            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="listing-title">${l.title}</div>
          <div class="listing-location"><i class="fa-solid fa-location-dot"></i> ${l.location}, ${l.country}</div>
          <div class="listing-price">
            &#8377; ${l.price} <span class="per-night">/ night</span>
            <i class="tax-info" style="display:none">+18% GST</i>
          </div>
        </div>
      </div>
    </a>
  `).join("");

  // re-apply tax toggle state
  if (taxSwitch && taxSwitch.checked) {
    document.querySelectorAll(".tax-info").forEach(el => el.style.display = "inline");
  }

  // re-attach heart listeners
  attachHeartListeners();

  // re-trigger GSAP scroll animations
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
    document.querySelectorAll('.listing-card').forEach((card) => {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });
    });
  }
}

async function fetchListings(q = "", category = "") {
  try {
    let url = `/listings/search?`;
    if (q)        url += `q=${encodeURIComponent(q)}&`;
    if (category) url += `category=${encodeURIComponent(category)}`;
    const res = await fetch(url);
    return await res.json();
  } catch(err) {
    console.error("Fetch failed", err);
    return [];
  }
}

// Track active state
let activeCategory = document.querySelector(".filter.active-filter")?.dataset.category || "";
let activeSearch = "";

// Filter clicks
document.querySelectorAll(".filter[data-category]").forEach(btn => {
  btn.addEventListener("click", async () => {
    // toggle
    if (activeCategory === btn.dataset.category) {
      activeCategory = "";
    } else {
      activeCategory = btn.dataset.category;
    }

    // update active styles
    document.querySelectorAll(".filter[data-category]").forEach(f => f.classList.remove("active-filter"));
    if (activeCategory) {
      document.querySelector(`.filter[data-category="${activeCategory}"]`)?.classList.add("active-filter");
    }

    // update clear btn
    const clearBtn = document.getElementById("filter-clear");
    if (clearBtn) clearBtn.classList.toggle("active", !!activeCategory);

    const listings = await fetchListings(activeSearch, activeCategory);
    renderListings(listings, activeSearch);
  });
});

// Clear filter
const clearBtn = document.getElementById("filter-clear");
if (clearBtn) {
  clearBtn.addEventListener("click", async () => {
    activeCategory = "";
    document.querySelectorAll(".filter[data-category]").forEach(f => f.classList.remove("active-filter"));
    clearBtn.classList.remove("active");
    const listings = await fetchListings(activeSearch, "");
    renderListings(listings, activeSearch);
  });
}

// Search
const searchInput = document.getElementById("search-input");
if (searchInput) {
  if (searchInput.value) {
    searchInput.focus();
    const len = searchInput.value.length;
    searchInput.setSelectionRange(len, len);
  }

  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      activeSearch = searchInput.value.trim();
      const listings = await fetchListings(activeSearch, activeCategory);
      renderListings(listings, activeSearch);
    }, 300);
  });
}

// Heart / Favorites toggle
// Heart / Favorites toggle
function attachHeartListeners() {
  document.querySelectorAll(".heart-btn").forEach(btn => {
    // avoid double-attaching
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (btn.dataset.loggedIn === "false") {
        window.location.href = "/login";
        return;
      }

      const id = btn.dataset.id;
      const icon = btn.querySelector("i");

      try {
        const res = await fetch(`/listings/${id}/favorite`, { method: "POST" });
        if (res.redirected || !res.ok) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        if (data.favorited) {
          icon.classList.replace("fa-regular", "fa-solid");
          btn.classList.add("favorited");
        } else {
          icon.classList.replace("fa-solid", "fa-regular");
          btn.classList.remove("favorited");
        }
      } catch (err) {
        window.location.href = "/login";
      }
    });
  });
}

attachHeartListeners();