// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/categories";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: getAllCategories });
}
