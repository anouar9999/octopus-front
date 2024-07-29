import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default Leaflet icon as fallback
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon from network
const customIconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

const RecenterAutomatically = ({ position }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(position);
  }, [position]);
  return null;
}

const BasicMap = ({ link, zoom = 13, popupContent }) => {
  const [markerIcon, setMarkerIcon] = useState(defaultIcon);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setMarkerIcon(L.icon({
        iconUrl: customIconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }));
    };
    img.onerror = () => {
      console.warn("Failed to load custom icon, using default");
    };
    img.src = customIconUrl;
  }, []);

  const extractLatLngFromUrl = (url) => {
    const match = url.match(/q=([\d.-]+),([\d.-]+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return [lat, lng];
    }
    console.error("Invalid URL format. Expected format: https://maps.google.com/?q=lat,lng");
    return null;
  };

  const position = extractLatLngFromUrl(link);

  if (!position) {
    return <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 text-gray-500">Invalid location data</div>;
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={position}
        zoom={zoom}
        maxZoom={18}
        minZoom={3}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon}>
          <Popup>
            {popupContent || (
              <div>
                <h3 className="font-bold mb-2">Location Details</h3>
                <p>Latitude: {position[0]}</p>
                <p>Longitude: {position[1]}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </Popup>
        </Marker>
        <RecenterAutomatically position={position} />
      </MapContainer>
    </div>
  );
};

export default BasicMap;