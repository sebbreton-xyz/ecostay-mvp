// src/services/stays.ts
import { api } from "@/lib/api";
import type { Stay } from "@/types/stay";

export async function getAllStays(): Promise<Stay[]> {
  const { data } = await api.get<Stay[]>("/stays/");
  return data;
}

export async function getStay(id: number | string): Promise<Stay> {
  const { data } = await api.get<Stay>(`/stays/${id}/`);
  return data;
}

//Si le DRF est en trailing slash, les chemins ci-dessus sont OK.
//Si ce n’est pas le cas, retirer simplement le / final.