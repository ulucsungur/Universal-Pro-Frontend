import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🚀 Harita ikonu hatasını düzeltmek için (Leaflet klasiği)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ListingMapProps {
  lat: number;
  lng: number;
  title: string;
}

export const ListingMap = ({ lat, lng, title }: ListingMapProps) => {
  return (
    <div className="h-100 w-full rounded-4xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl z-10">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]}>
          <Popup>
            <span className="font-bold uppercase text-[10px]">{title}</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
