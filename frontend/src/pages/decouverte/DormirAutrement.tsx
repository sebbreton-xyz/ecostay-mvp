import { useEffect, useMemo, useRef, useState } from "react";
import StayMap from "@/components/StayMap";
import StayCard from "@/components/StayCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useCategories } from "@/hooks/useCategories";
import { useStaysSearch } from "@/hooks/useStaysSearch";
import type { Stay } from "@/types/stay";

type ViewMode = "list" | "map";

function stayHasAnyCategory(stay: Stay, selected: number[]) {
  if (!selected.length) return true;
  const cat = (stay as any).category;
  if (!cat) return false;
  const catId = typeof cat === "number" ? cat : cat.id;
  return selected.includes(catId);
}

export default function DormirAutrement() {
  // --------- Filtres (UI) ----------
  const [query, setQuery] = useState("");            // "Rechercher (titre/ville)"
  const [city, setCity] = useState("");              // filtre exact ville
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [ordering, setOrdering] = useState<string>("-created_at"); // récents d'abord
  const [view, setView] = useState<ViewMode>(() => (window.innerWidth < 768 ? "list" : "list"));
  const [onlyWithCoords, setOnlyWithCoords] = useState(true); // utile pour la vue carte
  // const stripAccents = (s: string) =>
  //   s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  // Normalisation alignée avec le backend (accents, élisions, apostrophes, tirets)
  const normalizeQuery = (s: string) =>
    s
      ?.normalize("NFD").replace(/\p{Diacritic}/gu, "") // enlève accents
      ?.replace(/\bqu'\s*/gi, "")                       // qu'…  -> …
      ?.replace(/\b[ldjtnsmc]'\s*/gi, "")               // l'/d'/j'/t'/n'/s'/m'/c' -> …
      ?.replace(/[’'`]\s*/g, "")                        // apostrophes restantes
      ?.replace(/[—–-]/g, " ")                          // tirets -> espace
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s+/g, " ") || undefined;


  // catégories (pour afficher les chips + récupérer le slug)
  const { data: categories = [] } = useCategories();

  // on limite à 1 catégorie côté API (le backend filtre un seul slug) ; UI reste chips
  const selectedSlug =
    categories.find((c: any) => c.id === selectedCats[0])?.slug ?? undefined;

  // --------- Requête API ----------
  const { data = [], isLoading, isError, error, refetch, isFetching } =
    useStaysSearch({
      // search: query || undefined, // déjà insensible à la casse côté DRF
      // q: query ? stripAccents(query) : undefined, // insensible à la casse + accents côté backend
      // IMPORTANT : n'envoyer QUE q, pour éviter le double filtrage DRF SearchFilter
      q: normalizeQuery(query),
      city: city || undefined,
      category: selectedSlug,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      has_coords: onlyWithCoords ? "true" : undefined,
      ordering: ordering as any,
    });

  // --------- Sélection + synchronisation Liste/Carte ----------
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const lastOriginRef = useRef<"map" | "list" | null>(null);
  const selectFromMap = (id: number) => { lastOriginRef.current = "map"; setSelectedId(id); };
  const selectFromList = (id: number) => { lastOriginRef.current = "list"; setSelectedId(id); };

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  useEffect(() => {
    if (!selectedId || lastOriginRef.current !== "map") return;
    const el = cardRefs.current[selectedId];
    if (el && view === "list") el.scrollIntoView({ block: "center", behavior: "smooth" });
    lastOriginRef.current = null;
  }, [selectedId, view]);

  // --------- Filtres client (si multi-catégories cochées) ----------
  const filtered = useMemo(
    () => data.filter((s) => stayHasAnyCategory(s, selectedCats)),
    [data, selectedCats]
  );
  const count = filtered.length;

  const toggleCat = (id: number) => {
    // simple "single select" pour coller au filtre API
    setSelectedCats((cur) => (cur[0] === id ? [] : [id]));
    setSelectedId(null);
  };

  // --------- Carte carrée (liste = même hauteur) ----------
  const mapBoxRef = useRef<HTMLDivElement | null>(null);
  const [mapHeight, setMapHeight] = useState<number>(0);
  useEffect(() => {
    const el = mapBoxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setMapHeight(e.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // --------- Pagination simple (client) ----------
  const [visible, setVisible] = useState(12);
  useEffect(() => setVisible(12), [query, city, selectedSlug, minPrice, maxPrice]); // reset à chaque changement

  return (
    <>
      <section className="mx-auto w-full max-w-screen-2xl px-6 pt-4 pb-2">
        <h1 className="text-2xl font-semibold">Dormir autrement</h1>
        <p className="text-slate-600">Séjours éco-responsables, authentiques et ancrés dans le local.</p>
      </section>

      {/* Barre de recherche + filtres (collée à l’API) */}
      <section className="mx-auto w-full max-w-screen-2xl px-6">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher (titre, ville)…"
              className="w-full rounded-xl border px-4 py-2"
              aria-label="Rechercher un séjour"
            />
          </div>
          <div className="md:col-span-3">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville exacte (ex. Sarlat)…"
              className="w-full rounded-xl border px-4 py-2"
              aria-label="Ville"
            />
          </div>
          <div className="md:col-span-3 grid grid-cols-2 gap-2">
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Prix min"
              className="w-full rounded-xl border px-3 py-2"
              aria-label="Prix minimum"
            />
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Prix max"
              className="w-full rounded-xl border px-3 py-2"
              aria-label="Prix maximum"
            />
          </div>
          <div className="md:col-span-2">
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
              aria-label="Trier par"
            >
              <option value="-created_at">Les plus récents</option>
              <option value="price">Prix croissant</option>
              <option value="-price">Prix décroissant</option>
              <option value="title">Titre A→Z</option>
              <option value="-title">Titre Z→A</option>
            </select>
          </div>
        </div>

        {/* Catégories (chips) */}
        <div className="mt-3">
          <CategoryFilter
            categories={categories}
            selectedIds={selectedCats}
            onToggle={toggleCat}
          />
        </div>

        {/* Barre options carte */}
        <div className="mt-2 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyWithCoords}
              onChange={(e) => setOnlyWithCoords(e.target.checked)}
            />
            <span>Uniquement les séjours géolocalisés</span>
          </label>

          <div className="ml-auto md:hidden inline-flex rounded-lg border p-1">
            {(["list", "map"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm rounded-md ${view === v ? "bg-slate-900 text-white" : "text-slate-700"}`}
                aria-pressed={view === v}
              >
                {v === "list" ? "Liste" : "Carte"}
              </button>
            ))}
          </div>
        </div>

        {/* État chargement/erreur */}
        {isLoading && <p className="mt-2 text-slate-600">Chargement…</p>}
        {isError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Impossible de charger les séjours.</p>
            <p className="text-sm opacity-80">Détail : {error?.message}</p>
            <button className="mt-3 rounded-lg border px-3 py-1 text-sm" onClick={() => refetch()}>
              Réessayer
            </button>
          </div>
        )}
      </section>

      {/* Résultats */}
      {!isLoading && !isError && (
        <section className="mx-auto w-full max-w-screen-2xl px-6 pb-10">
          {/* header résultats + toggle desktop */}
          <div className="mt-3 mb-2 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg md:text-xl font-semibold">Résultats</h2>
              <span className="text-sm text-slate-600">{isFetching ? "Mise à jour…" : `${count} séjours`}</span>
            </div>
            <div className="hidden md:inline-flex rounded-lg border p-1">
              {(["list", "map"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-sm rounded-md ${view === v ? "bg-slate-900 text-white" : "text-slate-700"}`}
                  aria-pressed={view === v}
                >
                  {v === "list" ? "Liste" : "Carte"}
                </button>
              ))}
            </div>
          </div>

          {count === 0 ? (
            <div className="h-[360px] w-full rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500">
              Aucun séjour pour ces filtres.
            </div>
          ) : (
            <div className="md:grid md:grid-cols-[minmax(360px,520px)_1fr] md:gap-4">
              {/* LISTE — même hauteur que la carte */}
              <div
                className={[
                  "overscroll-contain",
                  view === "map" ? "hidden md:block" : "block",
                  "md:overflow-y-auto",
                ].join(" ")}
                style={{ height: mapHeight || undefined }}
              >
                <div className="space-y-3 py-3">
                  {filtered.slice(0, visible).map((stay) => (
                    <div
                      key={stay.id}
                      ref={(el) => { cardRefs.current[stay.id] = el; }}
                      onClick={() => selectFromList(stay.id)}
                    >
                      <StayCard stay={stay} isActive={selectedId === stay.id} />
                    </div>
                  ))}
                </div>

                {visible < filtered.length && view !== "map" && (
                  <div className="py-2 flex justify-center">
                    <button
                      onClick={() => setVisible((v) => v + 12)}
                      className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                    >
                      Afficher plus
                    </button>
                  </div>
                )}
              </div>

              {/* CARTE — sticky + carrée */}
              <div className={["md:sticky md:top-[140px]", view === "list" ? "hidden md:block" : "block mt-3"].join(" ")}>
                <div ref={mapBoxRef} className="relative w-full aspect-square rounded-xl overflow-hidden border">
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
          )}
        </section>
      )}
    </>
  );
}
