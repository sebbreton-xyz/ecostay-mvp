// src/services/categories.ts
import { api } from "@/lib/api";
import type { Category } from "@/types/category";

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await api.get<any[] | Paginated<any>>("/categories/");
  const raw = Array.isArray(data) ? data : data?.results ?? [];

  return raw.map((c: any) => ({
    id: c.id,
    name: c.name ?? c.name_fr ?? c.name_en ?? c.slug,  // <- toujours défini
    slug: c.slug,
    name_fr: c.name_fr,
    name_en: c.name_en,
    stays_count: c.stays_count,
  })) as Category[];
}
