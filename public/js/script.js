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
      const q = searchInput.value.trim();
      const grid = document.getElementById("listings-grid");
      if (!grid) return;

      try {
        const url = q ? `/listings/search?q=${encodeURIComponent(q)}` : `/listings/search`;
        const res = await fetch(url);
        const listings = await res.json();

        if (listings.length === 0) {
          grid.innerHTML = `
            <div class="text-center mt-5 w-100">
              <h4>No listings found for "${q}"</h4>
              <a href="/listings" class="btn btn-outline-danger mt-2">Clear</a>
            </div>`;
          return;
        }

       grid.innerHTML = listings.map(l => `
        <a href="/listings/${l._id}" class="listing-link">
          <div class="card col listing-card">
            <div class="listing-img-wrap">
              <img src="${l.image.url}" class="card-img-top" alt="listing-image">
              <span class="listing-category-badge">${l.category || ''}</span>
            </div>
            <div class="card-body">
              <div class="listing-title">${l.title}</div>
              <div class="listing-location"><i class="fa-solid fa-location-dot"></i> ${l.location}, ${l.country}</div>
              <div class="listing-price">
                &#8377; ${l.price} <span class="per-night">/ night</span>
                <i class="tax-info">+18% GST</i>
              </div>
            </div>
          </div>
        </a>
      `).join("");
      } catch(err) {
        console.error("Search failed", err);
      }
    }, 300);
  });
}

// Heart / Favorites toggle
document.querySelectorAll(".heart-btn").forEach(btn => {
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