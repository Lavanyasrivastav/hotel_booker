
(function(){
  // sample dataset - in real app this would come from API
  const hotels = [
    {id:1,name:'SeaView Resort',city:'Goa',price:420,stars:5,desc:'Beachfront resort with infinity pool',img:'https://images.unsplash.com/photo-1501117716987-c8e2e2b0f47a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0d7f6d0a3b7c8ad7a1a9e6ff9b8c2b6e'},
    {id:2,name:'Urban Stay',city:'Mumbai',price:320,stars:4,desc:'Modern rooms in the city center',img:'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2c66f6f6e3f2b6a8a7c2d6b8f0a3b1c9'},
    {id:3,name:'Hilltop Inn',city:'Manali',price:270,stars:3,desc:'Cozy inn with mountain view',img:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1b36f7b4cb3f99c0f233d3b6a0cb3e9a'},
    {id:4,name:'Lakeside Hotel',city:'Udaipur',price:500,stars:5,desc:'Luxury suites facing the lake',img:'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=d1a2b3c4d5e6f7890a1b2c3d4e5f6a7b'},
    {id:5,name:'Budget Rooms',city:'Jaipur',price:110,stars:2,desc:'Affordable clean rooms',img:'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7890abcd1234567890abcd1234567890'},
    {id:6,name:'City Boutique',city:'Pune',price:360,stars:4,desc:'Boutique stay with great cafe',img:'https://images.unsplash.com/photo-1551892589-865f69869470?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcd1234ef567890abcd1234ef567890'}
  ];

  // render helpers
  const hotelGrid = document.getElementById('hotels');
  const dealList = document.getElementById('dealList');
  const priceValue = document.getElementById('priceValue');
  const priceRange = document.getElementById('priceRange');
  const modal = document.getElementById('bookingModal');
  const modalContent = document.getElementById('modalContent');

  // Add smooth scroll behavior for navigation links
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Add scroll animations
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

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.card, .filter-group, .deal, .about, .deals');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });
  }

  // Enhanced hotel rendering with staggered animation
  function renderHotels(list){
    hotelGrid.innerHTML = '';
    list.forEach((h, index) => {
      const el = document.createElement('article');
      el.className = 'card';
      el.style.animationDelay = `${index * 0.1}s`;
      el.innerHTML = `
        <div class="thumb" style="background-image:url(${h.img})"></div>
        <div class="content">
          <h3>${h.name}</h3>
          <div class="meta">${h.city} • ${h.stars}★</div>
          <div class="desc">${h.desc}</div>
          <div class="price-row">
            <div class="price">₹ ${h.price}</div>
            <div class="cta"><button class="btn btn-primary" data-id="${h.id}">Book</button></div>
          </div>
        </div>
      `;
      hotelGrid.appendChild(el);
      
      // Add staggered animation
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  function renderDeals(){
    dealList.innerHTML = '';
    hotels.slice(0,3).forEach((h, index) => {
      const d = document.createElement('div'); 
      d.className='deal';
      d.style.animationDelay = `${index * 0.2}s`;
      d.innerHTML = `<strong>${h.name}</strong><div>${h.city}</div><div class="small">From ₹${h.price}/night</div>`;
      dealList.appendChild(d);
      
      // Add staggered animation
      setTimeout(() => {
        d.style.opacity = '1';
        d.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  // Enhanced search form with loading state
  const form = document.getElementById('searchForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    
    // Add loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Searching...';
    submitBtn.disabled = true;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const formData = new FormData(this);
      const params = new URLSearchParams(formData);
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
  });

  // Enhanced star rating interaction
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
      // Add click animation
      this.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // Update active state
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Enhanced booking modal with smooth animations
  function openBooking(id){
    const hotel = hotels.find(h=>h.id===id);
    if(!hotel) return;
    
    // Add loading state to modal
    modalContent.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div class="loading" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
        <p>Loading booking form...</p>
      </div>
    `;
    
    modal.setAttribute('aria-hidden','false');

    // Simulate loading for better UX
    setTimeout(() => {
      modalContent.innerHTML = `
        <h3>Book: ${hotel.name}</h3>
        <p class="small">${hotel.city} • ${hotel.stars}★</p>
        <p>${hotel.desc}</p>
        <form id="bookForm">
          <label>Full name <input required name="name" /></label>
          <label>Email <input required name="email" type="email" /></label>
          <label>Rooms <select name="rooms"><option>1</option><option>2</option></select></label>
          <div style="display:flex;gap:.6rem;margin-top:.8rem">
            <button type="submit" class="btn btn-primary">Confirm</button>
            <button type="button" class="btn btn-ghost modal-close">Cancel</button>
          </div>
        </form>
      `;

      const bf = document.getElementById('bookForm');
      bf.addEventListener('submit', function(ev){
        ev.preventDefault();
        
        // Add loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;
        
        const formData = new FormData(bf);
        
        // Simulate processing delay
        setTimeout(() => {
          // Show success message with animation
          modalContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
              <h3 style="color: var(--accent);">Booking Confirmed!</h3>
              <p>Thanks, <strong>${formData.get('name')}</strong>!</p>
              <p>A confirmation has been sent to <strong>${formData.get('email')}</strong></p>
              <button class="btn btn-primary modal-close" style="margin-top: 1rem;">Close</button>
            </div>
          `;
          
          setTimeout(closeModal, 3000);
        }, 1500);
      });
    }, 500);
  }

  function closeModal(){ 
    modal.setAttribute('aria-hidden','true');
  }

  // Enhanced event delegation with smooth interactions
  document.body.addEventListener('click', function(e){
    const target = e.target;
    if(target.matches('.btn-primary') && target.dataset.id){
      const id = Number(target.dataset.id);
      
      // Add click animation
      target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        target.style.transform = 'scale(1)';
      }, 150);
      
      openBooking(id);
    }
    if(target.classList.contains('modal-close')) closeModal();
  });

  // Sign-in button functionality
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
    if(e.key === 'Escape') closeModal();
    
    // Add smooth scrolling with arrow keys
    if(e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      window.scrollBy({ top: 100, behavior: 'smooth' });
    }
    if(e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      window.scrollBy({ top: -100, behavior: 'smooth' });
    }
  });

  // Add parallax effect to hero image
  function initParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroImage = document.querySelector('.hero-right img');
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    });
  }

  // Initialize all enhanced features
  function init() {
    document.getElementById('year').textContent = new Date().getFullYear();
    renderHotels(hotels);
    renderDeals();
    initSmoothScroll();
    initScrollAnimations();
    initParallax();
    
    // Add page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease-in';
      document.body.style.opacity = '1';
    }, 100);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();