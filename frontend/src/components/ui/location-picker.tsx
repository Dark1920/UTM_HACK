'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  address?: string;
  onAddressSearch?: (address: string) => void;
}

// Component to handle map click events
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to update map center when coordinates change
function MapUpdater({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);
  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
  address,
  onAddressSearch,
}: LocationPickerProps) {
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    setSearchError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress + ', Burkina Faso'
        )}&limit=1`,
        {
          headers: {
            'User-Agent': 'ArtisanBF/1.0 (contact@artisanbf.com)',
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onChange(lat, lng);
        if (onAddressSearch) {
          onAddressSearch(searchAddress);
        }
      } else {
        setSearchError('Adresse non trouvée. Essayez une autre adresse.');
      }
    } catch (error) {
      setSearchError('Erreur lors de la recherche. Vérifiez votre connexion.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-3">
      {/* Address Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Rechercher une adresse..."
          className="flex-1 h-10 px-3 border border-stone-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="h-10 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-md text-sm transition-colors disabled:opacity-50"
        >
          {isSearching ? '...' : 'Rechercher'}
        </button>
      </div>
      {searchError && (
        <p className="text-sm text-red-600">{searchError}</p>
      )}

      {/* Map */}
      <div className="h-64 rounded-lg overflow-hidden border border-stone-300">
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} draggable={true} eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              onChange(position.lat, position.lng);
            },
          }} />
          <MapClickHandler onMapClick={onChange} />
          <MapUpdater latitude={latitude} longitude={longitude} />
        </MapContainer>
      </div>

      {/* Coordinates Display */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
           {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
        <span className="text-stone-400">
          Cliquez sur la carte ou déplacez le marqueur
        </span>
      </div>
    </div>
  );
}
