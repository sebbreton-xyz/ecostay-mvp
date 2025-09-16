// src/pages/decouverte/DormirAutrement.tsx
import { useStays } from "@/hooks/useStays";
import StayCard from "@/components/StayCard";
import PageHero from "@/components/PageHero"; // si tu l’as, sinon remplace par un <h1>

export default function DormirAutrement() {
  const { data, isLoading, isError, error, refetch } = useStays();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageHero
        title="Dormir autrement"
        subtitle="Séjours éco-responsables, authentiques et ancrés dans le local."
      />

      {isLoading && (
        <p className="mt-6 text-slate-600">Chargement des séjours…</p>
      )}

      {isError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
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

      {data && data.length === 0 && (
        <p className="mt-6 text-slate-600">Aucun séjour disponible pour le moment.</p>
      )}

      {data && data.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((stay) => (
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>
      )}
    </div>
  );
}
