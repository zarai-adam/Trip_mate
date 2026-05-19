import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { MapPin, Star, Calendar, Users } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Trip {
  id: string;
  title: string;
  destination: string;
  price: number;
  latitude?: number;
  longitude?: number;
  image?: string;
  type: string;
  difficulty: string;
  guide: {
    name: string;
    avatar?: string;
  };
}

interface ExploreMapProps {
  trips: Trip[];
  onHoverTrip?: (tripId: string | null) => void;
  selectedTripId?: string | null;
}

function RecenterMap({ trips }: { trips: Trip[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (trips.length > 0) {
      const bounds = L.latLngBounds(trips.map(t => [t.latitude || 0, t.longitude || 0] as [number, number]).filter(p => p[0] !== 0));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [trips, map]);

  return null;
}

export default function ExploreMap({ trips, onHoverTrip, selectedTripId }: ExploreMapProps) {
  // Filter trips that have coordinates
  const validTrips = trips.filter(t => t.latitude && t.longitude);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative z-10 border-4 border-white/10">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validTrips.map(trip => (
          <Marker 
            key={trip.id} 
            position={[trip.latitude!, trip.longitude!]}
            eventHandlers={{
              mouseover: () => onHoverTrip?.(trip.id),
              mouseout: () => onHoverTrip?.(null),
            }}
          >
            <Popup className="trip-popup" minWidth={250}>
              <div className="p-0 overflow-hidden font-sans">
                <img 
                  src={trip.image || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=400"} 
                  className="w-full h-32 object-cover rounded-t-xl mb-3" 
                  alt={trip.title} 
                />
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-1 text-sage font-black text-[8px] uppercase tracking-widest mb-1">
                    <MapPin size={10} /> {trip.destination}
                  </div>
                  <h4 className="font-bold text-forest text-sm mb-2 line-clamp-1">{trip.title}</h4>
                  <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
                     <div className="font-black text-forest text-base">${trip.price}</div>
                     <Link 
                      to={`/trip/${trip.id}`}
                      className="px-4 py-2 bg-forest text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-forest-dark transition-all"
                     >
                       Explore
                     </Link>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <RecenterMap trips={validTrips} />
      </MapContainer>

      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 1.5rem;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .leaflet-popup-content {
          margin: 0;
          width: 250px !important;
        }
        .leaflet-container {
          background: #f8f9fa;
        }
      `}</style>
    </div>
  );
}
