// src/pages/home/HomePage.tsx
import { useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import StayMap from "@/components/StayMap";
import StayCard from "@/components/StayCard";
import { useStays } from "@/hooks/useStays";
import { useCategories } from "@/hooks/useCategories";
import CategoryFilter from "@/components/CategoryFilter";
import type { Stay } from "@/types/stay";

function stayHasAnyCategory(stay: Stay, selected: number[]) {
  if (!selected.length) return true;
  // Le backend renvoie "category" (FK) : soit un id, soit un objet
  const cat = (stay as any).category;
  if (!cat) return false;
  const catId = typeof cat === "number" ? cat : cat.id;
  return selected.includes(catId);
}

export default function HomePage() {
  const { data = [], isLoading, isError, error, refetch } = useStays();
  const {
    data: categories = [],
    isLoading: loadingCats,
    isError: errorCats,
  } = useCategories();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () => data.filter((s) => stayHasAnyCategory(s, selectedCats)),
    [data, selectedCats]
  );

  const toggleCat = (id: number) => {
    setSelectedCats((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
    setSelectedId(null); // reset sélection quand on change de filtre
  };

  return (
    <>
      <PageHero />

      {/* Barre de recherche entre le bandeau et la carte */}
      <section className="mx-auto w-full max-w-screen-2xl px-6">
        <div className="relative">
          <input
            placeholder="Rechercher…"
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>
      </section>

      {/* Zone chargement/erreur + catégories */}
      <section className="mx-auto w-full max-w-screen-2xl px-6">
        {isLoading && <p className="text-slate-600">Chargement des séjours…</p>}

        {isError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Impossible de charger les séjours.</p>
            <p className="text-sm opacity-80">Détail : {error?.message}</p>
            <button
              className="mt-3 rounded-lg border px-3 py-1 text-sm"
              onClick={() => refetch()}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Filtre catégories */}
        <div className="mt-4 mb-3">
          {loadingCats && (
            <p className="text-slate-500 text-sm">Chargement des catégories…</p>
          )}
          {!loadingCats && !errorCats && (
            <CategoryFilter
              categories={categories}
              selectedIds={selectedCats}
              onToggle={toggleCat}
            />
          )}
        </div>

        {/* État vide */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="h-[360px] w-full rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500">
            Aucun séjour disponible pour le moment.
          </div>
        )}
      </section>

      {/* Carte FULL-BLEED (hors conteneur centré) */}
      {filtered.length > 0 && (
        <section className="mt-2">
          <div className="relative left-1/2 -translate-x-1/2 w-screen">
            <StayMap
              stays={filtered}
              selectedId={selectedId}
              onMarkerClick={(id) => setSelectedId(id)}
            />
          </div>
        </section>
      )}

      {/* Liste scrollable + bouton Afficher plus */}
      {filtered.length > 0 && (
        <section className="mx-auto w-full max-w-screen-2xl px-6 mt-4">
          <div className="relative">
            <div
              className={[
                "transition-[max-height] duration-300 ease-in-out",
                expanded ? "max-h-[200rem]" : "max-h-[70vh]",
                "overflow-y-auto pr-2 -mr-2", // évite le décalage dû à la scrollbar
              ].join(" ")}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((stay) => (
                  <StayCard
                    key={stay.id}
                    stay={stay}
                    onClick={() => setSelectedId(stay.id)}
                    isActive={selectedId === stay.id}
                  />
                ))}
              </div>
            </div>

            {/* Dégradé de fin quand replié */}
            {!expanded && filtered.length > 6 && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
            )}
          </div>

          {/* Bouton Afficher plus / Réduire */}
          {filtered.length > 6 && (
            <div className="flex justify-center mt-2">
              <button
                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Réduire la liste" : "Afficher plus"}
              </button>
            </div>
          )}
        </section>
      )}

      {/* À la une */}
      <section className="mx-auto w-full max-w-screen-2xl px-6 py-12">
        <h2 className="text-emerald-700 font-semibold text-xl mb-4">À la une</h2>
        <div className="grid md:grid-cols-[1fr_280px] gap-8">
          <p className="text-slate-600 leading-relaxed">
            Texte éditorial (placeholder) — présentation d’un séjour ou d’une initiative.
          </p>
          <div className="aspect-video rounded-xl bg-slate-200" />
        </div>
      </section>

      {/* Notre mission */}
      <section className="mx-auto w-full max-w-screen-2xl px-6 pb-16">
        <h2 className="text-emerald-700 font-semibold text-xl mb-4">Notre mission</h2>
        <div className="grid md:grid-cols-[1fr_280px] gap-8 items-start">
          <p className="text-slate-600 leading-relaxed">
            Texte long sur la mission EcoStay (placeholder).
          </p>
          <div className="aspect-[4/3] rounded-xl bg-slate-200" />
        </div>
      </section>
    </>
  );
}
