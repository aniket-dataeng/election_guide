/* ============================================================
   Map Component
   ============================================================ */

import { escapeHTML, isValidPin, debounce } from '../utils/helpers.js';

export class PollingMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.infoWindow = null;
    this.isLoaded = false;
    
    this.input = document.getElementById('locator-input');
    this.listContainer = document.getElementById('locator-list');
    this.searchBtn = document.getElementById('locator-search-btn');
    this.mapEl = document.getElementById('locator-map');
    this.errorEl = document.getElementById('locator-map-error');

    this.debouncedSearch = debounce(() => this.handleSearch(), 400);
    this.init();
  }

  init() {
    // Search event
    if (this.searchBtn) {
        this.searchBtn.addEventListener('click', () => this.debouncedSearch());
    }
    if (this.input) {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.debouncedSearch();
        });
    }

    // Map timeout fallback
    setTimeout(() => {
        if (!this.isLoaded) {
            this.showError();
        }
    }, 4000);
  }

  initGoogleMap() {
    if (typeof google === 'undefined' || !google || !google.maps) {
      this.showError();
      return;
    }

    this.isLoaded = true;
    const defaultCenter = { lat: 28.6139, lng: 77.2090 };

    this.map = new google.maps.Map(this.mapEl, {
      center: defaultCenter,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    this.infoWindow = new google.maps.InfoWindow();
  }

  handleSearch() {
    const query = this.input.value.trim();
    
    if (!isValidPin(query)) {
      this.listContainer.innerHTML = '<p class="locator-list-hint" style="color:red;">Error: Please enter a valid 6-digit Indian PIN code.</p>';
      return;
    }

    this.listContainer.innerHTML = '<p class="locator-list-hint">Searching nearby booths...</p>';
    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Searching...";

    setTimeout(() => {
      const results = window.DataStore && window.DataStore.booths && window.DataStore.booths[query] 
                      ? window.DataStore.booths[query] 
                      : [];

      if (results.length === 0) {
        this.listContainer.innerHTML = '<p class="locator-list-hint">No booths found for this ZIP code.</p>';
        this.clearMarkers();
      } else {
        this.displayResults(results);
        if (this.isLoaded && this.map) {
          this.map.setCenter({ lat: results[0].lat, lng: results[0].lng });
          this.map.setZoom(14);
        }
      }
      
      this.searchBtn.disabled = false;
      this.searchBtn.textContent = "Find Booth";
    }, 600);
  }

  displayResults(booths) {
    this.listContainer.innerHTML = "";
    this.clearMarkers();

    booths.forEach((booth, index) => {
      const card = document.createElement("div");
      card.className = "booth-card";
      card.dataset.id = booth.id;
      
      const title = document.createElement('h3');
      title.className = 'booth-card__title';
      title.textContent = booth.name;

      const desc = document.createElement('p');
      desc.className = 'booth-card__desc';
      desc.textContent = booth.address;

      const distance = document.createElement('span');
      distance.className = 'booth-card__distance';
      distance.textContent = booth.distance;

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(distance);
      this.listContainer.appendChild(card);

      if (this.isLoaded && this.map) {
        const marker = new google.maps.Marker({
          position: { lat: booth.lat, lng: booth.lng },
          map: this.map,
          title: booth.name,
          animation: google.maps.Animation.DROP
        });
        
        this.markers.push(marker);
        marker.addListener("click", () => {
          this.openInfoWindow(booth, marker);
          this.highlightListItem(booth.id);
        });
      }

      card.addEventListener("click", () => {
        this.highlightListItem(booth.id);
        if (this.isLoaded && this.map && this.markers[index]) {
          this.map.panTo({ lat: booth.lat, lng: booth.lng });
          this.openInfoWindow(booth, this.markers[index]);
        }
      });
    });
  }

  clearMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
  }

  openInfoWindow(booth, marker) {
    if (!this.isLoaded || !this.infoWindow) return;
    
    const content = document.createElement('div');
    content.className = 'booth-info-window';
    content.innerHTML = `
      <h3>${escapeHTML(booth.name)}</h3>
      <p>${escapeHTML(booth.address)}</p>
      <a href="https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}" target="_blank" class="btn btn--outline btn--sm">Get Directions</a>
    `;
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
  }

  highlightListItem(id) {
    document.querySelectorAll(".booth-card").forEach(card => {
      if (card.dataset.id == id) {
        card.classList.add("booth-card--active");
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove("booth-card--active");
      }
    });
  }

  showError() {
    if (this.mapEl) this.mapEl.style.display = "none";
    if (this.errorEl) this.errorEl.style.display = "flex";
    const body = document.querySelector(".locator-body");
    if (body) body.style.gridTemplateColumns = "1fr";
  }
}
