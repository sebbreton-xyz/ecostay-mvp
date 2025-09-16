// src/components/StayMap.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";                 // ✅ Remplace MutableRefObject par RefObject
import type { Stay } from "@/types/stay";

// Fix icônes avec Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker1x,
  shadowUrl: markerShadow,
});

// Fallback simple par ville (temporaire tant qu'on n'a pas lat/lon API)
const cityToLatLng: Record<string, [number, number]> = {
  Annecy: [45.899, 6.129],
  Lyon: [45.757, 4.835],
};

type Point = Stay & { lat: number; lng: number };

type Props = {
  stays: Stay[];
  selectedId?: number | null;
  onMarkerClick?: (id: number) => void;
};

function usePoints(stays: Stay[]): Point[] {
  return useMemo(() => {
    return stays
      .map((s) => {
        const lat = (s as any).latitude ?? (s.city && cityToLatLng[s.city]?.[0]);
        const lng = (s as any).longitude ?? (s.city && cityToLatLng[s.city]?.[1]);
        return typeof lat === "number" && typeof lng === "number" ? ({ ...s, lat, lng } as Point) : null;
      })
      .filter(Boolean) as Point[];
  }, [stays]);
}

// 1) Ajuste la vue pour inclure tous les points (avec padding) quand la liste change
function FitToAll({ points }: { points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 11);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

// 2) FlyTo + openPopup sur l'élément sélectionné (ex: click d'une card)
function AutoFocusSelected({
  selectedId,
  points,
  markerRefs,
}: {
  selectedId?: number | null;
  points: Point[];
  markerRefs: RefObject<Record<number, LeafletMarker | null>>; // ✅ RefObject
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const p = points.find((x) => x.id === selectedId);
    if (!p) return;
    map.flyTo([p.lat, p.lng], 12, { duration: 0.7 });
    const mk = markerRefs.current?.[selectedId];
    mk?.openPopup();
  }, [selectedId, points, map, markerRefs]);
  return null;
}

export default function StayMap({ stays, selectedId, onMarkerClick }: Props) {
  const points = usePoints(stays);
  const markerRefs = useRef<Record<number, LeafletMarker | null>>({}); // ✅ OK avec React 19 types

  // Centre initial si pas de points (France)
  const initialCenter: [number, number] = points.length ? [points[0].lat, points[0].lng] : [46.5, 2.5];

  return (
    <MapContainer
      center={initialCenter}
      zoom={6}
      className="h-80 w-full rounded-xl border"
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />

      {points.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          ref={(ref: LeafletMarker | null) => {     // ✅ callback ref doit retourner void
            markerRefs.current[s.id] = ref!;
          }}
          eventHandlers={{ click: () => onMarkerClick?.(s.id) }}
        >
          {<Popup>
            <div className="text-sm">
              <div className="font-medium flex items-center gap-2">
                <span>{(s as any).title ?? (s as any).name}</span>
                {((s as any).is_demo || String((s as any).title).startsWith("[DEMO]")) && (
                  <span className="ml-1 inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] uppercase tracking-wide text-emerald-700 border-emerald-600/50 bg-emerald-50">
                    Démo
                  </span>
                )}
              </div>
              <div className="text-slate-600">{s.city ?? "Ville inconnue"}</div>
            </div>
          </Popup>}

        </Marker>
      ))}

      <FitToAll points={points} />
      <AutoFocusSelected selectedId={selectedId} points={points} markerRefs={markerRefs} />
    </MapContainer>
  );
}
