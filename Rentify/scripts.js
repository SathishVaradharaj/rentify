(async function () {
    const apiUrl = 'http://localhost:3000'; // URL to your backend
  
    // Elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const propertyForm = document.getElementById('propertyForm');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const authSection = document.getElementById('auth');
    const propertyManagementSection = document.getElementById('propertyManagement');
    const sellerSection = document.getElementById('sellerSection');
    const buyerSection = document.getElementById('buyerSection');
    const sellerProperties = document.getElementById('sellerProperties');
    const propertyList = document.getElementById('propertyList');
  
    let currentUser = null;
  
    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    propertyForm.addEventListener('submit', handlePostProperty);
    applyFiltersBtn.addEventListener('click', fetchProperties);
  
    // Functions
    async function handleLogin(event) {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
  
      try {
        const res = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        currentUser = data.user;
        showPropertyManagement();
      } catch (err) {
        console.error(err);
      }
    }
  
    async function handleRegister(event) {
      event.preventDefault();
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      const userType = document.getElementById('userType').value;
  
      try {
        const res = await fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, phone, password, userType })
        });
        const data = await res.json();
        currentUser = data.user;
        showPropertyManagement();
      } catch (err) {
        console.error(err);
      }
    }
  
    function showPropertyManagement() {
      authSection.style.display = 'none';
      propertyManagementSection.style.display = 'block';
      if (currentUser.userType === 'seller') {
        sellerSection.style.display = 'block';
        buyerSection.style.display = 'none';
        fetchSellerProperties();
      } else {
        sellerSection.style.display = 'none';
        buyerSection.style.display = 'block';
        fetchProperties();
      }
    }
  
    async function handlePostProperty(event) {
      event.preventDefault();
      const title = document.getElementById('propertyTitle').value;
      const place = document.getElementById('propertyPlace').value;
      const bedrooms = document.getElementById('propertyBedrooms').value;
      const bathrooms = document.getElementById('propertyBathrooms').value;
      const nearby = document.getElementById('propertyNearby').value;
  
      try {
        const res = await fetch(`${apiUrl}/properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, place, bedrooms, bathrooms, nearby, sellerId: currentUser.id })
        });
        const property = await res.json();
        sellerProperties.innerHTML += createPropertyCard(property);
      } catch (err) {
        console.error(err);
      }
    }
  
    function createPropertyCard(property) {
      return `
        <div class="property-card">
          <h3>${property.title}</h3>
          <p>${property.place}</p>
          <p>${property.bedrooms} Bedrooms</p>
          <p>${property.bathrooms} Bathrooms</p>
          <p>Nearby: ${property.nearby}</p>
          <button onclick="handleInterestedClick('${property.id}')">I'm Interested</button>
        </div>
      `;
    }
  
    async function fetchSellerProperties() {
      try {
        const res = await fetch(`${apiUrl}/properties?sellerId=${currentUser.id}`);
        const properties = await res.json();
        sellerProperties.innerHTML = properties.map(createPropertyCard).join('');
      } catch (err) {
        console.error(err);
      }
    }
  
    async function fetchProperties() {
      const place = document.getElementById('filterPlace').value;
      const bedrooms = document.getElementById('filterBedrooms').value;
      const bathrooms = document.getElementById('filterBathrooms').value;
  
      try {
        const res = await fetch(`${apiUrl}/properties?place=${place}&bedrooms=${bedrooms}&bathrooms=${bathrooms}`);
        const properties = await res.json();
        propertyList.innerHTML = properties.map(createPropertyCard).join('');
      } catch (err) {
        console.error(err);
      }
    }
  
    async function handleInterestedClick(propertyId) {
      try {
        const res = await fetch(`${apiUrl}/properties/${propertyId}/interested`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ buyerId: currentUser.id })
        });
        const data = await res.json();
        alert(`Contact Seller: ${data.sellerContact}`);
      } catch (err) {
        console.error(err);
      }
    }
  
    // Mock backend data
    window.fetch = async (url, options) => {
      // Mock response based on the URL
      // You can implement your own mock server or use JSON Server for testing
    };
  })();
  