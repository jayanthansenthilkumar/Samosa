/**
 * SamosaSheet - Interactive JavaScript Engine
 * Modern Vanilla JS implementation for Dual Theme Switcher, Dropdowns, Navigation, Modals, Pack Calculator, and WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDropdowns();
  initNavigation();
  initPackCalculator();
  initWhatsAppModal();
  initRecipeTabs();
  initFaqAccordion();
  initBulkForm();
  initScrollAnimations();
});

/* -------------------------------------------------------------------------- */
/* 0. Dual Theme Switcher (Dark & Light)                                     */
/* -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtnDesktop = document.getElementById('themeToggleBtn');
  const themeBtnMobile = document.getElementById('themeToggleBtnMobile');
  const storedTheme = localStorage.getItem('samosa_theme');

  // Default to light theme if not set
  const currentTheme = storedTheme || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  function toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('samosa_theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Royal Obsidian Dark' : 'Warm Gourmet Light'} Theme 🎨`);
  }

  if (themeBtnDesktop) themeBtnDesktop.addEventListener('click', toggleTheme);
  if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleTheme);
}

/* -------------------------------------------------------------------------- */
/* 0.5 Desktop Dropdown Navigation                                           */
/* -------------------------------------------------------------------------- */
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = toggle.closest('.nav-dropdown');
      const menu = parent.querySelector('.dropdown-menu');
      const isOpen = menu.classList.contains('open');

      // Close all other dropdowns
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
      dropdowns.forEach(d => d.classList.remove('active'));

      if (!isOpen) {
        menu.classList.add('open');
        parent.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
    dropdowns.forEach(d => d.classList.remove('active'));
    dropdownToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
  });

  // Close dropdown when clicking any item inside
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
      dropdowns.forEach(d => d.classList.remove('active'));
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 1. Navigation & Mobile Drawer                                              */
/* -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('mobileNavToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link, .dropdown-item');

  // Sticky header class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Toggle
  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // Close drawer on link click & smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Highlight active section on scroll (IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* -------------------------------------------------------------------------- */
/* 2. Interactive Samosa Sheet Pack Calculator                                */
/* -------------------------------------------------------------------------- */
function initPackCalculator() {
  const guestInput = document.getElementById('calcGuests');
  const perGuestSelect = document.getElementById('calcPerGuest');
  const sizeSelect = document.getElementById('calcSize');
  const resultPacks = document.getElementById('calcResultPacks');
  const resultSamosas = document.getElementById('calcResultSamosas');
  const resultFlour = document.getElementById('calcResultFlour');

  if (!guestInput || !resultPacks) return;

  function calculate() {
    const guests = parseInt(guestInput.value) || 0;
    const perGuest = parseInt(perGuestSelect.value) || 2;
    const totalSamosas = guests * perGuest;
    const sheetsPerPack = 100;

    // Packs required (rounded up)
    const packsNeeded = Math.ceil(totalSamosas / sheetsPerPack) || (guests > 0 ? 1 : 0);
    const flourPasteTbsp = Math.round(totalSamosas * 0.5);

    // Animate number updates
    resultPacks.textContent = packsNeeded;
    if (resultSamosas) resultSamosas.textContent = `${totalSamosas} Samosas`;
    if (resultFlour) resultFlour.textContent = `~${flourPasteTbsp} tbsp flour paste for sealing`;
  }

  guestInput.addEventListener('input', calculate);
  perGuestSelect.addEventListener('change', calculate);
  sizeSelect.addEventListener('change', calculate);

  // Initial computation
  calculate();
}

