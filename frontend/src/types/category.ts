// src/types/category.ts
export type Category = {
  id: number;
  name: string;           // <- affichage normalisé (vient de name_fr)
  slug: string;
  // champs bruts gardés si besoin plus tard
  name_fr?: string;
  name_en?: string;
  stays_count?: number;
};
