// src/hooks/useStays.ts
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { getAllStays, getStay } from "@/services/stays";
import type { Stay } from "@/types/stay";

const staysKeys = {
  all: ["stays"] as const,
  list: () => [...staysKeys.all, "list"] as const,
  detail: (id: number | string) => [...staysKeys.all, "detail", id] as const,
};

export function useStays(options?: UseQueryOptions<Stay[], Error>) {
  return useQuery({
    queryKey: staysKeys.list(),
    queryFn: getAllStays,
    staleTime: 1000 * 60, // 1 min
    ...options,
  });
}

export function useStay(id: number | string, options?: UseQueryOptions<Stay, Error>) {
  return useQuery({
    queryKey: staysKeys.detail(id),
    queryFn: () => getStay(id),
    enabled: !!id,
    staleTime: 1000 * 60,
    ...options,
  });
}
