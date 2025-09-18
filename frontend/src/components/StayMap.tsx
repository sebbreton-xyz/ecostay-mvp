// src/components/StayMap.tsx
import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import type { Stay } from "@/types/stay";

// ✅ Icône rond vert avec contour blanc
const greenCircleIcon = L.icon({
  iconUrl: `data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>
      <circle cx='20' cy='20' r='16'
        fill='%23059669' stroke='white' stroke-width='4'/>
    </svg>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],   // bas-centre
  popupAnchor: [0, -40],  // popup juste au-dessus
});

type Point = Stay & { lat: number; lng: number };

type Props = {
  stays: Stay[];
  selectedId?: number | null;
  onMarkerClick?: (id: number) => void;
};

/** Calcule les points à partir des seules coordonnées réelles (aucun fallback). */
function usePoints(stays: Stay[]): Point[] {
  return useMemo(() => {
    return (stays ?? [])
      .map((s: any) => {
        const rawLat = s.lat ?? s.latitude ?? null;
        const rawLng = s.lng ?? s.longitude ?? null;

        const lat =
          typeof rawLat === "string" ? parseFloat(rawLat) : (rawLat as number | null);
        const lng =
          typeof rawLng === "string" ? parseFloat(rawLng) : (rawLng as number | null);

        if (
          typeof lat === "number" &&
          !Number.isNaN(lat) &&
          typeof lng === "number" &&
          !Number.isNaN(lng)
        ) {
          return { ...s, lat, lng } as Point;
        }
        return null;
      })
      .filter(Boolean) as Point[];
  }, [stays]);
}

/** Ajuste la vue pour inclure tous les points (avec padding) quand la liste change. */
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

/** FlyTo + openPopup sur l'élément sélectionné (ex: click d'une card). */
function AutoFocusSelected({
  selectedId,
  points,
  markerRefs,
}: {
  selectedId?: number | null;
  points: Point[];
  markerRefs: RefObject<Record<number, LeafletMarker | null>>;
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

/** Active le zoom à la molette uniquement quand la souris survole la carte. */
function HoverWheelZoom() {
  const map = useMap();

  useMapEvents({
    mouseover() {
      map.scrollWheelZoom.enable();
    },
    mouseout() {
      map.scrollWheelZoom.disable();
    },
  });

  return null;
}

export default function StayMap({ stays, selectedId, onMarkerClick }: Props) {
  const points = usePoints(stays);
  const markerRefs = useRef<Record<number, LeafletMarker | null>>({});

  // Centre initial si pas de points (France)
  const initialCenter: [number, number] = points.length
    ? [points[0].lat, points[0].lng]
    : [46.5, 2.5];

  return (
    <MapContainer
      center={initialCenter}
      zoom={6}
      className="h-80 w-full rounded-xl border"
      scrollWheelZoom={false} // désactivé par défaut
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />

      {points.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={greenCircleIcon} // ✅ icône personnalisée
          ref={(ref: LeafletMarker | null) => {
            markerRefs.current[s.id] = ref ?? null;
          }}
          eventHandlers={{ click: () => onMarkerClick?.(s.id) }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-medium flex items-center gap-2">
                <span>{(s as any).title ?? (s as any).name}</span>
                {((s as any).is_demo ||
                  String((s as any).title ?? "").startsWith("[DEMO]")) && (
                  <span className="ml-1 inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] uppercase tracking-wide text-emerald-700 border-emerald-600/50 bg-emerald-50">
                    Démo
                  </span>
                )}
              </div>
              <div className="text-slate-600">
                {(s as any).city ?? "Ville inconnue"}
              </div>
              {(s as any).price && (
                <div className="text-slate-700 mt-1">{(s as any).price} €</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      <FitToAll points={points} />
      <AutoFocusSelected
        selectedId={selectedId}
        points={points}
        markerRefs={markerRefs}
      />

      {/* 👉 Active/désactive la molette selon le survol */}
      <HoverWheelZoom />
    </MapContainer>
  );
}
