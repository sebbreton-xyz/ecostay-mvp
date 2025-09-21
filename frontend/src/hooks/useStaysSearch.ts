// frontend/src/hooks/useStaysSearch.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchStays, type StaySearchParams } from "@/services/stays";
import type { Stay } from "@/types/stay";

export function useStaysSearch(filters: StaySearchParams) {
  return useQuery<Stay[], Error>({
    queryKey: ["stays", "search", filters],
    queryFn: () => searchStays(filters),
    placeholderData: keepPreviousData, // ⬅️ équivalent v5 de keepPreviousData
    staleTime: 60_000,
  });
}

// Avec placeholderData: keepPreviousData
// React Query garde l’ancienne data visible pendant qu’il télécharge la nouvelle.