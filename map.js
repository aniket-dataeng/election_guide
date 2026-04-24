// ============================================================
// POLLING BOOTH LOCATOR LOGIC
// ============================================================

let map;
let markers = [];
let infoWindow;
let isMapLoaded = false;

function initBoothMap() {
  if (typeof google === 'undefined' || !google || !google.maps) {
    showMapError();
    return;
  }

  isMapLoaded = true;

  // Default coordination: New Delhi
  const defaultCenter = { lat: 28.6139, lng: 77.2090 };

  map = new google.maps.Map(document.getElementById("locator-map"), {
    center: defaultCenter,
    zoom: 11,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  infoWindow = new google.maps.InfoWindow();

  // Attach search event
  document.getElementById("locator-search-btn").addEventListener("click", handleSearch);
  document.getElementById("locator-input").addEventListener("keypress", (e) => {
    if (e.key === 'Enter') handleSearch();
  });
}

// Map Auth Failure Callback
window.gm_authFailure = function() {
  // Overrides the default alert and handles the UI gracefully
  console.warn("Google Maps Auth Failure - falling back to list view only if map object fails entirely. Dev mode still works.");
  // Map actually works in Dev Mode, but sometimes it injects a breaking error box.
  // Force hide the map UI and show the clean fallback layout.
  showMapError();
};

function handleSearch() {
  const query = document.getElementById("locator-input").value.trim();
  const listContainer = document.getElementById("locator-list");
  
  if (!query) {
    listContainer.innerHTML = '<p class="locator-list-hint" style="color:red;">Error: Please enter a ZIP code.</p>';
    return;
  }

  // Simulate an API call delay
  listContainer.innerHTML = '<p class="locator-list-hint">Searching nearby booths...</p>';
  document.getElementById("locator-search-btn").disabled = true;
  document.getElementById("locator-search-btn").textContent = "Searching...";

  setTimeout(() => {
    // Read from centralized DataStore using the ZIP query
    const results = window.DataStore && window.DataStore.booths && window.DataStore.booths[query] 
                    ? window.DataStore.booths[query] 
                    : [];

    if (results.length === 0) {
      listContainer.innerHTML = '<p class="locator-list-hint">No booths found for this ZIP code.</p>';
      clearMarkers();
    } else {
      displayResults(results);
      
      // Simulate focusing the map on the first result
      if (isMapLoaded && map) {
        map.setCenter({ lat: results[0].lat, lng: results[0].lng });
        map.setZoom(14);
      }
    }
    
    document.getElementById("locator-search-btn").disabled = false;
    document.getElementById("locator-search-btn").textContent = "Find Booth";
  }, 800);
}

window.triggerMapSearch = function(zip) {
  // Sync Map search by auto-populating input and firing search
  document.getElementById("locator-input").value = zip;
  document.getElementById("booth-locator").scrollIntoView({ behavior: 'smooth' });
  
  // Highlight map navigation tab
  document.querySelectorAll('.bottom-nav__item').forEach(nav => nav.classList.remove('active'));
  const mapNav = Array.from(document.querySelectorAll('.bottom-nav__item')).find(n => n.getAttribute('href') === '#booth-locator');
  if(mapNav) mapNav.classList.add('active');

  handleSearch();
};


function displayResults(booths) {
  const listContainer = document.getElementById("locator-list");
  listContainer.innerHTML = "";

  clearMarkers();

  booths.forEach((booth, index) => {
    // 1. Add to List
    const card = document.createElement("div");
    card.className = "booth-card";
    card.dataset.id = booth.id;
    card.innerHTML = `
      <h3 class="booth-card__title">${booth.name}</h3>
      <p class="booth-card__desc">${booth.address}</p>
      <span class="booth-card__distance">${booth.distance}</span>
    `;
    listContainer.appendChild(card);

    // 2. Add to Map
    if (isMapLoaded && map) {
      const marker = new google.maps.Marker({
        position: { lat: booth.lat, lng: booth.lng },
        map: map,
        title: booth.name,
        animation: google.maps.Animation.DROP
      });
      
      markers.push(marker);

      // Marker Click
      marker.addListener("click", () => {
        openInfoWindow(booth, marker);
        highlightListItem(booth.id);
      });
    }

    // List Click
    card.addEventListener("click", () => {
      highlightListItem(booth.id);
      if (isMapLoaded && map && markers[index]) {
        map.panTo({ lat: booth.lat, lng: booth.lng });
        openInfoWindow(booth, markers[index]);
      }
    });
  });
}

function clearMarkers() {
  if (!markers || markers.length === 0) return;
  markers.forEach(m => m.setMap(null));
  markers = [];
}

function openInfoWindow(booth, marker) {
  if (!isMapLoaded || !infoWindow) return;
  
  const content = `
    <div class="booth-info-window">
      <h3>${booth.name}</h3>
      <p>${booth.address}</p>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}" target="_blank" class="btn btn--outline btn--sm">Get Directions</a>
    </div>
  `;
  infoWindow.setContent(content);
  infoWindow.open(map, marker);
}

function highlightListItem(id) {
  document.querySelectorAll(".booth-card").forEach(card => {
    if (card.dataset.id == id) {
      card.classList.add("booth-card--active");
      // ensure it is visible in scroll view
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      card.classList.remove("booth-card--active");
    }
  });
}

function showMapError() {
  document.getElementById("locator-map").style.display = "none";
  document.getElementById("locator-map-error").style.display = "flex";
  // Convert list to be essentially full width via CSS if map fails
  document.querySelector(".locator-body").style.gridTemplateColumns = "1fr";
}

// Handle map timeout fallback (e.g. adblocker blocking dynamic script loaded from google)
setTimeout(() => {
  if (!isMapLoaded) {
    showMapError();
    // Allow search to work in list-only mode
    document.getElementById("locator-search-btn").addEventListener("click", handleSearch);
    document.getElementById("locator-input").addEventListener("keypress", (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }
}, 3000);
