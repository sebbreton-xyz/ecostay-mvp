// src/services/categories.ts
import { api } from "@/lib/api";
import type { Category } from "@/types/category";

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories/");
  return data;
}
