// ===============================
// HotelBooker Search Results (PHP Backend Connected)
// ===============================

(function () {
  const API_BASE_URL = "http://localhost/hotel-booker/backend";

  // --- Auth State ---
  let currentUser = null;

  function initUserState() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) currentUser = JSON.parse(savedUser);
    updateAuthUI();
  }

  function updateAuthUI() {
    const signinBtn = document.getElementById("signinBtn");
    if (!signinBtn) return;
    if (currentUser) {
      signinBtn.textContent = currentUser.name || "Account";
      signinBtn.onclick = () => {
        if (confirm("Do you want to log out?")) {
          currentUser = null;
          localStorage.removeItem("user");
          updateAuthUI();
        }
      };
    } else {
      signinBtn.textContent = "Sign in";
      signinBtn.onclick = () => (window.location.href = "signin.html");
    }
  }

  // --- API Helper ---
  const api = {
    async request(endpoint, options = {}) {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
        headers: { "Content-Type": "application/json" },
        ...options,
      };
      try {
        const response = await fetch(url, config);
        const text = await response.text();
        return JSON.parse(text.trim());
      } catch (error) {
        console.error("API Error:", error);
        return { success: false, error: error.message };
      }
    },
    async searchHotels(query, filters = {}) {
      const params = { q: query, ...filters };
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/hotels.php?${queryString}`);
    },
    async getHotels() {
      return this.request("/hotels.php");
    },
    async checkAvailability(hotelId, checkIn, checkOut, guests, rooms) {
      const qs = `?action=availability&hotelId=${encodeURIComponent(hotelId)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guests)}&rooms=${encodeURIComponent(rooms)}`;
      return this.request(`/bookings.php${qs}`);
    },
    async createPayment(paymentData) {
      return this.request(`/payments.php?action=create`, {
        method: "POST",
        body: JSON.stringify(paymentData),
      });
    },
    async createBooking(bookingData) {
      return this.request(`/bookings.php?action=create`, {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
    },
  };

  // --- DOM Elements ---
  const hotelGrid = document.getElementById("hotels");
  const noResults = document.getElementById("noResults");
  const locationText = document.getElementById("locationText");
  const resultCount = document.getElementById("resultCount");
  const priceValue = document.getElementById("priceValue");
  const priceRange = document.getElementById("priceRange");
  const modal = document.getElementById("bookingModal");
  const modalContent = document.getElementById("modalContent");

  // --- Data State ---
  let allHotels = [];

  // --- Fetch & Render ---
  async function loadResults() {
    try {
      const stored = JSON.parse(localStorage.getItem("searchResults"));
      let hotels = [];
      if (stored && stored.hotels) {
        hotels = stored.hotels;
        locationText.textContent = stored.query || "All Hotels";
      } else {
        const res = await api.getHotels();
        hotels = res.data || [];
        locationText.textContent = "All Hotels";
      }
      allHotels = hotels;
      renderHotels(allHotels);
      updateResultCount(allHotels.length);
    } catch (e) {
      console.error(e);
      hotelGrid.innerHTML = `<div>Error loading hotels.</div>`;
    }
  }

  function renderHotels(list) {
    hotelGrid.innerHTML = "";
    if (!list || list.length === 0) {
      noResults.style.display = "block";
      return;
    }
    noResults.style.display = "none";
    list.forEach((h, index) => {
      const el = document.createElement("article");
      el.className = "card";
      const img =
        h.image ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
      el.innerHTML = `
        <div class="thumb" style="background-image:url(${img})"></div>
        <div class="content">
          <div class="card-header">
            <h3>${h.name}</h3>
            <div class="rating"><span class="stars">${"★".repeat(
              h.stars || 3
            )}</span></div>
          </div>
          <div class="meta">${h.city || ""}</div>
          <div class="desc">${h.description || ""}</div>
          <div class="price-row">
            <div class="price">₹ ${parseInt(h.price).toLocaleString()}<span class="per-night">/night</span></div>
            <div class="cta"><button class="btn btn-primary" data-id="${h.id}">Book Now</button></div>
          </div>
        </div>`;
      hotelGrid.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, index * 100);
    });

    document.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        openBooking(e.target.getAttribute("data-id"))
      );
    });
  }

  // --- Filter Functions ---
  function applyFilters() {
    const maxPrice = Number(priceRange.value);
    const starBtn = document.querySelector(".star.active");
    const starFilter =
      starBtn && starBtn.dataset.value !== "any"
        ? Number(starBtn.dataset.value)
        : null;

    const wifi = document.querySelector('input[name="wifi"]').checked;
    const pool = document.querySelector('input[name="pool"]').checked;
    const parking = document.querySelector('input[name="parking"]').checked;

    let filtered = allHotels.filter((h) => parseFloat(h.price) <= maxPrice);

    if (starFilter) filtered = filtered.filter((h) => h.stars == starFilter);
    if (wifi) filtered = filtered.filter((h) => h.amenities?.includes("wifi"));
    if (pool) filtered = filtered.filter((h) => h.amenities?.includes("pool"));
    if (parking)
      filtered = filtered.filter((h) => h.amenities?.includes("parking"));

    renderHotels(filtered);
    updateResultCount(filtered.length);
  }

  function updateResultCount(count) {
    resultCount.textContent = `• ${count} hotel${count !== 1 ? "s" : ""} found`;
  }

  // --- Filters UI Events ---
  priceRange.addEventListener("input", () => {
    priceValue.textContent = priceRange.value;
    applyFilters();
  });

  document.querySelectorAll(".star").forEach((star) => {
    star.addEventListener("click", function () {
      document
        .querySelectorAll(".star")
        .forEach((s) => s.classList.remove("active"));
      this.classList.add("active");
      applyFilters();
    });
  });

  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach((c) => c.addEventListener("change", applyFilters));

  // --- Booking Modal (aligned with index3 openBooking) ---
  async function openBooking(hotelId) {
    const h = allHotels.find((x) => x.id == hotelId);
    if (!h) return;

    // Require auth
    if (!currentUser) {
      if (confirm("Please sign in to continue with booking. Go to sign in page now?")) {
        window.location.href = "signin.html";
      }
      return;
    }

    modal.setAttribute("aria-hidden", "false");
    modalContent.innerHTML = `<div style="text-align:center;padding:2rem;"><div class="loading"></div><p>Loading hotel details...</p></div>`;

    // Build booking form
    modalContent.innerHTML = `
      <h3>Book: ${h.name}</h3>
      <p>${h.city || ""} • ${h.stars || 3}★</p>
      <p>${h.description || ""}</p>
      <form id="bookForm">
        <label>Full Name <input name="name" required value="${currentUser?.name || ""}"></label>
        <label>Email <input name="email" type="email" required value="${currentUser?.email || ""}"></label>
        <label>Check-in <input name="checkIn" type="date" required></label>
        <label>Check-out <input name="checkOut" type="date" required></label>
        <label>Guests <input name="guests" type="number" value="2" required></label>
        <label>Rooms <input name="rooms" type="number" value="1" required></label>
        <label>Payment Method
          <select name="paymentMethod">
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </label>
        <div style="margin-top:1rem;display:flex;gap:.5rem;">
          <button type="submit" class="btn btn-primary">Confirm & Pay</button>
          <button type="button" class="btn btn-ghost modal-close">Cancel</button>
        </div>
      </form>
    `;

    const bf = document.getElementById("bookForm");
    bf.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Processing...";
      submitBtn.disabled = true;

      try {
        const formData = new FormData(bf);
        const checkIn = formData.get("checkIn");
        const checkOut = formData.get("checkOut");
        const guests = parseInt(formData.get("guests"));
        const rooms = parseInt(formData.get("rooms"));
        const name = formData.get("name");
        const paymentMethod = formData.get("paymentMethod");

        // Availability
        const avail = await api.checkAvailability(hotelId, checkIn, checkOut, guests, rooms);
        if (!avail.success || !avail.data.isAvailable) {
          alert("Selected dates are not available.");
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          return;
        }

        // Calculate amount
        const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
        const totalAmount = parseFloat(h.price) * Math.max(1, nights) * Math.max(1, rooms);

        // Payment
        const payRes = await api.createPayment({
          user_id: currentUser ? currentUser.id : 0,
          amount: totalAmount,
          method: paymentMethod,
        });
        if (!payRes.success) {
          alert("Payment failed. Try again.");
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          return;
        }
        const payment_id = payRes.data.payment_id;

        // Booking
        const bookRes = await api.createBooking({
          user_id: currentUser ? currentUser.id : 0,
          hotel_id: hotelId,
          checkIn,
          checkOut,
          guests,
          rooms,
          payment_id,
        });

        if (bookRes.success) {
          modalContent.innerHTML = `
            <div style="text-align:center;padding:2rem;">
              <div style="font-size:4rem;">🎉</div>
              <h3 style="color:var(--accent);">Booking Confirmed!</h3>
              <p>Thank you, <strong>${name}</strong>!</p>
              <p>Booking Reference: <strong>${bookRes.data.booking_reference}</strong></p>
              <p>Total: ₹${bookRes.data.total_amount.toLocaleString()}</p>
              <button class="btn btn-primary modal-close" style="margin-top:1rem;">Close</button>
            </div>
          `;
        } else {
          alert("Booking failed: " + (bookRes.error || "Unknown error"));
        }
      } catch (err) {
        alert("Error: " + err.message);
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  document.querySelectorAll(".modal-close").forEach((btn) =>
    btn.addEventListener("click", () =>
      modal.setAttribute("aria-hidden", "true")
    )
  );

  // --- Initialize ---
  initUserState();
  loadResults();
})();
