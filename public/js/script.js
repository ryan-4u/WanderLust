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

// Tax toggle
const taxSwitch = document.getElementById("switchCheckDefault");
if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    const taxInfo = document.getElementsByClassName("tax-info");
    for (let info of taxInfo) {
      info.style.display = info.style.display !== "inline" ? "inline" : "none";
    }
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
              <img src="${l.image.url}" class="card-img-top" alt="listing-image" style="height:15rem">
              <div class="card-img-overlay"></div>
              <div class="card-body">
                <p class="card-text">
                  <b>${l.title}</b><br>
                  &#8377; ${l.price} / night
                  <i class="tax-info">&nbsp;&nbsp;+18% GST</i>
                </p>
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