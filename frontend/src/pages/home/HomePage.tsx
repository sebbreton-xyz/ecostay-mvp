import { useEffect, useMemo, useRef, useState } from "react";
import PageHero from "@/components/PageHero";
import StayMap from "@/components/StayMap";
import StayCard from "@/components/StayCard";
import { useStays } from "@/hooks/useStays";
import { useCategories } from "@/hooks/useCategories";
import CategoryFilter from "@/components/CategoryFilter";
import type { Stay } from "@/types/stay";
import FeaturedStory from "@/components/FeaturedStory";
import menhir from "@/assets/bretagne/cabane-menhir.png";
import ensoleillee from "@/assets/bretagne/cabane-ensoleillee.png";
import MissionTeaser from "@/components/MissionTeaser";

type ViewMode = "list" | "map";

function stayHasAnyCategory(stay: Stay, selected: number[]) {
  if (!selected.length) return true;
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
  const [view, setView] = useState<ViewMode>(() =>
    window.innerWidth < 768 ? "list" : "list"
  );

  // distinguer l’origine de la sélection (map vs liste)
  const lastOriginRef = useRef<"map" | "list" | null>(null);
  const selectFromMap = (id: number) => {
    lastOriginRef.current = "map";
    setSelectedId(id);
  };
  const selectFromList = (id: number) => {
    lastOriginRef.current = "list";
    setSelectedId(id);
  };

  // scrollIntoView UNIQUEMENT si la sélection vient de la carte
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  useEffect(() => {
    if (!selectedId) return;
    if (lastOriginRef.current !== "map") return;
    const el = cardRefs.current[selectedId];
    if (el && view === "list") el.scrollIntoView({ block: "center", behavior: "smooth" });
    lastOriginRef.current = null;
  }, [selectedId, view]);

  const filtered = useMemo(
    () => data.filter((s) => stayHasAnyCategory(s, selectedCats)),
    [data, selectedCats]
  );
  const count = filtered.length;

  const toggleCat = (id: number) => {
    setSelectedCats((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
    setSelectedId(null);
  };

  // taille carrée de la carte, même hauteur pour la liste
  const mapBoxRef = useRef<HTMLDivElement | null>(null);
  const [mapHeight, setMapHeight] = useState<number>(0);

  // hauteur de secours si la mesure n’est pas encore arrivée
  const fallbackHeight = useMemo(() => {
    if (typeof window === "undefined") return 480;
    return Math.max(window.innerHeight - 160, 360);
  }, []);

  useEffect(() => {
    const el = mapBoxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setMapHeight(e.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <PageHero />

      {/* Barre de recherche entre le bandeau et la carte (placeholder) */}
      <section className="mx-auto w-full max-w-screen-2xl px-6">
        <div className="relative">
          <input
            placeholder="Rechercher…"
            className="w-full rounded-xl border px-4 py-2"
          />
        </div>
      </section>

      {/* Zone chargement/erreur + filtres catégories */}
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
      </section>

      {/* Empty state */}
      {!isLoading && !isError && count === 0 && (
        <section className="mx-auto w-full max-w-screen-2xl px-6">
          <div className="h-[360px] w-full rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500">
            Aucun séjour disponible pour le moment.
          </div>
        </section>
      )}

      {/* Entête résultats + toggle mobile */}
      {count > 0 && (
        <section className="mx-auto w-full max-w-screen-2xl px-6 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg md:text-xl font-semibold">À la une</h2>
              <span className="text-sm text-slate-600">{count} séjours</span>
            </div>

            {/* Toggle mobile: Liste | Carte */}
            <div className="md:hidden inline-flex rounded-lg border p-1">
              {(["list", "map"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={[
                    "px-3 py-1.5 text-sm rounded-md",
                    view === v ? "bg-slate-900 text-white" : "text-slate-700",
                  ].join(" ")}
                  aria-pressed={view === v}
                >
                  {v === "list" ? "Liste" : "Carte"}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Layout Liste | Carte (map carrée, mêmes hauteurs) */}
      {count > 0 && (
        <section className="mx-auto w-full max-w-screen-2xl px-6 pb-8">
          <div className="md:grid md:grid-cols-[minmax(360px,520px)_1fr] md:gap-4">
            {/* LISTE : hauteur liée à la carte, scroll interne contrôlé */}
            <div
              className={[
                "overscroll-contain", // évite de scroller la page/la carte
                view === "map" ? "hidden md:block" : "block",
                "md:overflow-y-auto",
              ].join(" ")}
              style={{ height: mapHeight || fallbackHeight }} // égalise la hauteur avec la carte
            >
              <div className="space-y-3 py-4">
                {filtered.map((stay) => (
                  <div
                    key={stay.id}
                    ref={(el) => { cardRefs.current[stay.id] = el; }}
                    onClick={() => selectFromList(stay.id)} // sélection au clic seulement
                  >
                    <StayCard stay={stay} isActive={selectedId === stay.id} />
                  </div>
                ))}
              </div>
            </div>

            {/* CARTE : sticky + aspect carré */}
            <div
              className={[
                "md:sticky md:top-[140px]",
                view === "list" ? "hidden md:block" : "block mt-3",
              ].join(" ")}
            >
              <div
                ref={mapBoxRef}
                className="relative w-full aspect-square rounded-xl overflow-hidden border
                           min-h-[320px] md:min-h-[420px]"
              >
                <div className="absolute inset-0">
                  <StayMap
                    stays={filtered}
                    selectedId={selectedId}
                    onMarkerClick={selectFromMap}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Édito */}
      <FeaturedStory
        title="Dormir comme il y a 6 000 ans — Cabane néolithique en Bretagne"
        chapo="Dans les Monts d’Arrée, Lila et Maël ont rebâti une cabane de roseaux, noisetier et torchis. Une nuit ici, c’est le souffle de l’ouest, la bruyère en fleur, et le feu qui rassemble — comme autrefois."
        cta={{ label: "Découvrir la cabane", href: "/decouverte/dormir-autrement" }}
        hero={{
          src: menhir,
          alt: "Cabane néolithique sur la lande des Monts d’Arrée, parois en noisetier tressé, toit de roseaux, menhir dans la brume.",
          caption:
            "Cabane néolithique reconstruite en Bretagne — noisetier tressé, torchis d’argile, toit de roseaux, sur la lande des Monts d’Arrée.",
        }}
        secondary={{
          src: ensoleillee,
          alt: "Groupe souriant tressant les parois en noisetier devant une cabane néolithique, lande bretonne ensoleillée.",
        }}
      />

      <MissionTeaser />

      {/* Chiffres clés */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-xl font-semibold text-emerald-700">Chiffres clés</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "3", d: "piliers (sobriété, local, transparence)" },
            { k: "6", d: "engagements concrets" },
            { k: "2025", d: "déploiement des scores publics" },
            { k: "100%", d: "données sourçables et explicables" },
          ].map(({ k, d }) => (
            <div key={k} className="rounded-xl border p-5 bg-white">
              <div className="text-3xl font-semibold text-emerald-700">{k}</div>
              <div className="text-sm text-slate-600">{d}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
