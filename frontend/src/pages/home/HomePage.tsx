// src/pages/home/HomePage.tsx
import { useState } from "react";
import PageHero from "@/components/PageHero";
import StayMap from "@/components/StayMap";
import StayCard from "@/components/StayCard";
import { useStays } from "@/hooks/useStays";

export default function HomePage() {
  const { data = [], isLoading, isError, error, refetch } = useStays();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <>
      <PageHero />

      {/* Carte + liste */}
      <section className="mx-auto max-w-7xl px-4">
        {isLoading && (
          <p className="text-slate-600">Chargement des séjours…</p>
        )}

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

        {!isLoading && !isError && data.length === 0 && (
          <div className="h-[360px] w-full rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500">
            Aucun séjour disponible pour le moment.
          </div>
        )}

        {data.length > 0 && (
          <>
            {/* Carte (hauteur définie dans le composant) */}
            <div className="mt-2">
              <StayMap
                stays={data}
                selectedId={selectedId}
                onMarkerClick={(id) => setSelectedId(id)}
              />
            </div>

            {/* Grille de cartes */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((stay) => (
                <StayCard
                  key={stay.id}
                  stay={stay}
                  onClick={() => setSelectedId(stay.id)}
                  isActive={selectedId === stay.id}  
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* A la une */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-emerald-700 font-semibold text-xl mb-4">À la une</h2>
        <div className="grid md:grid-cols-[1fr_280px] gap-8">
          <p className="text-slate-600 leading-relaxed">
            Texte éditorial (placeholder) — présentation d’un séjour ou d’une initiative.
          </p>
          <div className="aspect-video rounded-xl bg-slate-200" />
        </div>
      </section>

      {/* Notre mission */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
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
