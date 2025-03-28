import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronDown } from 'lucide-react';

// Map style configurations
const MAP_STYLES = [
  {
    value: 'dark',
    label: 'Dark Mode',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    attribution: '© Stadia Maps (Dark)'
  },
  {
    value: 'satellite',
    label: 'Satellite View',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png',
    attribution: '© Stadia Maps (Satellite)'
  },
  {
    value: 'default',
    label: 'Standard Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  }
];

// Custom marker icons with a more modern design
const createCustomIcon = (iconPath, color = '#00ffff') => {
  return new L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        width: 40px; 
        height: 40px; 
        background: radial-gradient(circle, ${color} 0%, rgba(0,255,255,0.6) 70%);
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 0 10px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.3);
        border: 2px solid ${color};
      ">
        <img 
          src="${iconPath}" 
          alt="marker" 
          style="width: 24px; height: 24px; filter: brightness(0) invert(1);"
        />
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/data_lokasi_cabang.json')
      .then((res) => res.json())
      .then((data) => setMarkers(data))
      .catch((err) => console.error('Error fetching markers:', err));
  }, []);

  const handleMapStyleChange = (style) => {
    setMapStyle(style);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-cyan-500/30 z-10">
      {/* Map Style Dropdown */}
      <div className="absolute top-4 right-4 z-[1000] w-48">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="
              w-full 
              bg-black/50 
              backdrop-blur-sm 
              rounded-full 
              px-4 
              py-2 
              text-cyan-300 
              flex 
              items-center 
              justify-between
              hover:bg-black/60
              transition-all
            "
          >
            <span className="text-sm">{mapStyle.label}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {isDropdownOpen && (
            <div className="
              absolute 
              top-full 
              right-0 
              mt-2 
              bg-black/80 
              backdrop-blur-sm 
              rounded-lg 
              overflow-hidden 
              shadow-2xl
              border 
              border-cyan-500/30
            ">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleMapStyleChange(style)}
                  className={`
                    w-full 
                    text-left 
                    px-4 
                    py-2 
                    text-sm 
                    transition-all
                    ${mapStyle.value === style.value 
                      ? 'bg-cyan-500/30 text-cyan-300' 
                      : 'text-gray-300 hover:bg-cyan-500/20'}
                  `}
                >
                  {style.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-[999]" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      <MapContainer 
        center={[-2.548926, 118.0148634]} 
        zoom={5} 
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url={mapStyle.url}
          attribution={mapStyle.attribution}
        />
        {markers.map((item, index) => {
          const lat = Number(item["Latitude"].replace(',', '.'));
          const lng = Number(item["Longitude"].replace(',', '.'));

          // Determine marker color and icon
          const keterangan = item["Keterangan Lokasi"].toLowerCase();
          let markerColor = '#ff00ff'; // magenta
          let markerIcon = '/marker_icon/iconMitra.png';

          if (keterangan.includes('pusat')) {
            markerColor = '#ff0000'; // merah for pusat
            markerIcon = '/marker_icon/iconPusat.png';
          } else if (keterangan.includes('cabang')) {
            markerColor = '#0891b2'; // biru malam for cabang
            markerIcon = '/marker_icon/iconCabang.png';
          }

          return (
            <Marker 
              key={index} 
              position={[lat, lng]} 
              icon={createCustomIcon(markerIcon, markerColor)}
            >
              <Popup className="custom-popup">
                <div className="bg-black/80 text-cyan-300 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{item["Address"]}</h3>
                  <p className="text-sm opacity-80">{item["Keterangan Lokasi"]}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;