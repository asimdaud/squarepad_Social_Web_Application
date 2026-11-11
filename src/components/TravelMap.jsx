import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/css/travel-map.css";

const imageByKey = {
  azores: new URL("../assets/azores-trail.webp", import.meta.url).href,
  kyoto: new URL("../assets/kyoto-lane.webp", import.meta.url).href,
  amalfi: new URL("../assets/amalfi-coast.webp", import.meta.url).href,
};

const emptyDraft = {
  city: "",
  country: "",
  type: "City",
  note: "",
  lat: "",
  lon: "",
};

const TravelMap = ({
  places,
  selectedPlace,
  searchQuery,
  savedIds,
  onSelectPlace,
  onAddPlace,
  onRemovePlace,
  onToggleSave,
  onWriteNote,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const heatLayerRef = useRef(null);
  const hasInitialSelectionRef = useRef(false);
  const pickingRef = useRef(false);
  const callbacksRef = useRef({});
  const [mapReady, setMapReady] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [formError, setFormError] = useState("");
  const [mapError, setMapError] = useState("");

  callbacksRef.current = { ...callbacksRef.current, onSelectPlace, onAddPlace };
  pickingRef.current = isPickingLocation;

  const visiblePlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return places;
    return places.filter((place) => `${place.city} ${place.country} ${place.note}`.toLowerCase().includes(query));
  }, [places, searchQuery]);

  useEffect(() => {
    if (!mapContainerRef.current) return undefined;

    let active = true;
    const previousLeaflet = window.L;
    window.L = L;

    import("leaflet.heat").then(() => {
      if (window.L === L) {
        if (previousLeaflet === undefined) delete window.L;
        else window.L = previousLeaflet;
      }
      if (!active || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [25, 8],
        zoom: 2,
        minZoom: 2,
        maxZoom: 15,
        worldCopyJump: true,
        zoomControl: false,
        scrollWheelZoom: true,
      });
      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          subdomains: "abc",
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      );
      tileLayer.on("tileerror", () => setMapError("Map tiles could not load. Check your connection and try again."));
      tileLayer.on("tileload", () => setMapError(""));
      tileLayer.addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      const markerLayer = L.layerGroup().addTo(map);
      const initialBounds = L.latLngBounds(places.map((place) => [place.lat, place.lon]));
      if (initialBounds.isValid()) map.fitBounds(initialBounds.pad(0.2), { maxZoom: 3, animate: false });
      const syncPinLabels = () => map.getContainer().classList.toggle("wayfarer-zoomed-out", map.getZoom() < 5);
      map.on("zoomend", syncPinLabels);
      syncPinLabels();
      map.on("click", (event) => {
        if (!pickingRef.current) return;
        callbacksRef.current.onPickCoordinates?.(event.latlng);
      });

      mapRef.current = map;
      markerLayerRef.current = markerLayer;
      setMapReady(true);
      window.setTimeout(() => map.invalidateSize(), 80);
    }).catch(() => {
      if (window.L === L) {
        if (previousLeaflet === undefined) delete window.L;
        else window.L = previousLeaflet;
      }
      if (active) setMapError("The interactive map could not start. Reload the page to try again.");
    });

    return () => {
      active = false;
      if (window.L === L) {
        if (previousLeaflet === undefined) delete window.L;
        else window.L = previousLeaflet;
      }
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      heatLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    callbacksRef.current.onPickCoordinates = (latlng) => {
      setDraft((current) => ({
        ...current,
        lat: latlng.lat.toFixed(5),
        lon: latlng.lng.toFixed(5),
      }));
      setIsPickingLocation(false);
      setFormError("");
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!mapReady || !map || !layer) return;

    layer.clearLayers();
    visiblePlaces.forEach((place) => {
      const markerContent = document.createElement("span");
      markerContent.className = `wayfarer-pin${place.id === selectedPlace?.id || place.city === selectedPlace?.city ? " is-selected" : ""}`;
      const dot = document.createElement("span");
      dot.className = "wayfarer-pin-dot";
      const label = document.createElement("span");
      label.className = "wayfarer-pin-label";
      label.textContent = place.city;
      markerContent.append(dot, label);

      const marker = L.marker([place.lat, place.lon], {
        icon: L.divIcon({
          className: "wayfarer-leaflet-icon",
          html: markerContent,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        }),
        title: `${place.city} — ${place.noteCount} trip notes`,
        riseOnHover: true,
      }).addTo(layer);

      const popup = document.createElement("div");
      popup.className = "wayfarer-popup";
      const title = document.createElement("strong");
      title.textContent = place.city;
      const location = document.createElement("span");
      location.textContent = place.country;
      const activity = document.createElement("small");
      activity.textContent = `${place.noteCount} trip notes · ${place.activityScore} activity signals`;
      popup.append(title, location, activity);
      marker.bindPopup(popup, { className: "wayfarer-popup-shell", closeButton: false });
      marker.on("click", () => callbacksRef.current.onSelectPlace?.(place));
    });
  }, [mapReady, visiblePlaces, selectedPlace?.id, selectedPlace?.city]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    const maxActivity = visiblePlaces.reduce((max, place) => Math.max(max, place.activityScore), 1);
    const points = visiblePlaces
      .filter((place) => place.activityScore > 0)
      .map((place) => [place.lat, place.lon, Math.min(1, place.activityScore / maxActivity)]);

    if (showHeatmap && points.length && typeof L.heatLayer === "function") {
      heatLayerRef.current = L.heatLayer(points, {
        radius: 44,
        blur: 38,
        minOpacity: 0.32,
        maxZoom: 8,
        max: 1,
        gradient: {
          0.15: "#719b68",
          0.38: "#b6dc73",
          0.62: "#f5d56e",
          0.82: "#f3955c",
          1: "#e85e58",
        },
      }).addTo(map);
    }
  }, [mapReady, visiblePlaces, showHeatmap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !selectedPlace) return;
    if (!hasInitialSelectionRef.current) {
      hasInitialSelectionRef.current = true;
      return;
    }
    map.flyTo([selectedPlace.lat, selectedPlace.lon], Math.max(map.getZoom(), 4), {
      duration: 0.55,
    });
  }, [mapReady, selectedPlace?.id, selectedPlace?.city]);

  const fitAllPlaces = () => {
    const map = mapRef.current;
    if (!map || visiblePlaces.length === 0) return;
    const bounds = L.latLngBounds(visiblePlaces.map((place) => [place.lat, place.lon]));
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.2), { maxZoom: 5, animate: true });
  };

  const handleSavePlace = (event) => {
    event.preventDefault();
    setFormError("");
    const city = draft.city.trim();
    const country = draft.country.trim();
    const lat = Number(draft.lat);
    const lon = Number(draft.lon);

    if (!city || !country || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setFormError("Add a place, country, and valid coordinates before saving.");
      return;
    }
    if (places.some((place) => place.city.toLowerCase() === city.toLowerCase())) {
      setFormError("A place with that name is already on the map.");
      return;
    }

    callbacksRef.current.onAddPlace?.({
      id: `place-${Date.now()}`,
      city,
      country,
      type: draft.type,
      note: draft.note.trim() || `A new place shared by a traveler in ${country}.`,
      lat,
      lon,
      imageKey: "azores",
      custom: true,
    });
    setDraft(emptyDraft);
    setFormOpen(false);
    setIsPickingLocation(false);
  };

  const updateDraft = (field) => (event) => {
    const value = event.target.value;
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const openAddForm = () => {
    setFormOpen((open) => !open);
    setFormError("");
    setIsPickingLocation(false);
  };

  return (
    <div className="travel-map-layout">
      <div className="map-shell travel-map-shell">
        <div className="map-topline travel-map-topline">
          <div>
            <span className="section-kicker">SQUAREPAD MAP</span>
            <h2>Trip locations</h2>
          </div>
          <div className="travel-map-actions">
            <button className={`map-tool-button ${showHeatmap ? "map-tool-active" : ""}`} type="button" aria-pressed={showHeatmap} onClick={() => setShowHeatmap((visible) => !visible)}>
              <span className="heat-toggle-icon" /> Heatmap {showHeatmap ? "on" : "off"}
            </button>
            <button className="map-tool-button" type="button" onClick={fitAllPlaces}>Fit places</button>
            <button className="map-add-button" type="button" onClick={openAddForm}>{formOpen ? "Close form" : "+ Add a place"}</button>
          </div>
        </div>

        {formOpen && (
          <form className="location-form" onSubmit={handleSavePlace}>
            <div className="location-form-heading">
              <div>
                <span className="section-kicker">ADD TO YOUR ATLAS</span>
                <h3>Pin a place worth sharing</h3>
              </div>
              <p>Saved in this browser. No location tracking.</p>
            </div>
            <div className="location-form-grid">
              <label>Place name<input required maxLength="70" value={draft.city} onChange={updateDraft("city")} placeholder="e.g. Alfama" /></label>
              <label>Country or region<input required maxLength="70" value={draft.country} onChange={updateDraft("country")} placeholder="e.g. Lisbon, Portugal" /></label>
              <label>Place type<select value={draft.type} onChange={updateDraft("type")}><option>City</option><option>Trails</option><option>Coast</option><option>Local find</option><option>Walking route</option></select></label>
              <label>Latitude<input required type="number" min="-90" max="90" step="any" value={draft.lat} onChange={updateDraft("lat")} placeholder="38.7223" /></label>
              <label>Longitude<input required type="number" min="-180" max="180" step="any" value={draft.lon} onChange={updateDraft("lon")} placeholder="-9.1393" /></label>
              <label className="location-note-field">Why is it worth the detour?<textarea maxLength="240" rows="2" value={draft.note} onChange={updateDraft("note")} placeholder="A quiet lane, a good bakery, a view at the right hour..." /></label>
            </div>
            <div className="location-form-footer">
              <div>
                <button className={`map-picker-button ${isPickingLocation ? "is-picking" : ""}`} type="button" onClick={() => setIsPickingLocation(true)}>{isPickingLocation ? "Click the map to place the pin" : "Choose coordinates on map"}</button>
                <span>{draft.lat && draft.lon ? `${Number(draft.lat).toFixed(3)}, ${Number(draft.lon).toFixed(3)}` : "Or enter latitude and longitude"}</span>
              </div>
              <div className="location-form-buttons">
                <button className="map-cancel-button" type="button" onClick={() => { setFormOpen(false); setIsPickingLocation(false); setDraft(emptyDraft); }}>Cancel</button>
                <button className="map-add-button" type="submit">Save place</button>
              </div>
            </div>
            {isPickingLocation && <p className="map-pick-hint" role="status">Click anywhere on the map to set this place’s coordinates.</p>}
            {formError && <p className="map-form-error" role="alert">{formError}</p>}
          </form>
        )}

        <div className="travel-map-frame">
          <div ref={mapContainerRef} className="travel-leaflet-map" role="region" aria-label="Interactive map of traveler posts and places" />
          {mapError && <p className="travel-map-error" role="status">{mapError}</p>}
          {isPickingLocation && <div className="map-picking-banner" aria-live="polite">Click the map to place your new pin</div>}
        </div>
        <div className="map-legend-row">
          <span className="map-heat-legend"><i /> Activity heat</span>
          <span>Trip notes, likes, comments, and saves · {visiblePlaces.length} places in view</span>
          <span className="map-heat-scale"><small>Less activity</small><i /><small>More activity</small></span>
        </div>
      </div>

      {selectedPlace && (
        <article className="selected-place-card travel-selected-place">
          <img src={imageByKey[selectedPlace.imageKey] || imageByKey.azores} alt={selectedPlace.city} />
          <div className="selected-place-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> {selectedPlace.custom ? "COMMUNITY PLACE" : "SELECTED PLACE"}</div>
            <h2>{selectedPlace.city}</h2>
            <p className="place-country">{selectedPlace.country}</p>
            <p>{selectedPlace.note}</p>
            <div className="place-activity-stats">
              <span><strong>{selectedPlace.noteCount}</strong> trip notes</span>
              <span><strong>{selectedPlace.activityScore}</strong> activity signals</span>
            </div>
            <div className="selected-place-actions">
              <button className="primary-button" type="button" onClick={() => onToggleSave(`place-${selectedPlace.city}`)} aria-pressed={savedIds.includes(`place-${selectedPlace.city}`)}>{savedIds.includes(`place-${selectedPlace.city}`) ? "Saved to my places" : "Save this place"}</button>
              <button className="map-note-button" type="button" onClick={() => onWriteNote(selectedPlace)}>Write a trip note</button>
              {selectedPlace.custom && <button className="map-remove-button" type="button" onClick={() => { if (window.confirm(`Remove ${selectedPlace.city} from your local map?`)) onRemovePlace(selectedPlace.id); }}>Remove place</button>}
            </div>
          </div>
        </article>
      )}

      <aside className="map-note-list travel-map-note-list">
        <span className="section-kicker">PLACES FROM YOUR DATA</span>
        {visiblePlaces.length === 0 ? <p className="map-empty-results">No places match this search.</p> : visiblePlaces.map((place, index) => (
          <button key={place.id || place.city} className={`map-list-row ${place.id === selectedPlace?.id || place.city === selectedPlace?.city ? "current" : ""}`} type="button" onClick={() => { onSelectPlace(place); mapRef.current?.flyTo([place.lat, place.lon], Math.max(mapRef.current.getZoom(), 4), { duration: 0.55 }); }}>
            <span className="map-list-index">{String(index + 1).padStart(2, "0")}</span>
            <span><strong>{place.city}</strong><small>{place.country} · {place.noteCount} notes</small></span>
            <span className="map-activity-score">{place.activityScore}</span>
          </button>
        ))}
        <p className="map-list-caption">Heat intensity updates from your current posts, likes, comments, and saved places.</p>
      </aside>
    </div>
  );
};

export default TravelMap;
