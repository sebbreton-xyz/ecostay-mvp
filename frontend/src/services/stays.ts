// src/services/stays.ts
import { api } from "@/lib/api";
import type { Stay } from "@/types/stay";

type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export async function getAllStays(): Promise<Stay[]> {
  const { data } = await api.get<Stay[] | Paginated<Stay>>("/stays/");
  const items: any[] = Array.isArray(data) ? data : data?.results ?? [];

  return items.map((s: any) => {
    const lat = s.lat ?? s.latitude ?? null;
    const lng = s.lng ?? s.longitude ?? null;
    return {
      ...s,
      lat: typeof lat === "string" ? parseFloat(lat) : lat,
      lng: typeof lng === "string" ? parseFloat(lng) : lng,
    } as Stay;
  });
}

export async function getStay(id: number | string): Promise<Stay> {
  const { data } = await api.get<Stay>(`/stays/${id}/`);
  const s: any = data;
  const lat = s.lat ?? s.latitude ?? null;
  const lng = s.lng ?? s.longitude ?? null;
  return {
    ...s,
    lat: typeof lat === "string" ? parseFloat(lat) : lat,
    lng: typeof lng === "string" ? parseFloat(lng) : lng,
  } as Stay;
}

export type StaySearchParams = {
  search?: string;          // titre ou ville (DRF SearchFilter)
  q?: string;             // requête normalisée (sans accents, lowercase)
  city?: string;            // filtre strict "city"
  category?: string;        // slug côté API
  min_price?: number | string;
  max_price?: number | string;
  has_coords?: boolean | string | number;
  is_demo?: boolean | string | number;
  ordering?: "price" | "-price" | "created_at" | "-created_at" | "title" | "-title";
};

export async function searchStays(params: StaySearchParams = {}): Promise<Stay[]> {
  const { data } = await api.get<Stay[] | Paginated<Stay>>("/stays/", { params });
  const items: any[] = Array.isArray(data) ? data : data?.results ?? [];
  return items.map((s: any) => {
    const lat = s.lat ?? s.latitude ?? null;
    const lng = s.lng ?? s.longitude ?? null;
    return {
      ...s,
      lat: typeof lat === "string" ? parseFloat(lat) : lat,
      lng: typeof lng === "string" ? parseFloat(lng) : lng,
    } as Stay;
  });
}

