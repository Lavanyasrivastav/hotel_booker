(function(){
  // Extended hotel dataset with more details
  const hotels = [
    {
      id: 1,
      name: 'SeaView Resort',
      city: 'Goa',
      price: 420,
      stars: 5,
      desc: 'Beachfront resort with infinity pool, spa, and ocean views. Perfect for romantic getaways and family vacations.',
      img: 'https://images.unsplash.com/photo-1501117716987-c8e2e2b0f47a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d7f6d0a3b7c8ad7a1a9e6ff9b8c2b6e',
      amenities: ['wifi', 'pool', 'parking', 'spa', 'restaurant'],
      location: 'Beach Road, Calangute, Goa',
      rating: 4.8,
      reviews: 1247
    },
    {
      id: 2,
      name: 'Urban Stay',
      city: 'Mumbai',
      price: 320,
      stars: 4,
      desc: 'Modern rooms in the city center with easy access to business districts and shopping areas.',
      img: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2c66f6f6e3f2b6a8a7c2d6b8f0a3b1c9',
      amenities: ['wifi', 'parking', 'gym', 'restaurant'],
      location: 'Bandra West, Mumbai',
      rating: 4.2,
      reviews: 892
    },
    {
      id: 3,
      name: 'Hilltop Inn',
      city: 'Manali',
      price: 270,
      stars: 3,
      desc: 'Cozy inn with mountain view, perfect for adventure seekers and nature lovers.',
      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1b36f7b4cb3f99c0f233d3b6a0cb3e9a',
      amenities: ['wifi', 'parking', 'restaurant'],
      location: 'Old Manali, Himachal Pradesh',
      rating: 4.0,
      reviews: 456
    },
    {
      id: 4,
      name: 'Lakeside Hotel',
      city: 'Udaipur',
      price: 500,
      stars: 5,
      desc: 'Luxury suites facing the lake with traditional Rajasthani architecture and modern amenities.',
      img: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=d1a2b3c4d5e6f7890a1b2c3d4e5f6a7b',
      amenities: ['wifi', 'pool', 'parking', 'spa', 'restaurant', 'boat-ride'],
      location: 'Lake Palace Road, Udaipur',
      rating: 4.9,
      reviews: 2034
    },
    {
      id: 5,
      name: 'Budget Rooms',
      city: 'Jaipur',
      price: 110,
      stars: 2,
      desc: 'Affordable clean rooms in the heart of the Pink City, close to major attractions.',
      img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7890abcd1234567890abcd1234567890',
      amenities: ['wifi', 'parking'],
      location: 'Bapu Nagar, Jaipur',
      rating: 3.5,
      reviews: 234
    },
    {
      id: 6,
      name: 'City Boutique',
      city: 'Pune',
      price: 360,
      stars: 4,
      desc: 'Boutique stay with great cafe, perfect for business travelers and weekend getaways.',
      img: 'https://images.unsplash.com/photo-1551892589-865f69869470?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcd1234ef567890abcd1234ef567890',
      amenities: ['wifi', 'parking', 'restaurant', 'cafe'],
      location: 'Koregaon Park, Pune',
      rating: 4.3,
      reviews: 567
    },
    {
      id: 7,
      name: 'Heritage Palace',
      city: 'Jaipur',
      price: 650,
      stars: 5,
      desc: 'Royal heritage hotel with traditional Rajasthani hospitality and modern luxury.',
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1234567890abcdef1234567890abcdef',
      amenities: ['wifi', 'pool', 'parking', 'spa', 'restaurant', 'heritage-tour'],
      location: 'C-Scheme, Jaipur',
      rating: 4.7,
      reviews: 1890
    },
    {
      id: 8,
      name: 'Beach House',
      city: 'Goa',
      price: 380,
      stars: 4,
      desc: 'Charming beach house with private access to pristine beaches and water sports.',
      img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890abcdef1234567890',
      amenities: ['wifi', 'parking', 'beach-access', 'water-sports'],
      location: 'Morjim Beach, North Goa',
      rating: 4.4,
      reviews: 723
    }
  ];

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('q') || '';
  const checkin = urlParams.get('checkin') || '';
  const checkout = urlParams.get('checkout') || '';
  const guests = urlParams.get('guests') || '2';

  // DOM elements
  const hotelGrid = document.getElementById('hotels');
  const noResults = document.getElementById('noResults');
  const locationText = document.getElementById('locationText');
  const resultCount = document.getElementById('resultCount');
  const priceValue = document.getElementById('priceValue');
  const priceRange = document.getElementById('priceRange');
  const modal = document.getElementById('bookingModal');
  const modalContent = document.getElementById('modalContent');

  // Search and filter hotels
  function performSearch() {
    const query = document.getElementById('q').value.trim().toLowerCase();
    const maxPrice = Number(priceRange.value);
    const selectedGuests = document.getElementById('guests').value;
    
    console.log('Performing search with query:', query);
    console.log('Max price:', maxPrice);
    
    let filtered = hotels.filter(h => {
      // If there's a search query, it must match hotel name, city, or location
      const nameMatch = h.name.toLowerCase().includes(query);
      const cityMatch = h.city.toLowerCase().includes(query);
      const locationMatch = h.location.toLowerCase().includes(query);
      
      const matchesQuery = !query || nameMatch || cityMatch || locationMatch;
      const matchesPrice = h.price <= maxPrice;
      
      // Debug: Log each hotel's matching status
      if (query) {
        console.log(`Hotel: ${h.name}`);
        console.log(`  Name match: ${nameMatch}`);
        console.log(`  City match: ${cityMatch}`);
        console.log(`  Location match: ${locationMatch}`);
        console.log(`  Overall match: ${matchesQuery}`);
        console.log(`  Price match: ${matchesPrice}`);
      }
      
      // Both conditions must be true
      return matchesQuery && matchesPrice;
    });

    // Apply star rating filter
    const selectedStars = document.querySelector('.star.active');
    if (selectedStars && selectedStars.dataset.value !== 'any') {
      const starValue = Number(selectedStars.dataset.value);
      filtered = filtered.filter(h => h.stars === starValue);
    }

    // Apply amenities filter
    const wifiCheckbox = document.querySelector('input[name="wifi"]');
    const poolCheckbox = document.querySelector('input[name="pool"]');
    const parkingCheckbox = document.querySelector('input[name="parking"]');
    
    if (wifiCheckbox.checked) {
      filtered = filtered.filter(h => h.amenities.includes('wifi'));
    }
    if (poolCheckbox.checked) {
      filtered = filtered.filter(h => h.amenities.includes('pool'));
    }
    if (parkingCheckbox.checked) {
      filtered = filtered.filter(h => h.amenities.includes('parking'));
    }

    // Debug: Log the filtering results
    console.log('Original hotels count:', hotels.length);
    console.log('Filtered hotels count:', filtered.length);
    console.log('Filtered hotels:', filtered);
    
    renderHotels(filtered);
    updateResultCount(filtered.length);
  }

  // Test search function for debugging
  window.testSearch = function(query) {
    console.log('Testing search with query:', query);
    document.getElementById('q').value = query;
    locationText.textContent = query || 'All locations';
    
    // Add smooth transition effect
    const searchHeader = document.querySelector('.search-header');
    searchHeader.style.transform = 'scale(0.98)';
    setTimeout(() => {
      searchHeader.style.transform = 'scale(1)';
    }, 150);
    
    performSearch();
  };

  // Add scroll animations for search results
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all cards and filter groups
    const animatedElements = document.querySelectorAll('.card, .filter-group');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });
  }

  // Enhanced hotel rendering with staggered animation
  function renderHotels(list) {
    hotelGrid.innerHTML = '';
    
    if (list.length === 0) {
      noResults.style.display = 'block';
      noResults.style.opacity = '0';
      noResults.style.transform = 'translateY(20px)';
      setTimeout(() => {
        noResults.style.opacity = '1';
        noResults.style.transform = 'translateY(0)';
      }, 100);
      return;
    }
    
    noResults.style.display = 'none';
    
    list.forEach((h, index) => {
      const el = document.createElement('article');
      el.className = 'card';
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.innerHTML = `
        <div class="thumb" style="background-image:url(${h.img})"></div>
        <div class="content">
          <div class="card-header">
            <h3>${h.name}</h3>
            <div class="rating">
              <span class="stars">${'★'.repeat(h.stars)}</span>
              <span class="rating-score">${h.rating}</span>
              <span class="reviews">(${h.reviews} reviews)</span>
            </div>
          </div>
          <div class="meta">${h.city} • ${h.location}</div>
          <div class="desc">${h.desc}</div>
          <div class="amenities-tags">
            ${h.amenities.slice(0, 3).map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
            ${h.amenities.length > 3 ? `<span class="amenity-tag">+${h.amenities.length - 3} more</span>` : ''}
          </div>
          <div class="price-row">
            <div class="price">₹ ${h.price}<span class="per-night">/night</span></div>
            <div class="cta"><button class="btn btn-primary" data-id="${h.id}">Book Now</button></div>
          </div>
        </div>
      `;
      hotelGrid.appendChild(el);
      
      // Staggered animation for cards
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // Update result count
  function updateResultCount(count) {
    resultCount.textContent = ` • ${count} hotel${count !== 1 ? 's' : ''} found`;
  }

  // Enhanced search form with loading state
  document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Add loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Searching...';
    submitBtn.disabled = true;
    
    const formData = new FormData(this);
    const params = new URLSearchParams(formData);
    
    // Debug: Log the form submission
    console.log('Form submitted with data:', Object.fromEntries(formData));
    console.log('URL params:', params.toString());
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      window.location.href = `search-results.html?${params.toString()}`;
    }, 800);
  });

  // Enhanced price range with smooth updates
  priceRange.addEventListener('input', function() {
    const value = this.value;
    priceValue.textContent = value;
    
    // Add smooth color transition based on value
    const percentage = (value - this.min) / (this.max - this.min) * 100;
    this.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percentage}%, #e6e9ee ${percentage}%, #e6e9ee 100%)`;
    
    // Trigger search with debouncing
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      performSearch();
    }, 300);
  });

  // Enhanced star rating filter with animations
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
      // Add click animation
      this.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
      
      // Trigger search
      performSearch();
    });
    if (this.dataset.value === 'any') {
      this.classList.add('active');
    }
  });

  // Enhanced amenities filter with smooth transitions
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      // Add smooth transition effect
      this.parentElement.style.transform = 'scale(1.05)';
      setTimeout(() => {
        this.parentElement.style.transform = 'scale(1)';
      }, 150);
      
      performSearch();
    });
  });

  // Enhanced booking modal with smooth animations
  function openBooking(id) {
    const hotel = hotels.find(h => h.id === id);
    if (!hotel) return;
    
    // Add loading state to modal
    modalContent.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div class="loading" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
        <p>Loading booking form...</p>
      </div>
    `;
    
    modal.setAttribute('aria-hidden', 'false');

    // Simulate loading for better UX
    setTimeout(() => {
      modalContent.innerHTML = `
        <h3>Book: ${hotel.name}</h3>
        <p class="small">${hotel.city} • ${hotel.stars}★ • ${hotel.rating}/5 (${hotel.reviews} reviews)</p>
        <p>${hotel.desc}</p>
        <div class="hotel-details">
          <p><strong>Location:</strong> ${hotel.location}</p>
          <p><strong>Amenities:</strong> ${hotel.amenities.join(', ')}</p>
        </div>
        <form id="bookForm">
          <div class="form-row">
            <label>Full name <input required name="name" /></label>
            <label>Email <input required name="email" type="email" /></label>
          </div>
          <div class="form-row">
            <label>Check-in <input required name="checkin" type="date" value="${document.getElementById('checkin').value}" /></label>
            <label>Check-out <input required name="checkout" type="date" value="${document.getElementById('checkout').value}" /></label>
          </div>
          <div class="form-row">
            <label>Guests <select name="guests" required>
              <option value="1" ${document.getElementById('guests').value === '1' ? 'selected' : ''}>1 guest</option>
              <option value="2" ${document.getElementById('guests').value === '2' ? 'selected' : ''}>2 guests</option>
              <option value="3" ${document.getElementById('guests').value === '3' ? 'selected' : ''}>3 guests</option>
              <option value="4" ${document.getElementById('guests').value === '4' ? 'selected' : ''}>4 guests</option>
            </select></label>
            <label>Rooms <select name="rooms" required>
              <option value="1">1 room</option>
              <option value="2">2 rooms</option>
              <option value="3">3 rooms</option>
            </select></label>
          </div>
          <div class="total-price">
            <strong>Total: ₹${hotel.price}</strong>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Confirm Booking</button>
            <button type="button" class="btn btn-ghost modal-close">Cancel</button>
          </div>
        </form>
      `;
      
      // Handle form submission
      const bookForm = document.getElementById('bookForm');
      bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;
        
        const formData = new FormData(bookForm);
        
        // Simulate processing delay
        setTimeout(() => {
          // Show success message with animation
          modalContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
              <h3 style="color: var(--accent);">Booking Confirmed!</h3>
              <p>Thank you, <strong>${formData.get('name')}</strong>!</p>
              <p>Your booking for <strong>${hotel.name}</strong> has been confirmed.</p>
              <p>A confirmation email has been sent to <strong>${formData.get('email')}</strong></p>
              <p><strong>Booking Details:</strong></p>
              <ul style="text-align: left; max-width: 300px; margin: 1rem auto;">
                <li>Check-in: ${formData.get('checkin')}</li>
                <li>Check-out: ${formData.get('checkout')}</li>
                <li>Guests: ${formData.get('guests')}</li>
                <li>Rooms: ${formData.get('rooms')}</li>
              </ul>
              <button class="btn btn-primary modal-close" style="margin-top: 1rem;">Close</button>
            </div>
          `;
          
          setTimeout(() => {
            closeModal();
          }, 5000);
        }, 1500);
      });
    }, 500);
  }

  // Enhanced booking modal events with smooth interactions
  document.body.addEventListener('click', function(e) {
    const target = e.target;
    if (target.matches('.btn-primary') && target.dataset.id) {
      const id = Number(target.dataset.id);
      
      // Add click animation
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = 'scale(1)';
      }, 150);
      
      openBooking(id);
    }
    if (target.classList.contains('modal-close')) {
      closeModal();
    }
  });

  // Enhanced sign-in button with animation
  const signinBtn = document.getElementById('signinBtn');
  if (signinBtn) {
    signinBtn.addEventListener('click', function() {
      // Add click animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
        window.location.href = 'signin.html';
      }, 150);
    });
  }

  // Enhanced keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    
    // Add smooth scrolling with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      window.scrollBy({ top: 100, behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      window.scrollBy({ top: -100, behavior: 'smooth' });
    }
  });

  // Close modal
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
  }

  // Initialize enhanced features
  function initEnhancedFeatures() {
    initScrollAnimations();
    
    // Add page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease-in';
      document.body.style.opacity = '1';
    }, 100);
  }

  // Initialize page with enhanced features
  function initPage() {
    // Set form values from URL parameters
    document.getElementById('q').value = searchQuery;
    document.getElementById('checkin').value = checkin;
    document.getElementById('checkout').value = checkout;
    document.getElementById('guests').value = guests;
    
    // Set location text
    locationText.textContent = searchQuery || 'All locations';
    
    // Debug: Log the search parameters
    console.log('Search Query:', searchQuery);
    console.log('Check-in:', checkin);
    console.log('Check-out:', checkout);
    console.log('Guests:', guests);
    
    // If no search query, show all hotels
    if (!searchQuery) {
      console.log('No search query provided, showing all hotels');
      renderHotels(hotels);
      updateResultCount(hotels.length);
    } else {
      // Perform initial search
      performSearch();
    }
    
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Initialize enhanced features
    initEnhancedFeatures();
  }

  // Initialize page
  initPage();
})();
