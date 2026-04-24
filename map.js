// ============================================================
// POLLING BOOTH LOCATOR LOGIC
// ============================================================

let map;
let markers = [];
let infoWindow;
let isMapLoaded = false;

// Dummy polling booth data
const dummyBooths = [
  { id: 1, name: "Govt. Boys Senior Secondary School", address: "Sector 4, R.K. Puram, New Delhi", lat: 28.5678, lng: 77.1724, distance: "0.4 km" },
  { id: 2, name: "Kendriya Vidyalaya", address: "Sector 8, R.K. Puram, New Delhi", lat: 28.5701, lng: 77.1698, distance: "0.8 km" },
  { id: 3, name: "Delhi Public School", address: "Vasant Vihar, New Delhi", lat: 28.5612, lng: 77.1601, distance: "1.2 km" },
  { id: 4, name: "Sarvodaya Vidyalaya", address: "Munirka, New Delhi", lat: 28.5589, lng: 77.1756, distance: "1.5 km" },
];

function initBoothMap() {
  if (typeof google === 'undefined' || !google.maps) {
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
  // Map actually works in Dev Mode, so we don't necessarily want to hide it.
};

function handleSearch() {
  const query = document.getElementById("locator-input").value.trim();
  if (!query) return;

  // Simulate an API call delay
  document.getElementById("locator-list").innerHTML = '<p class="locator-list-hint">Searching nearby booths...</p>';
  document.getElementById("locator-search-btn").disabled = true;
  document.getElementById("locator-search-btn").textContent = "Searching...";

  setTimeout(() => {
    displayResults(dummyBooths);
    
    // Simulate focusing the map on the first result
    if (isMapLoaded && map) {
      map.setCenter({ lat: dummyBooths[0].lat, lng: dummyBooths[0].lng });
      map.setZoom(14);
    }
    
    document.getElementById("locator-search-btn").disabled = false;
    document.getElementById("locator-search-btn").textContent = "Find Booth";
  }, 800);
}

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