/* -------------------------------------------------------------------------- */
/* 3. Custom WhatsApp Order Modal                                             */
/* -------------------------------------------------------------------------- */
function initWhatsAppModal() {
  const modalOverlay = document.getElementById('orderModalOverlay');
  const modalClose = document.getElementById('modalCloseBtn');
  const orderBtns = document.querySelectorAll('.trigger-order-modal');
  const modalProductSelect = document.getElementById('modalProductSize');
  const modalQtyInput = document.getElementById('modalQty');
  const qtyMinus = document.getElementById('modalQtyMinus');
  const qtyPlus = document.getElementById('modalQtyPlus');
  const sendWaBtn = document.getElementById('sendWaOrderBtn');
  const customerName = document.getElementById('modalCustomerName');
  const customerCity = document.getElementById('modalCustomerCity');
  const customerNote = document.getElementById('modalCustomerNote');

  if (!modalOverlay) return;

  function openModal(sizeName) {
    if (sizeName && modalProductSelect) {
      modalProductSelect.value = sizeName;
    }
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const size = btn.getAttribute('data-product-size') || '7 x 7 inch';
      openModal(size);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Quantity adjustments
  if (qtyMinus && qtyPlus && modalQtyInput) {
    qtyMinus.addEventListener('click', () => {
      let val = parseInt(modalQtyInput.value) || 1;
      if (val > 1) modalQtyInput.value = val - 1;
    });
    qtyPlus.addEventListener('click', () => {
      let val = parseInt(modalQtyInput.value) || 1;
      modalQtyInput.value = val + 1;
    });
  }

  // Construct WhatsApp Message and launch wa.me link
  if (sendWaBtn) {
    sendWaBtn.addEventListener('click', () => {
      const size = modalProductSelect ? modalProductSelect.value : '7 x 7 inch';
      const qty = modalQtyInput ? modalQtyInput.value : '1';
      const name = customerName && customerName.value.trim() ? customerName.value.trim() : 'Customer';
      const city = customerCity && customerCity.value.trim() ? customerCity.value.trim() : 'Chennai';
      const note = customerNote && customerNote.value.trim() ? customerNote.value.trim() : 'None';

      const phone = '919095333944';
      const message = `Hello Karpagam Foods / SamosaSheet! 👋%0A%0AI would like to place an order for ready-made samosa sheets:%0A%0A📦 *Product Size:* ${encodeURIComponent(size)}%0A🔢 *Quantity:* ${qty} Pack(s) (100 sheets per pack)%0A👤 *Name:* ${encodeURIComponent(name)}%0A📍 *Delivery Location:* ${encodeURIComponent(city)}%0A📝 *Special Instructions:* ${encodeURIComponent(note)}%0A%0APlease confirm availability and total price including delivery. Thank you!`;

      const waUrl = `https://wa.me/${phone}?text=${message}`;
      window.open(waUrl, '_blank');
      closeModal();
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 4. Recipe & Filling Tabs Switcher                                          */
/* -------------------------------------------------------------------------- */
function initRecipeTabs() {
  const tabs = document.querySelectorAll('.recipe-tab-btn');
  const recipeTitle = document.getElementById('recipeTitle');
  const recipeDesc = document.getElementById('recipeDesc');
  const recipeIngredients = document.getElementById('recipeIngredients');

  if (!tabs.length || !recipeTitle) return;

  const recipeData = {
    potato: {
      title: 'Classic Spiced Potato & Green Peas (Aloo Samosa)',
      desc: 'The timeless North & South Indian favorite. Boiled potatoes infused with cumin, ginger, amchur (dry mango powder), and crunchy green peas wrapped in crispy sheets.',
      ingredients: ['3 Large Boiled Potatoes', '1/2 Cup Green Peas', '1 tsp Cumin & Mustard seeds', '1/2 tsp Garam Masala', 'Fresh Coriander']
    },
    paneer: {
      title: 'Paneer Tikka & Capsicum Samosa',
      desc: 'Rich cottage cheese cubes tossed in spicy tandoori masala, caramelized onions, and diced bell peppers for a gourmet snack.',
      ingredients: ['200g Paneer (diced)', '1/2 Red & Green Capsicum', '1 tbsp Tikka Masala Paste', '1/2 tsp Chaat Masala', '1 tbsp Butter']
    },
    chicken: {
      title: 'Hyderabadi Spiced Chicken Keema Samosa',
      desc: 'Savory minced chicken slow-cooked with aromatic garam masala, green chillies, mint, and fried onions for a crispy savory bite.',
      ingredients: ['300g Chicken Mince (Keema)', '1 Large Onion (finely chopped)', '1 tbsp Ginger-Garlic Paste', '1/2 tsp Red Chilli Powder', 'Fresh Mint Leaves']
    },
    cheese: {
      title: 'Creamy Sweet Corn & Melted Cheese Samosa',
      desc: 'A fusion delight filled with sweet corn kernels, mozzarella, cheddar cheese, oregano, and black pepper. Loved by kids and adults alike.',
      ingredients: ['1 Cup Boiled Sweet Corn', '1/2 Cup Mozzarella Cheese', '1/4 Cup Processed Cheese', '1/2 tsp Oregano & Chilli Flakes', 'Pinch of Black Pepper']
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-recipe');
      const data = recipeData[key];
      if (data) {
        recipeTitle.textContent = data.title;
        recipeDesc.textContent = data.desc;
        if (recipeIngredients) {
          recipeIngredients.innerHTML = data.ingredients.map(ing => `<li><i class="ri-checkbox-circle-fill" style="color:var(--accent-gold); margin-right: 0.35rem;"></i> ${ing}</li>`).join('');
        }
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 5. FAQ Accordion Logic                                                     */
/* -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Bulk Order Wholesale Form                                               */
/* -------------------------------------------------------------------------- */
function initBulkForm() {
  const bulkForm = document.getElementById('bulkEnquiryForm');

  if (bulkForm) {
    bulkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bName = document.getElementById('bulkBusinessName').value || 'Business Customer';
      const bType = document.getElementById('bulkBusinessType').value || 'Restaurant';
      const bQty = document.getElementById('bulkEstQty').value || '500+ sheets';
      const bCity = document.getElementById('bulkCity').value || 'Chennai';
      const bPhone = document.getElementById('bulkPhone').value || 'N/A';

      const waMsg = `Hello Karpagam Foods! 🏬%0A%0AI would like to inquire about *Bulk Wholesale Supply* of Samosa Sheets:%0A%0A🏢 *Business Name:* ${encodeURIComponent(bName)}%0A🍕 *Business Type:* ${encodeURIComponent(bType)}%0A📦 *Estimated Requirement:* ${encodeURIComponent(bQty)}%0A📍 *Location:* ${encodeURIComponent(bCity)}%0A📞 *Contact Phone:* ${encodeURIComponent(bPhone)}%0A%0APlease share your wholesale catalog, sample pack info, and bulk price list. Thank you!`;

      window.open(`https://wa.me/919095333944?text=${waMsg}`, '_blank');
      showToast('Redirecting to WhatsApp for wholesale enquiry!');
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 7. Toast Notification Utility                                              */
/* -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('customToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'customToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--bg-card-solid);
      border: 1px solid var(--accent-gold);
      color: var(--text-bright);
      padding: 0.85rem 1.5rem;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 400;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
      opacity: 0;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
  }, 3500);
}

/* -------------------------------------------------------------------------- */
/* 8. Scroll Observer for Entrance Animations                                 */
/* -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (!animatedElements.length) return;

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => animObserver.observe(el));
}
