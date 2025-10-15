// ======================================
// HotelBooker Frontend (PHP Backend Connected + Payment + Booking)
// ======================================

(function () {
  // --------------------------
  // 1️⃣ Base Configuration
  // --------------------------
  const API_BASE_URL = "http://localhost/hotel-booker/backend";

  let currentUser = null;
  let authToken = localStorage.getItem("authToken");

  // --------------------------
  // 2️⃣ API Helper
  // --------------------------
  const api = {
    async request(endpoint, options = {}) {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      };
      try {
        const response = await fetch(url, config);
        const text = await response.text();
        const data = JSON.parse(text.trim());
        return data;
      } catch (error) {
        console.error("API Error:", error);
        return { success: false, error: error.message };
      }
    },

    // --------------------------
    // 🏨 Hotels
    // --------------------------
    async getHotels(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/hotels.php?${queryString}`);
    },

    async searchHotels(query, filters = {}) {
      const params = { q: query, ...filters };
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/hotels.php?${queryString}`);
    },

    async getFeaturedHotels() {
      const all = await this.getHotels();
      if (all.success) {
        const sorted = all.data.sort((a, b) => b.stars - a.stars);
        return { success: true, data: sorted.slice(0, 3) };
      }
      return all;
    },

    // --------------------------
    // 👤 Authentication
    // --------------------------
    async login(email, password) {
      const response = await this.request(`/auth.php?action=login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (response.success) {
        currentUser = response.user;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
      return response;
    },

    async register(userData) {
      const response = await this.request(`/auth.php?action=register`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
      if (response.success) alert("Registration successful!");
      return response;
    },

    async logout() {
      currentUser = null;
      localStorage.removeItem("user");
      updateAuthUI();
    },

    async getCurrentUser() {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    },

    // --------------------------
    // 💳 Payments
    // --------------------------
    async createPayment(paymentData) {
      // { user_id, amount, method }
      return this.request(`/payments.php?action=create`, {
        method: "POST",
        body: JSON.stringify(paymentData),
      });
    },

    async getPaymentStatus(paymentRef) {
      return this.request(`/payments.php?action=status&ref=${encodeURIComponent(paymentRef)}`);
    },

    // --------------------------
    // 📅 Bookings
    // --------------------------
    async checkAvailability(hotelId, checkIn, checkOut, guests, rooms) {
      const qs = `?action=availability&hotelId=${encodeURIComponent(hotelId)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guests)}&rooms=${encodeURIComponent(rooms)}`;
      return this.request(`/bookings.php${qs}`);
    },

    async createBooking(bookingData) {
      return this.request(`/bookings.php?action=create`, {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
    },
  };

  // --------------------------
  // 3️⃣ UI Elements
  // --------------------------
  const hotelGrid = document.getElementById("hotels");
  const dealList = document.getElementById("dealList");
  const priceValue = document.getElementById("priceValue");
  const priceRange = document.getElementById("priceRange");
  const modal = document.getElementById("bookingModal");
  const modalContent = document.getElementById("modalContent");
  const signinBtn = document.getElementById("signinBtn");

  // --------------------------
  // 4️⃣ Auth UI Management
  // --------------------------
  function initUserState() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) currentUser = JSON.parse(savedUser);
    updateAuthUI();
  }

  function updateAuthUI() {
    if (!signinBtn) return;
    if (currentUser) {
      signinBtn.textContent = currentUser.name || "Account";
      signinBtn.onclick = () => {
        if (confirm("Do you want to log out?")) api.logout();
      };
    } else {
      signinBtn.textContent = "Sign in";
      signinBtn.onclick = () => (window.location.href = "signin.html");
    }
  }

  // --------------------------
  // 5️⃣ Rendering Functions
  // --------------------------
  async function renderHotels(hotels) {
    hotelGrid.innerHTML = "";
    if (!hotels || hotels.length === 0) {
      hotelGrid.innerHTML = `<div class="no-results">No hotels found.</div>`;
      return;
    }
    hotels.forEach((hotel, index) => {
      const el = document.createElement("article");
      el.className = "card";
      const img =
        hotel.image ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
      el.innerHTML = `
        <div class="thumb" style="background-image:url(${img})"></div>
        <div class="content">
          <h3>${hotel.name}</h3>
          <div class="meta">${hotel.city || ""} ${hotel.state ? ", " + hotel.state : ""} • ${hotel.stars || 3}★</div>
          <div class="desc">${hotel.description || ""}</div>
          <div class="price-row">
            <div class="price">₹ ${parseInt(hotel.price).toLocaleString()}</div>
            <div class="cta"><button class="btn btn-primary" data-id="${hotel.id}">Book</button></div>
          </div>
        </div>
      `;
      hotelGrid.appendChild(el);
    });

    hotelGrid.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        openBooking(e.target.getAttribute("data-id"))
      );
    });
  }

  function renderDeals(hotels) {
    dealList.innerHTML = "";
    if (!hotels || hotels.length === 0) {
      dealList.innerHTML = `<div class="no-deals">No deals available.</div>`;
      return;
    }
    hotels.forEach((h) => {
      const div = document.createElement("div");
      div.className = "deal";
      div.innerHTML = `<strong>${h.name}</strong><div>${h.city}</div>
      <div class="small">From ₹${h.price}/night</div>`;
      dealList.appendChild(div);
    });
  }

  // --------------------------
  // 6️⃣ Load Data on Home
  // --------------------------
  async function loadHotels() {
    try {
      const response = await api.getHotels();
      if (response.success) renderHotels(response.data);
      else hotelGrid.innerHTML = `<div>Error loading hotels.</div>`;
    } catch (e) {
      console.error(e);
    }
  }

  async function loadDeals() {
    try {
      const response = await api.getFeaturedHotels();
      if (response.success) renderDeals(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  // --------------------------
  // 7️⃣ Booking Modal with Payment
  // --------------------------
  async function openBooking(hotelId) {
    // Require auth before opening booking modal
    if (!currentUser) {
      if (confirm('Please sign in to continue with booking. Go to sign in page now?')) {
        window.location.href = 'signin.html';
      }
      return;
    }
    modal.setAttribute("aria-hidden", "false");
    modalContent.innerHTML = `<div style="text-align:center;padding:2rem;"><div class="loading"></div><p>Loading hotel details...</p></div>`;
    try {
      const response = await api.getHotels();
      const hotel = response.data.find((h) => h.id == hotelId);
      if (!hotel) throw new Error("Hotel not found");

      modalContent.innerHTML = `
        <h3>Book: ${hotel.name}</h3>
        <p>${hotel.city} • ${hotel.stars}★</p>
        <p>${hotel.description}</p>
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

          // 1️⃣ Check Availability
          const avail = await api.checkAvailability(hotelId, checkIn, checkOut, guests, rooms);
          if (!avail.success || !avail.data.isAvailable) {
            alert("Selected dates are not available.");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
          }

          // 2️⃣ Simulate payment
          const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
          const totalAmount = parseFloat(hotel.price) * Math.max(1, nights) * Math.max(1, rooms);
          const payRes = await api.createPayment({
            user_id: currentUser ? currentUser.id : 0,
            amount: totalAmount,
            method: paymentMethod
          });

          if (!payRes.success) {
            alert("Payment failed. Try again.");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
          }

          const payment_id = payRes.data.payment_id;
          // 3️⃣ Create Booking
          const bookingData = {
            'user_id': currentUser ? currentUser.id : 0,
            'hotel_id': hotelId,
            'checkIn':checkIn,
            'checkOut':checkOut,
            'guests':guests,
            'rooms':rooms,
            'payment_id':payment_id,
          };

          const bookRes = await api.createBooking(bookingData);

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
    } catch (e) {
      modalContent.innerHTML = `<div>Error loading booking form.</div>`;
    }
  }

  // --------------------------
  // 8️⃣ Events
  // --------------------------
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () =>
      modal.setAttribute("aria-hidden", "true")
    );
  });

  priceRange?.addEventListener("input", (e) => {
    priceValue.textContent = e.target.value;
  });

  const form = document.getElementById("searchForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const query = formData.get("q");
      const checkIn = formData.get("checkin");
      const checkOut = formData.get("checkout");
      const guests = formData.get("guests");

      if (!query.trim()) {
        alert("Enter a destination.");
        return;
      }

      const response = await api.searchHotels(query, {
        checkIn,
        checkOut,
        guests,
      });

      if (response.success) {
        localStorage.setItem(
          "searchResults",
          JSON.stringify({
            hotels: response.data,
            query,
            filters: { checkIn, checkOut, guests },
          })
        );
        window.location.href = "search-results.html";
      } else {
        alert("Search failed. Try again.");
      }
    });
  }

  // --------------------------
  // 9️⃣ Init
  // --------------------------
  initUserState();
  if (hotelGrid) loadHotels();
  if (dealList) loadDeals();
})();
