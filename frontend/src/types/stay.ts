// src/types/stay.ts
export type Stay = {
    id: number;
    title: string;
    city: string | null;
    price?: string | number | null;
    created_at?: string;
    // eco_score: number | null;
    // Anticipation pour la carte (plus tard) :
    latitude?: number | null;
    longitude?: number | null;
    is_demo?: boolean;
    // Si l’API expose d’autres champs, on les ajoutera ici
};
